// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract CrowdFunding {
    error AmountTooLess();
    error NotCampaignOwner();
    error CampaignNotEnded();
    error GoalNotMet();

    uint256 public totalCampaigns = 0;

    struct Campaign {
        address owner;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 balance;
        address[] contributors;
        bool ended;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event CampaignCreated(address indexed owner, string description, uint256 goal, uint256 deadline);
    event Funded(address indexed contributor, uint256 indexed campaignId, uint256 amount);
    event Refunded(address indexed contributor, uint256 indexed campaignId, uint256 amount);
    event CampaignEnded(uint256 indexed campaignId, address indexed owner, uint256 totalAmount);

    modifier onlyOwner(uint256 _campaignId) {
        if (msg.sender != campaigns[_campaignId].owner) {
            revert NotCampaignOwner();
        }
        _;
    }

    function createCampaign(
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) public {
        require(_goal > 0, "Goal must be greater than zero");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        totalCampaigns++;
        campaigns[totalCampaigns] = Campaign({
            owner: msg.sender,
            description: _description,
            goal: _goal,
            deadline: _deadline,
            balance: 0,
            contributors: new address          ended: false
        });

        emit CampaignCreated(msg.sender, _description, _goal, _deadline);
    }

    function fundCampaign(uint256 _campaignId) public payable {
        if (msg.value == 0) {
            revert AmountTooLess();
        }

        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");

        if (contributions[_campaignId][msg.sender] == 0) {
            campaign.contributors.push(msg.sender);
        }

        campaign.balance += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;

        emit Funded(msg.sender, _campaignId, msg.value);
    }

    function refund(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp > campaign.deadline, "Campaign not ended yet");
        require(campaign.balance < campaign.goal, "Campaign met the goal, no refunds");

        uint256 contributedAmount = contributions[_campaignId][msg.sender];
        require(contributedAmount > 0, "No contributions to refund");

        contributions[_campaignId][msg.sender] = 0;
        campaign.balance -= contributedAmount;

        (bool success, ) = msg.sender.call{value: contributedAmount}("");
        require(success, "Refund failed");

        emit Refunded(msg.sender, _campaignId, contributedAmount);
    }

    function endCampaign(uint256 _campaignId) public onlyOwner(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp > campaign.deadline, "Campaign is still ongoing");
        require(!campaign.ended, "Campaign already ended");

        campaign.ended = true;

        if (campaign.balance >= campaign.goal) {
            uint256 amount = campaign.balance;
            campaign.balance = 0;

            (bool success, ) = campaign.owner.call{value: amount}("");
            require(success, "Transfer to owner failed");

            emit CampaignEnded(_campaignId, campaign.owner, amount);
        } else {
            // Refund contributors if goal is not met
            for (uint256 i = 0; i < campaign.contributors.length; i++) {
                address contributor = campaign.contributors[i];
                uint256 refundAmount = contributions[_campaignId][contributor];

                if (refundAmount > 0) {
                    contributions[_campaignId][contributor] = 0;
                    (bool refunded, ) = contributor.call{value: refundAmount}("");
                    require(refunded, "Refund failed");
                }
            }
        }
    }
}
