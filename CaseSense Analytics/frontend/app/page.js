"use client"
import Link from 'next/link'
import styles from './home.module.css'
import Image from "next/image"

export default function Home() {

    return (
        <main className={styles['landing-container']}>
            <section className={styles.section1}>
                <div className={styles['section-text']}>
                    <h1>Tired of visiting your lawyer to create contracts?</h1>
                    <div>Make use of AI to build your own contracts at home</div>
                    <button><Link href='/generation' className="nav-comps">Try Now!</Link></button>
                    <h1 className={styles['section1-h2']}>Want to understand what a clause means in easily understandable language</h1>
                    <div style={{textDecoration: 'underline'}}><Link href='/chat' className="nav-comps">Click here to learn more!</Link></div>
                </div>
                <div className={styles['landing-image']}>
                    <Image src='/landing-image.jpeg' alt='People shaking hands to solidify a contract' fill/>    
                </div>  
            </section>    
        </main>
    )
}