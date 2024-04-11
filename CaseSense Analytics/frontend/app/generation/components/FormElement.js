import styles from '../generation.module.css'

export default function FormElement({question, index, formPageNumber, formPageValues, setFormPageValues}) {
    function handleChange(e) {
        const newFormPageValues = [...formPageValues]

        newFormPageValues[formPageNumber][index] = e.target.value

        setFormPageValues(newFormPageValues)
    }

    return (
        <div className={styles["form-element"]}>
            <label>{question}</label>
            <input 
                type='text' 
                onChange={handleChange}
                value={formPageValues[formPageNumber][index]}
            />
        </div>
    )
}