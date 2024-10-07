import React, {useEffect, useState} from 'react';
import './UpdateProfile.css';
import { useLocation } from "react-router";



const UpdateProfile = () => {
    const location = useLocation();
    const [userData, setUserData] = useState(location.state?.userData || {});

    const [newUserData, setNewUserData] = useState({
        instagram: userData?.instagram || "",
        tiktok: userData?.tiktok || "",
        twitter: userData?.twitter || "",
        linkedin: userData?.linkedin || "",
        description: userData?.description || ""
    });

    const handleSave = () => {
        // Save the updated profile data (API call or local storage logic here)
        console.log({
            name,
            surname,
            instagram,
            tiktok,
            twitter,
            linkedin,
            bio
        });
        alert('Profile updated!');
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
        });
        console.log(newUserData)
    }, [userData]);

    // Handler to update state when input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name)
        console.log(value)
        setNewUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="add-info-container">
            <div className="user-info-container">
                <div className="user-image">
                    <img src="/images/placeholder-person.svg"></img>
                </div>


                <div className="user-info">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={newUserData.name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="surname"
                                value={newUserData.surname}
                                onChange={handleInputChange}
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
                            />
                        </div>

                        <div className="socials">
                            <img src="/images/socials/tiktok.svg" alt="tiktok"/>
                            <input
                                type="text"
                                name="tiktok"
                                value={newUserData.tiktok}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="socials">
                            <img src="/images/socials/twitter.svg" alt="twitter"/>
                            <input
                                type="text"
                                name="twitter"
                                value={newUserData.twitter}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="socials">
                            <img src="/images/socials/linkedin.svg" alt="linkedin"/>
                            <input
                                type="text"
                                name="linkedin"
                                value={newUserData.linkedin}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-description">
                <input
                    type="text"
                    name="description"
                    value={newUserData.description}
                    onChange={handleInputChange}

                />

            </div>
            <button onClick={handleSave} className="saveButton">
                SAVE
            </button>
        </div>
    );
};

export default UpdateProfile;
