import {ChangeEvent, useEffect, useState} from 'react';
import {useLocation} from "react-router";
import { userDataType, wishListDataType } from "../types";
import Button from "@mui/material/Button";

const UpdateProfile = () => {
    const location = useLocation();
    const [userData, setUserData] = useState<userDataType | Record<string, any>>(location.state?.userData || {});
    const [whishlist, setWhishlist] = useState<Array<wishListDataType | Record<string, any>>>([]);


    const handleAddWish = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_id: 4})
            });

            if (response.ok) {
                const result = await response.json();
                console.log('User updated successfully:', result);

                window.location.href = "/";
            } else {
                console.error('Failed to update user:', response.status);
                alert('Failed to update user. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the profile.');
        }
    }

    useEffect(() => {
        setWhishlist({
            name: "",
            sum: "",
            description: "",
            user_id: userData?.id ? userData.id : 4,
            image: "/images/homephoto.png"
        });
        console.log(whishlist)
    }, [userData]);

    // Handler to update state when input changes
    const handleInputChange = (e: any) => {
        const {name, value} = e.target;
        setWhishlist(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const formData = new FormData();
        formData.append('media', file);
        try {
            const response = await fetch(`http://127.0.0.1:3000/wishlist/image/${userData.id}`, {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Uploaded file path:', result.image);
                const name = "image";
                setWhishlist(prevState => ({
                    ...prevState,
                    [name]: result.image
                }));
            } else {
                console.error('Upload error:', result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="screen-flex-position">
            <div className="base-container base-user-container">
                <div className="user-info-container">
                    <div>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-button"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="upload-button">
                            <Button
                                variant="contained"
                                component="span"
                                sx={{
                                    backgroundImage: `url('${whishlist.image}')`,
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
                            >
                            </Button>
                        </label>
                    </div>


                    <div className="user-info-edit">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div className="user-info-base-edit">
                                <input
                                    type="text"
                                    name="name"
                                    value={whishlist.name}
                                    onChange={handleInputChange}
                                    placeholder="Wish"
                                    autoComplete="off"
                                />
                                <input
                                    type="text"
                                    name="sum"
                                    value={whishlist.sum}
                                    onChange={handleInputChange}
                                    placeholder="Sum"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <a href="/">
                                    <img src="/images/discard.svg"></img>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="base-container description-container">
                <textarea
                    name="description"
                    value={whishlist.description}
                    onChange={handleInputChange}
                    placeholder="Tell us in detail about your wish..."
                    autoComplete="off"
                />
            </div>

            <button onClick={handleAddWish} className="saveButton">
                SAVE
            </button>
        </div>
    );
};

export default UpdateProfile;
