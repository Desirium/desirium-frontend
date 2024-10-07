import { createRoot } from 'react-dom/client';
import './index.css';
import WalletConnect from "./WalletConnect.tsx";
import UpdateProfile from './UpdateProfile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
    <Router>
        <Routes>
            {/* Define your routes */}
            <Route path="/" element={<WalletConnect />} />  {/* Home route */}
            <Route path="/update-profile" element={<UpdateProfile />} />  {/* Update page */}
        </Routes>
    </Router>
);
