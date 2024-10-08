import {ChangeEvent, useEffect, useState} from 'react';
import './UpdateProfile.css';
import {useLocation} from "react-router";
import { userDataType } from "../types";
import Button from "@mui/material/Button";

const UpdateProfile = () => {
    const location = useLocation();
    const [userData, setUserData] = useState<userDataType | Record<string, any>>(location.state?.userData || {});

    const [newUserData, setNewUserData] = useState<userDataType | Record<string, any>>({});

    const handleSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/users/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserData)
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
    };

    useEffect(() => {
        setNewUserData({
            name: userData?.name || "",
            surname: userData?.surname || "",
            instagram: userData?.instagram || "",
            tiktok: userData?.tiktok || "",
            twitter: userData?.twitter || "",
            linkedin: userData?.linkedin || "",
            description: userData?.description || "",
            image: userData?.image || "/images/placeholder-person.svg"
        });
        console.log(newUserData)
    }, [userData]);

    // Handler to update state when input changes
    const handleInputChange = (e: any) => {  // TODO: Fix this type
        const {name, value} = e.target;
        setNewUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const formData = new FormData();
        formData.append('media', file);
        try {
            const response = await fetch(`http://127.0.0.1:3000/users/image/${userData.id}`, {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Uploaded file path:', result.image);
                const name = "image";
                setNewUserData(prevState => ({
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
                                    backgroundImage: `url('${newUserData.image}')`,
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
                                Upload Photo
                            </Button>
                        </label>
                    </div>


                    <div className="user-info-edit">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div className="user-info-base-edit">
                                <input
                                    type="text"
                                    name="name"
                                    value={newUserData.name}
                                    onChange={handleInputChange}
                                    placeholder="First name"
                                    autoComplete="off"
                                />
                                <input
                                    type="text"
                                    name="surname"
                                    value={newUserData.surname}
                                    onChange={handleInputChange}
                                    placeholder="Last name"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <a href="/">
                                    <img src="/images/discard.svg"></img>
                                </a>
                            </div>
                        </div>

                        <div className="user-info-socials">
                            <div className="socials">
                                <img src="/images/socials/instagram.svg" alt="instagram"/>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={newUserData.instagram}
                                    onChange={handleInputChange}
                                    placeholder="enter the link"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="socials">
                                <img src="/images/socials/tiktok.svg" alt="tiktok"/>
                                <input
                                    type="text"
                                    name="tiktok"
                                    value={newUserData.tiktok}
                                    onChange={handleInputChange}
                                    placeholder="enter the link"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="socials">
                                <img src="/images/socials/twitter.svg" alt="twitter"/>
                                <input
                                    type="text"
                                    name="twitter"
                                    value={newUserData.twitter}
                                    onChange={handleInputChange}
                                    placeholder="enter the link"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="socials">
                                <img src="/images/socials/linkedin.svg" alt="linkedin"/>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={newUserData.linkedin}
                                    onChange={handleInputChange}
                                    placeholder="enter the link"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="base-container description-container">
                <textarea
                    name="description"
                    value={newUserData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself, your dreams and hobbies..."
                    autoComplete="off"       
                />
            </div>

            <button onClick={handleSave} className="saveButton">
                SAVE
            </button>
        </div>
    );
};

export default UpdateProfile;
