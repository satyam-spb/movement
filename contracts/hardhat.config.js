require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/hMUuqF5vDyM2jP7oyGAKg0E3PXNevqX5", // Replace with your Sepolia RPC URL
      accounts: ["510576c1a543e27c8d44af9b26b61997ec1073f013f74df67f6d7cdea15850d6"], // Replace with your wallet's private key
    },
  },
};
