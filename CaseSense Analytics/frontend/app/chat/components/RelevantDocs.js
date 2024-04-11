'use client'

import styles from '../chat.module.css'

import { useEffect, useState } from "react"
import Loading from '../loading'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function RelevantDocs({relevantDocs, setShowRelevantDocs}) {
    console.log(relevantDocs)
    const [relDocsContent, setRelDocsContent] = useState(null)

    useEffect(() => {
        async function loadContent() {
            const formData = new FormData()
            formData.append('relevant_documents', JSON.stringify(relevantDocs))
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:8001/relevant-documents`, {
                method: 'POST',
                body: formData
            })
        
            const relDocsContent = await res.json()

            setRelDocsContent(relDocsContent.relevant_documents_content)
        }

        loadContent()
    }, [])

    if (relevantDocs.length == 0) return <div>No documents found</div>

    if (!relDocsContent) return <Loading />

    return (
        <>
            <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
                <div style={{padding: '10px'}} onClick={() => {setShowRelevantDocs(null)}}><FontAwesomeIcon icon={faArrowAltCircleLeft} size='3x'/></div>
                <h1>Documents from which the response was derived</h1>
            </div>
            
            <div className={styles['document-container']}>
                {
                    relDocsContent.map((content, index) => {
                        return (<div className={styles['document-content']}><h2>Document {index+1}</h2>{content}</div>)
                    })
                }
            </div>
        </>
    )

}