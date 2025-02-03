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
        mapping(address => uint256) contributions;
    }

    mapping (uint256 => Campaign) public campaigns;
    // mapping (uint256 => address[]) public contributors;

    event CampaignCreated(address indexed owner, string description, uint256 goal, uint256 deadline);

    // modifier here

    function createCampaign(
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) public {
        totalCampaigns++;
        Campaign storage newCampaign = campaigns[totalCampaigns];
        newCampaign.owner = msg.sender;
        newCampaign.description = _description;
        newCampaign.goal = _goal;
        newCampaign.deadline = _deadline;
        newCampaign.balance = 0;

        emit CampaignCreated(msg.sender, _description, _goal, _deadline);
    }

    function fundCampaign(uint256 _campaignId) public payable {
        if(msg.value == 0) {
            revert AmountTooLess();
        }
        Campaign storage campaign = campaigns[_campaignId];
        (bool success, ) = campaign.owner.call{value: msg.value}("");

        if(success) {
            campaign.balance += msg.value;
            campaign.contributors.push(msg.sender);
            campaign.contributions[msg.sender] += msg.value;
        }
    }

    function refund(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
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