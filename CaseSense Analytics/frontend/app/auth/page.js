"use client"

import { useContext, useState, useEffect } from 'react';
import styles from './auth.module.css'
import { useSearchParams } from 'next/navigation'

import { AuthContext } from '../store/AuthContext';
import io from 'socket.io-client';

export default function Auth() {

    const searchParams = useSearchParams()

    const isSignUp = searchParams.get('isSignUp') === 'true' ? true : false;

    const [authSelector, setAuthSelector] = useState(isSignUp);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { tokenObj } = useContext(AuthContext);

    console.log(tokenObj)

    const authClickHandler = (e) => {
        if (e.target.innerText === 'Sign Up' && authSelector !== 'true') {
            setAuthSelector(true);
        }

        if (e.target.innerText === 'Sign In' && authSelector !== 'false') {
            setAuthSelector(false);
        }
    }

    const performAuth = async (e) => {
        e.preventDefault();

        console.log(email, password);

        if (authSelector) {
            const res = await fetch('http://localhost:5000/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const data = await res.json();

            console.log(data)

        } else {

            const res = await fetch('http://localhost:5000/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const data = await res.json();

            tokenObj.setToken({ token: data });

            console.log(tokenObj.token)
        }

    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    useEffect(() => {
        const socket = io('http://localhost:5000/');

        // Additional socket.io event listeners and actions can be added here

        return () => {
            // Cleanup on component unmount
            socket.disconnect();
        };
    }, [tokenObj.token]);

    return (
        <div className={styles['container']}>
            <div className={styles['inner-container']}>

                <div className={styles['selector']}>
                    <div className={authSelector ? styles.authSelected : styles.signupInactive} onClick={authClickHandler}>Sign Up</div>
                    <div className={!authSelector ? styles.authSelected : styles.signupInactive} onClick={authClickHandler}>Sign In</div>
                </div>

                <input placeholder='Email' onChange={handleEmailChange} />
                <input placeholder='Password' onChange={handlePasswordChange} />

                <button className={styles['button']} type='submit' onClick={performAuth}>
                    Submit
                </button>

            </div>
        </div>
    )
} 