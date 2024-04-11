"use client"
import Navbar from './components/Navbar'
import './globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { AuthContextProvider } from './store/AuthContext';
import Auth from './auth/page';
import {useState} from 'react';

// export const metadata = {
//   title: 'Legal Ease',
//   description: 'Form',
// }

export default function RootLayout({ children }) {

  const [token, setToken] = useState({
    token : ""
  });
  
  const tokenObj = {
    token : token,
    setToken : setToken
  }
  
  return (
    <html lang="en">
      <AuthContextProvider tokenObj={tokenObj}>
      <body>
          <Navbar />
          {children}
      </body>
      </AuthContextProvider>
    </html>
  )
}
