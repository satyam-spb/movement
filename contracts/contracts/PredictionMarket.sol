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
    
    event BetCreated(uint256 betId, address creator, string title, uint256 amount);
    event BetJoined(uint256 betId, address participant);
    event BetResolved(uint256 betId, address winner);

    function createBet(string memory _title, uint256 _duration) external payable {
        require(msg.value > 0, "Bet amount must be greater than 0");
        
        bets.push(Bet({
            creator: msg.sender,
            title: _title,
            amount: msg.value,
            deadline: block.timestamp + _duration,
            resolved: false,
            participants: new address[](0)
        })); // Fixed: Added the missing closing parenthesis
        
        emit BetCreated(bets.length - 1, msg.sender, _title, msg.value);
    }

    function joinBet(uint256 _betId) external payable {
        Bet storage bet = bets[_betId];
        require(msg.value == bet.amount, "Must match bet amount");
        require(block.timestamp < bet.deadline, "Bet deadline passed");

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