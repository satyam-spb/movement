//SmartContractController.js
import { createBet as createBetContract } from '../Web3/web3.js';

// Smart contract interaction
export const createBet = async (req, res) => {
  try {
    const { title, duration, amount } = req.body;
    const result = await createBetContract(title, duration, amount);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error interacting with smart contract:", error);
    res.status(500).json({ error: 'Smart contract interaction failed' });
  }
};
