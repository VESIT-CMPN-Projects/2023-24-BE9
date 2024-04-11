"use client"

import { faFileContract, faBars, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Navbar() {
    const [flip, setFlip] = useState(false)
    const [openNav, setOpenNav] = useState(false)

    const router = useRouter();

    const handleSignUpClick = (e) => {
        e.preventDefault();
        router.push('/auth?isSignUp=true');
      };

    const handleSignInClick = (e) => {
        e.preventDefault();
        router.push('/auth?isSignUp=false');
      };


    return (
        <nav>
            <Link href='/'>
                <header>
                    <FontAwesomeIcon
                        icon={faFileContract}
                        flip={flip}
                        size='1x'
                        onMouseEnter={() => setFlip(true)}
                        onMouseLeave={() => setFlip(false)}
                    />
                    Legal-Ease
                </header>
            </Link>

            <Link href='/generation' className="nav-comps" style={{marginLeft: 'auto'}}>
                <div>Document Generation</div>
            </Link>
            <Link href='/chat' className="nav-comps">
                <div>Document Chat</div>
            </Link>
            {/* <Link href='/drafts' className="nav-comps">
                <div>Drafts</div>
            </Link> */}
            <Link href='/helpdesk' className="nav-comps">
                <div>Help desk</div>
            </Link>
            <Link href='/aboutus' className="nav-comps">
                <div>About us</div>
            </Link>

            {/* <div className='btn-grp nav-comps'>
                <Link href='/auth' className='btn-grp' onClick={handleSignUpClick}>
                    <button>Sign Up</button>
                </Link>
                <Link href='/auth' className='btn-grp' onClick={handleSignInClick}>
                    <button>Log In</button>
                </Link>
            </div> */}

            <div
                className="hamburger-icon"
                onClick={() => { setOpenNav(!openNav) }}
            >
                <FontAwesomeIcon icon={faBars} />
            </div>
            {
                openNav &&
                (
                    <div className='hamburger-menu'>
                        <Link href='/' onClick={() => { setOpenNav(!openNav) }}>
                            <div>Home</div>
                        </Link>
                        <Link href='/generation' onClick={() => { setOpenNav(!openNav) }}>
                            <div>Document Generation</div>
                        </Link>
                        <Link href='/chat' onClick={() => { setOpenNav(!openNav) }}>
                            <div>Document Chat</div>
                        </Link>
                        {/* <Link href='/drafts' onClick={() => { setOpenNav(!openNav) }}>
                            <div>Drafts</div>
                        </Link> */}
                        <Link href='/helpdesk' onClick={() => { setOpenNav(!openNav) }}>
                            <div>Help desk</div>
                        </Link>
                        <Link href='/aboutus' onClick={() => { setOpenNav(!openNav) }}>
                            <div>About us</div>
                        </Link>

                        {/* <div className='btn-grp'>
                            <Link href='/aboutus' className='btn-grp nav-comps' onClick={handleSignUpClick}>
                                <button>Sign Up</button>
                            </Link>
                            <Link href='/aboutus' className='btn-grp nav-comps' onClick={handleSignInClick}>
                                <button>Log In</button>
                            </Link>
                        </div> */}

                        <FontAwesomeIcon icon={faCircleXmark} onClick={() => { setOpenNav(!openNav) }} size='2x' />
                    </div>

                )
            }
        </nav>
    )
}