"use client"

import styles from '../generation.module.css'

import { useEffect, useState } from "react";
import FormGroup from "./FormGroup";
import ProgressBar from '@ramonak/react-progress-bar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faArrowCircleLeft, faHeadset} from "@fortawesome/free-solid-svg-icons";
import Loading from '../loading';
import Contract from './Contract';

let didInit = false;

export default function FormPages({formData}) {
    const [formPageNumber, setFormPageNumber] = useState(0)
    const [formPages, setFormPages] = useState([])
    const [formPageValues, setFormPageValues] = useState([])

    const [blob, setBlob] = useState(null);

    useEffect(() => {
      if (didInit) return

      didInit = true;
      async function uploadFileAndStartStream() {
        try {
            // Initiate file upload and streaming
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:8001/question-gen`, {
                method: 'POST',
                body: formData,
            });
  
            if (!response.ok) {
                console.error('File upload error:', response.status);
                return;
            }
  
            // Initiate streaming
            startFileStreaming(response);
        } catch (error) {
            console.error('Fetch error:', error);
        }
      }
  
      async function startFileStreaming(response) {
          try {
              const decoder = new TextDecoder('utf-8');
              const reader = response.body.getReader();
  
              while (true) {
                  const { done, value } = await reader.read();
  
                  if (done) {
                      console.log('File streaming completed.');
                      break;
                  }
  
                  // Convert binary data to text (assuming utf-8 encoding)
                  const textData = decoder.decode(value, {stream: true});
                  console.log('Received file chunk:', textData, value);
  
                  const json = JSON.parse(textData)
                  
                  setFormPages((oldPages) => [...oldPages, json])
  
                  // console.log(textData)
              }
          } catch (error) {
              console.error('Fetch error during streaming:', error);
          }
      }
  
  
      uploadFileAndStartStream()
    }, [])


    async function handleDownload() {
      let formDataValues = [...formData]
  
      const formDataUpdated = new FormData()
      formDataUpdated.append(formDataValues[0][0], formDataValues[0][1])

      const substitution_strings = [].concat(...formPageValues);

      // console.log(substitution_strings);

      formDataUpdated.append('substitution_strings', JSON.stringify(substitution_strings))

      try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:8001/download-docx`, {
          method: 'POST',
          body: formDataUpdated,
        });
  
        if (response.ok) {
          const blob = await response.blob();
          setBlob(blob);
        } else {
          console.error('Error processing docx:', response.statusText);
        }
      } catch (error) {
        console.error('Error processing docx:', error.message);
      }
    };

    if (blob) {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'final_document.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setBlob(null)
    }

    if (formPages.length == 0) return <Loading />

    if (formPageNumber >= formPages.length) return <Loading />

    const questions = Object.values(formPages[formPageNumber].questions)

    const content = formPages[formPageNumber].document

    const totalDocs = formPages[formPageNumber].totalDocs

    if (formPageNumber >= formPageValues.length) {
      let newArr = []

      for (let i = 0; i < questions.length; ++i) {
        newArr.push('')
      }

      setFormPageValues((oldValues) => {
        return [...oldValues, newArr]
      })
    }

    // console.log(formPageValues)

    return (
      <>
      <div className={styles["form-container"]}>
        
        <header>Fill the form to prepare lease document</header>
        <div>Progress:
          <ProgressBar 
            completed={formPageNumber+1} 
            maxCompleted={totalDocs}
            customLabel={`${formPageNumber+1} of ${totalDocs}`} 
            bgColor='#3e5c76'
          />
        </div>

        <FormGroup questions={questions} formPageValues={formPageValues} formPageNumber={formPageNumber} setFormPageValues={setFormPageValues}/>
        
        <div className={styles["btn-grp"]}>
          {formPageNumber != 0 && <FontAwesomeIcon icon={faArrowCircleLeft} onClick={() => setFormPageNumber(formPageNumber-1)} size='2x'/>}
          {formPageNumber != totalDocs-1 && <FontAwesomeIcon icon={faArrowCircleRight} onClick={() => setFormPageNumber(formPageNumber+1)} size='2x'/>}
        </div>
        
        {formPageNumber == totalDocs-1 &&
          <>
            <div onClick={handleDownload} className={styles["chatbot-btn"]}>
                  Download PDF
            </div>
          </>
        }

      </div>
      <div className={styles['contract-container']}>
        <Contract content={content} formPageValues={formPageValues} formPageNumber={formPageNumber}/>
      </div>

      </>
    )
}