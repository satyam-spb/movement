const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");

    // Deploy the contract
    const market = await PredictionMarket.deploy();

    // Wait for the contract to be deployed
    await market.waitForDeployment();

    // Log the contract address
    console.log("PredictionMarket deployed to:", await market.getAddress());
}

// Run the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });