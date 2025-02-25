// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PredictionMarket {
    struct Bet {
        address creator;
        string title;
        uint256 amount;
        uint256 deadline;
        bool resolved;
        address[] participants;
    }

    Bet[] public bets;

    address private platformAddress; // Address to receive fees
    uint256 private feePercentage; // Percentage of bets to be taken as fees

    event BetCreated(uint256 betId, address creator, string title, uint256 amount);
    event BetJoined(uint256 betId, address participant);
    event BetResolved(uint256 betId, address winner);

    constructor() {
        platformAddress = 0x...; // Set the platform address (replace with actual address)
        feePercentage = 5; // Example: 5% fee
    }

    function createBet(string memory _title, uint256 _duration) external payable {
        require(msg.value > 0, "Bet amount must be greater than 0");
        
        // Calculate and transfer fee to platform
        uint256 feeAmount = (msg.value * feePercentage) / 100;
        payable(platformAddress).transfer(feeAmount);

        // Adjust bet amount after deducting fee
        uint256 adjustedBetAmount = msg.value - feeAmount;

        bets.push(Bet({
            creator: msg.sender,
            title: _title,
            amount: adjustedBetAmount,
            deadline: block.timestamp + _duration,
            resolved: false,
            participants: new address[](0)
        }));

        emit BetCreated(bets.length - 1, msg.sender, _title, adjustedBetAmount);
    }

    function joinBet(uint256 _betId) external payable {
        Bet storage bet = bets[_betId];
        require(msg.value == bet.amount, "Must match bet amount");
        require(block.timestamp < bet.deadline, "Bet deadline passed");

        // Calculate and transfer fee to platform
        uint256 feeAmount = (msg.value * feePercentage) / 100;
        payable(platformAddress).transfer(feeAmount);

        // Adjust bet amount after deducting fee
        uint256 adjustedBetAmount = msg.value - feeAmount;

        bet.participants.push(msg.sender);
        emit BetJoined(_betId, msg.sender);
    }

    function resolveBet(uint256 _betId, address winner) external {
        Bet storage bet = bets[_betId];
        require(msg.sender == bet.creator, "Only creator can resolve");
        require(!bet.resolved, "Already resolved");
        require(block.timestamp >= bet.deadline, "Deadline not reached");

        uint256 totalAmount = bet.amount * (bet.participants.length + 1);
        payable(winner).transfer(totalAmount);
        bet.resolved = true;
        
        emit BetResolved(_betId, winner);
    }

    function getActiveBets() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < bets.length; i++) {
            if (!bets[i].resolved && block.timestamp < bets[i].deadline) {
                count++;
            }
        }
        
        uint256[] memory activeBets = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < bets.length; i++) {
            if (!bets[i].resolved && block.timestamp < bets[i].deadline) {
                activeBets[index] = i;
                index++;
            }
        }
        return activeBets;
    }
}
