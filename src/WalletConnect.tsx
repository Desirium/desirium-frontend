import {FC, useEffect, useMemo, useCallback} from 'react';
import {ConnectionProvider, WalletProvider, useWallet} from '@solana/wallet-adapter-react';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {SolflareWalletAdapter} from '@solana/wallet-adapter-wallets';
import {WalletModalProvider, WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import {clusterApiUrl} from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import './WalletConnect.css';

const WalletConnect: FC = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [new SolflareWalletAdapter()], [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletContent/>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const WalletContent: FC = () => {
    const {publicKey, connected} = useWallet();

    const sendConnectionDataToBackend = useCallback(async (walletAddress: string) => {
        try {
            const response = await fetch('http://127.0.0.1:3000/users', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',                },
                body: JSON.stringify({
                    walletAddress: walletAddress,
                }),
            });

            if (response.ok) {
                console.log('Successfully sent wallet connection data to the backend');
                console.log(response)
                return response.body;
            } else {
                console.error('Failed to send data to the backend');
            }
        } catch (error) {
            console.error('Error sending request to the backend:', error);
        }
    }, []);

    useEffect(() => {
        if (connected && publicKey) {
            sendConnectionDataToBackend(publicKey.toString()).then(res => console.log(res));
        }
    }, [connected, publicKey, sendConnectionDataToBackend]);

    return (
        <div className="wallet-connect-container">
            <h2>Sign up</h2>
            <p>Connect a wallet</p>
            <WalletMultiButton/>
        </div>
    );
};

export default WalletConnect;
