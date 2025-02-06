// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract CrowdFunding {
    error AmountTooLess();

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

    mapping (uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    // mapping (uint256 => address[]) public contributors;

    event CampaignCreated(address indexed owner, string description, uint256 goal, uint256 deadline);

    // modifier here

    function createCampaign(
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) public {
        totalCampaigns++;
        campaigns[totalCampaigns] = Campaign({
            owner: msg.sender,
            description: _description,
            goal: _goal,
            deadline: _deadline,
            balance: 0,
            contributors: new address[](0),
            ended: false
        });

        emit CampaignCreated(msg.sender, _description, _goal, _deadline);
    }

    function fundCampaign(uint256 _campaignId, uint256 _amount) public {
        if(msg.value == 0) {
            revert AmountTooLess();
        }

        Campaign storage campaign = campaigns[_campaignId];

        if (contributions[_campaignId][msg.sender] == 0) {
            campaign.contributors.push(msg.sender);
            (bool success, ) = campaign.owner.call{value: _amount}("");
            campaign.balance += _amount;
            contributions[_campaignId][msg.sender] += msg.value;
        }

        
    }

    function refund(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];

        uint256 contributedAmount = contributions[_campaignId][msg.sender];
        require(contributedAmount > 0, "You have not contributed to this campaign");

        contributions[_campaignId][msg.sender] = 0;
        campaign.balance -= contributedAmount;
        if(campaign.deadline < block.timestamp) {
            if(campaign.balance < campaign.goal) {
                for(uint256 i = 0; i < campaign.contributors.length; i++) {
                    (bool success, ) = campaign.contributors[i].call{value: campaign.contributions[msg.sender]}("");
                }
            }
        }
    }

    function endCampaign(uint256 _campaignId) public {
        if(campaigns[_campaignId].balance >= campaigns[_campaignId].goal && campaigns[_campaignId].deadline < block.timestamp) {
            (bool success, ) = campaigns[_campaignId].owner.call{value: campaigns[_campaignId].balance}("");
        } else {
            refund(_campaignId);
        }
    }
}