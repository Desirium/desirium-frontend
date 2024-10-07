import {FC, useEffect, useMemo, useCallback, useState} from 'react';
import {ConnectionProvider, WalletProvider, useWallet} from '@solana/wallet-adapter-react';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {SolflareWalletAdapter} from '@solana/wallet-adapter-wallets';
import {WalletModalProvider, WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import {clusterApiUrl} from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import './WalletConnect.css';
import {Link} from "react-router-dom";

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
    const [userData, setUserData] = useState();

    const sendConnectionDataToBackend = useCallback(async (walletAddress: string) => {
        try {
            const response = await fetch('http://127.0.0.1:3000/users', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    walletAddress: walletAddress,
                }),
            });

            if (response.ok) {
                console.log('Successfully sent wallet connection data to the backend');
                const responseBody = await response.json();
                setUserData(responseBody);
                return responseBody;
            } else {
                console.error('Failed to send data to the backend');
            }
        } catch (error) {
            console.error('Error sending request to the backend:', error);
        }
    }, []);

    useEffect(() => {
        if (connected && publicKey) {
            sendConnectionDataToBackend(publicKey.toString()).then(res => res);
        }
    }, [connected, publicKey, sendConnectionDataToBackend]);


    if (connected) {
        console.log(userData);
        return (
            <div className="add-info-container">
                <div className="user-info-container">
                    <div className="user-image">
                        <img src="/images/placeholder-person.svg"></img>
                    </div>



                    <div className="user-info">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <h3 style={{ marginRight: "5px" }}>
                                {userData?.name && userData?.surname
                                    ? `${userData.name} ${userData.surname}`
                                    : "First | Last name"}
                            </h3>
                            <div>
                                <Link to={{
                                    pathname: "/update-profile"
                                }}
                                state={{userData: userData}}>
                                    <img src="/images/update.svg"></img>
                                </Link>
                            </div>
                        </div>

                        <div className="user-info-socials">
                            <a className="socials" href={userData?.instagram ? userData.instagram : "#"} target="_blank">
                                <img src="/images/socials/instagram.svg" alt="instagram"></img>
                                <p>Instagram</p>
                            </a>

                            <a className="socials" href={userData?.tiktok ? userData.tiktok : "#"} target="_blank">
                                <img src="/images/socials/tiktok.svg" alt="tiktok"></img>
                                <p>TikTok</p>
                            </a>

                            <a className="socials" href={userData?.twitter ? userData.twitter : "#"} target="_blank">
                                <img src="/images/socials/twitter.svg" alt="twitter"></img>
                                <p>Twitter</p>
                            </a>

                            <a className="socials" href={userData?.linkedin ? userData.linkedin : "#"} target="_blank">
                                <img src="/images/socials/linkedin.svg" alt="linkedin"></img>
                                <p>Linkedin</p>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="user-description">
                    {userData ? (<p>{userData.description}</p>) : (<p></p>)}

                    <hr className="divider-small"></hr>
                </div>

                <div>
                    <div className="whishlist-title">
                        <h2>My wishlist</h2>
                    </div>

                    <hr className="divider-large"></hr>
                </div>
            </div>
        )
    } else {
        return (
            <div className="wallet-connect-container">
                <h2>Sign up</h2>
                <p>Connect a wallet</p>
                <WalletMultiButton />
            </div>
        );
    }
};

export default WalletConnect;
