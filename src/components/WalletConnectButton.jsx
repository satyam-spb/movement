import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

const MOVEMENT_NETWORK_PARAMS = {
    chainId: "0x780c",
    chainName: "Movement EVM Testnet",
    nativeCurrency: {
        name: "MOVE",
        symbol: "MOVE",
        decimals: 18,
    },
    rpcUrls: ["https://mevm.testnet.imola.movementlabs.xyz"],
    blockExplorerUrls: ["https://explorer.movementlabs.xyz/?network=testnet"],
};

const WalletConnect = () => {
    const { authenticated, linkWallet, user } = usePrivy();

    useEffect(() => {
        const addAndSwitchNetwork = async () => {
            if (window.ethereum && user?.wallet?.address) {
                try {
                    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

                    if (currentChainId !== MOVEMENT_NETWORK_PARAMS.chainId) {
                        await window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [MOVEMENT_NETWORK_PARAMS],
                        });

                        await window.ethereum.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: MOVEMENT_NETWORK_PARAMS.chainId }],
                        });
                    }
                } catch (error) {
                    console.error("Error adding or switching network:", error);
                }
            }
        };

        if (authenticated) {
            addAndSwitchNetwork();
        }
    }, [authenticated, user]);

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            {authenticated ? (
                user.wallet ? (
                    <p>Connected Wallet: {user.wallet.address}</p>
                ) : (
                    <button onClick={linkWallet}>Connect Wallet</button>
                )
            ) : (
                <button onClick={linkWallet}>Login & Connect Wallet</button>
            )}
        </div>
    );
};

export default WalletConnect;
