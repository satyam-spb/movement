import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Debugging: Log environment variables
console.log("Private Key from .env:", process.env.PRIVATE_KEY);
console.log("Sepolia RPC URL:", process.env.SEPOLIA_RPC_URL);
console.log("Contract Address from .env:", process.env.CONTRACT_ADDRESS);

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL );
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Debugging: Log wallet address
console.log("Wallet Address:", wallet.address);

// Initialize contract
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" }
    ],
    "name": "createBet",
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_betId", "type": "uint256" }
    ],
    "name": "joinBet",
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_betId", "type": "uint256" },
      { "internalType": "address", "name": "winner", "type": "address" }
    ],
    "name": "resolveBet",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveBets",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "bets",
    "outputs": [
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "bool", "name": "resolved", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to create a bet
export const createBet = async (title, duration, amount) => {
  try {
    const tx = await contract.createBet(title, duration, { value: amount });
    await tx.wait();
    console.log("Bet created successfully");
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Error creating bet:", error);
    return { success: false, error: error.message };
  }
};

// Function to join a bet
export const joinBet = async (betId, amount) => {
  try {
    const tx = await contract.joinBet(betId, { value: amount });
    await tx.wait();
    console.log("Bet joined successfully");
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Error joining bet:", error);
    return { success: false, error: error.message };
  }
};

// Function to resolve a bet
export const resolveBet = async (betId, winner) => {
  try {
    const tx = await contract.resolveBet(betId, winner);
    await tx.wait();
    console.log("Bet resolved successfully");
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Error resolving bet:", error);
    return { success: false, error: error.message };
  }
};

// Function to get active bets
export const getActiveBets = async () => {
  try {
    const activeBets = await contract.getActiveBets();
    console.log("Active bets:", activeBets);
    return { success: true, data: activeBets };
  } catch (error) {
    console.error("Error getting active bets:", error);
    return { success: false, error: error.message };
  }
};
