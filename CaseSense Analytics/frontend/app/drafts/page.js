import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './drafts.module.css'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Drafts() {
    const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
    return (
        <main className={styles['drafts-container']}>
            <div className={styles['search-bar-container']}>
                <header>Access all your legal document drafts from here</header>
                <div className={styles['search-bar']}>
                    <input placeholder='Search for your documents'/>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </div>
            <div className={styles['drafts-rep']}>
                {
                    arr.map((draft) => (<div className={styles['draft']} key={draft}></div>))
                }
            </div>
        </main>
    )
} 