import { createRoot } from 'react-dom/client'
import './index.css'
import WalletConnect from "./WalletConnect.tsx";

createRoot(document.getElementById('root')!).render(
  <WalletConnect/>
)
