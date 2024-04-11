import styles from '../generation.module.css'
import { renderToString } from 'react-dom/server';

export default function Contract({content, formPageValues, formPageNumber}) {

    const regexPattern = /\[(MASK\d+)\]/g;

    let parts = content.split(regexPattern);

    for (let i = 1, j = 0; i < parts.length; i += 2, ++j) {
        parts[i] =  formPageValues[formPageNumber][j] !== '' ? <span className={styles["filled"]}>{formPageValues[formPageNumber][j]}</span> : <span className={styles["blank"]}>_____</span>;
    }

    return (
        <>
            <header>After filling the blanks you will be allowed to download the document</header>
            {parts}
        </>
    )
}