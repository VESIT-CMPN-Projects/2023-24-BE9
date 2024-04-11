"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../generation.module.css'

import { useRef, useState } from "react";
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function OpeningModal({setShowModal, setFormData, heading}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const [error, setError] = useState(false);

  function handleChange(e) {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {

      for (let i = 0; i < e.target.files["length"]; i++) {
        setFiles((prevState) => [...prevState, e.target.files[i]]);
      }
    }
  }

  async function handleSubmitFile(e) {
    if (files.length === 0) {
      // no file has been submitted
      setError(true)
    } else {
      // write submit logic here
      
      const formData = new FormData()
      formData.append('file', files[0])

      setFormData(formData)

      setShowModal(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        setFiles((prevState) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName, idx) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <div>
        <div className={styles['modal']}>
            <h1>{heading}</h1>
            <form
                className={`${styles['form-area']}`}
                style={{
                    backgroundColor: dragActive ? "#4299e1" : "#ebf8ff", 
                  }}
                onDragEnter={handleDragEnter}
                onSubmit={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
            >
            {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
            <input
            placeholder="fileInput"
            style={{display: 'none'}}
            ref={inputRef}
            type="file"
            onChange={handleChange}
            accept=".docx,.txt,.png,.jpg"
            />

            <span
                onClick={openFileExplorer}
                style={{fontWeight: 'bold', cursor: 'pointer'}}
            >
                Drag & Drop files or{" "}
                <u>Select files</u>
                {" "}to upload
            </span>
    

            <div className={styles['file-group']}>
            {files.map((file, idx) => (
                <div key={idx} className={styles['file-display']}>
                <span>{file.name}</span>
                <span
                    style={{
                        color: '#e53e3e',
                        cursor: 'pointer'
                      }}
                    onClick={() => removeFile(file.name, idx)}
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </span>
                </div>
            ))}
            </div>

            <div
            className={styles['modal-btn']}
            onClick={handleSubmitFile}
            >
            Proceed
            </div>

            {error && 
              <div
                style={{
                  color: '#e53e3e'
                }}
              > Please add a file</div>
            }
        </form>
        </div>
        {/* <div className={styles["modal-overlay"]}/> */}
    </div>

  );
}