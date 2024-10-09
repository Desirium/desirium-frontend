import { createRoot } from 'react-dom/client';
import './index.css';
import WalletConnect from "./WalletConnect/WalletConnect.tsx";
import UpdateProfile from './UpdateProfile/UpdateProfile.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WishlistAdd from "./WishlistAdd/WishlistAdd.tsx";

createRoot(document.getElementById('root')!).render(
    <Router>
        <Routes>
            <Route path="/" element={<WalletConnect />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/add-wishlist" element={<WishlistAdd />} />
        </Routes>
    </Router>
);
