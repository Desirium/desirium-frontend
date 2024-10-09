import {FC, useEffect, useMemo, useCallback, useState} from 'react';
import {ConnectionProvider, WalletProvider, useWallet} from '@solana/wallet-adapter-react';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {SolflareWalletAdapter} from '@solana/wallet-adapter-wallets';
import {WalletModalProvider, WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import './WalletConnect.css';
import {Link} from "react-router-dom";
import {userDataType, wishListDataType} from "../types";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Avatar, TextField} from "@mui/material";


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
    const {publicKey, connected, sendTransaction} = useWallet();
    const [userData, setUserData] = useState<userDataType>();
    const [wishList, setWishList] = useState([]);
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    const fetchAllWishesForUserByUserId = useCallback(async (id: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/wishlist/user/${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log('Successfully fetched wishlists from backend');
                const responseBody = await response.json();
                setWishList(responseBody);
                console.log(responseBody)
                console.log(wishList)
                return responseBody;
            } else {
                console.error('Failed to send data to the backend');
            }
        } catch (error) {
            console.error('Error sending request to the backend:', error);
        }
    }, []);

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
                console.log(responseBody.id)
                await fetchAllWishesForUserByUserId(responseBody.id);
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

    const [open, setOpen] = useState(false);

    const [giftAmount, setGiftAmount] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const wishListWallet = "D9Pn2KWJoheQ78K5tXZZ1TgQHTWYkEizdUkp4kDAQmN9";

    const handleGift = async () => {
        if (!publicKey) {
            alert("Please connect your wallet.");
            return;
        }
        const number = parseFloat(giftAmount);

        if (isNaN(number)) {
            alert("The input cannot be converted to a number.");
            return;
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(wishListWallet),
                lamports: number * LAMPORTS_PER_SOL,
            })
        );

        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'confirmed');
        handleClose();

        console.log(wishListWallet)
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: "32px",
    };

    if (connected) {
        console.log(userData);
        return (
            <div className="screen-flex-position">
                <div className="base-container base-user-container">
                    <div className="user-info-container">
                        <div className="user-image">
                            <Avatar
                                alt="avator"
                                sx={{
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '193px',
                                    height: '218px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    textAlign: 'center',
                                    borderRadius: '8px',
                                }}
                                src={userData?.image ? userData.image : '/images/wishlist-placeholder.svg'}/>
                        </div>


                        <div className="user-info">
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div className="user-info-base-info">
                                    <h3 style={{marginRight: "5px"}}>
                                        {userData?.name && userData?.surname
                                            ? `${userData.name} ${userData.surname}`
                                            : "First | Last name"}
                                    </h3>
                                </div>
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
                                <a className="socials" href={userData?.instagram ? userData.instagram : "#"}
                                   target="_blank">
                                    <img src="/images/socials/instagram.svg" alt="instagram"></img>
                                    <p>Instagram</p>
                                </a>

                                <a className="socials" href={userData?.tiktok ? userData.tiktok : "#"} target="_blank">
                                    <img src="/images/socials/tiktok.svg" alt="tiktok"></img>
                                    <p>TikTok</p>
                                </a>

                                <a className="socials" href={userData?.twitter ? userData.twitter : "#"}
                                   target="_blank">
                                    <img src="/images/socials/twitter.svg" alt="twitter"></img>
                                    <p>Twitter</p>
                                </a>

                                <a className="socials" href={userData?.linkedin ? userData.linkedin : "#"}
                                   target="_blank">
                                    <img src="/images/socials/linkedin.svg" alt="linkedin"></img>
                                    <p>Linkedin</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="base-container description-container">
                    {userData ? (<p>{userData.description}</p>) : (<p>{"Empty description."}</p>)}
                </div>

                <div className="base-container whishlist-container">
                    <hr className="divider-small" style={{marginBottom: "20px"}}></hr>

                    <div className="whishlist-title">
                        <h2>My wishlist</h2>
                    </div>

                    <hr className="divider-large"></hr>


                    {
                        wishList ? wishList.map(element => (
                            <div className="user-info-container">
                                <div className="user-image">
                                    <Avatar
                                        alt="avator"
                                        sx={{
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            width: '193px',
                                            height: '218px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            textAlign: 'center',
                                            borderRadius: '8px',
                                        }}
                                        src={element?.image ? element.image : '/images/wishlist-placeholder.svg'}/>
                                </div>
                                <div className="user-info">
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <div className="user-info-base-info">
                                            <h3 style={{marginRight: "5px"}}>
                                                {element.name}
                                            </h3>
                                            <p style={{marginRight: "5px"}}>{element.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : <p></p>
                    }
                </div>

                <div>
                    <Button onClick={handleOpen}
                            style={{
                                backgroundColor: "#47279B",
                                borderRadius: "32px",
                                fontSize: "20px",
                                color: "white",
                                width: "430px",
                                marginBottom: "30px",
                                padding: "15px"
                            }}
                    >Make a wish</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" color="#030214"
                                        marginBottom={"5px"} marginLeft={"2px"}
                            >
                                Enter the amount
                            </Typography>
                            <TextField
                                inputMode="numeric"
                                InputProps={{
                                    inputMode: "decimal",
                                    style: {
                                        borderRadius: "32px",
                                    }
                                }}
                                style={{
                                    width: "390px",
                                }}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setGiftAmount(event.target.value);
                                }}

                            />
                            <Button onClick={handleGift}
                                    style={{
                                        backgroundColor: "#47279B",
                                        borderRadius: "32px",
                                        fontSize: "20px",
                                        color: "white",
                                        width: "390px",
                                        height: "60px",
                                        marginTop: "20px"
                                    }}>Give</Button>
                        </Box>
                    </Modal>
                </div>
            </div>
        )
    } else {
        return (
            <div className="wallet-connect-container">
                <h2>Sign up</h2>
                <p>Connect a wallet</p>
                <WalletMultiButton/>
            </div>
        );
    }
};

export default WalletConnect;
