// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CrowdFunding {
    uint256 public totalCampaigns = 0;

    struct Campaign {
        uint256 campaignId;
        address owner;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 balance;
        bool ended;
    }

    event CampaignStarted(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 goal,
        uint256 deadline
    );
    event CampaignContributed(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );
    event CampaignEnded(uint256 indexed campaignId, bool goalMet);

    /* campaignId -> Campaign */
    mapping(uint256 => Campaign) campaigns;
    /* campaignId -> (contributor -> amount) */
    mapping(uint256 => mapping(address => uint256)) contributions;
    mapping(uint256 => address[]) contributors;

    function startCampaign(
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) public {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_goal > 0, "Goal must be greater than 0");
        campaigns[totalCampaigns] = Campaign({
            campaignId: totalCampaigns,
            owner: msg.sender,
            description: _description,
            goal: _goal,
            deadline: _deadline,
            balance: 0,
            ended: false
        });
        totalCampaigns++;
        
        emit CampaignStarted(totalCampaigns - 1, msg.sender, _goal, _deadline);
    }

    function endCampaign(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            msg.sender == campaign.owner,
            "You are not the owner of this campaign"
        );
        require(!campaign.ended, "Campaign already ended");
        require(
            block.timestamp >= campaign.deadline,
            "Deadline not reached yet"
        );

        if (campaign.balance >= campaign.goal) {
            (bool success, ) = payable(campaign.owner).call{
                value: campaign.balance
            }("");
            require(success, "Transfer to owner failed");
        } else {
            for (uint256 i = 0; i < contributors[_campaignId].length; i++) {
                address contributor = contributors[_campaignId][i];
                uint256 amount = contributions[_campaignId][contributor];
                (bool success, ) = payable(contributor).call{value: amount}("");
                require(success, "Refund to contributor failed");
            }
        }
        campaign.ended = true;
        
        emit CampaignEnded(_campaignId, campaign.balance >= campaign.goal);
    }

    function contribute(uint256 _campaignId, uint256 _amount) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.ended, "Campaign already ended");
        require(block.timestamp < campaign.deadline, "Deadline reached");
        require(_amount > 0, "Contribution must be greater than 0");
        require(msg.value == _amount, "Sent value must match specified amount");

        (bool success, ) = payable(address(this)).call{value: _amount}("");
        require(success, "Transfer to contract failed");

        if (contributions[_campaignId][msg.sender] == 0) {
            contributors[_campaignId].push(msg.sender);
        }
        contributions[_campaignId][msg.sender] += _amount;
        campaign.balance += _amount;
        
        emit CampaignContributed(_campaignId, msg.sender, _amount);
    }

    function getAllCampaigns() public view returns(Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](totalCampaigns);
        for (uint256 i = 0; i<totalCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            allCampaigns[i] = campaign;
        }
        return allCampaigns;
    }

    function getAllDonors(uint256 _campaignId) public view returns(address[] memory) {
        return contributors[_campaignId];
    }
}
