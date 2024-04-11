"use client"

import styles from './chat.module.css'

import { useEffect, useState } from "react";

import Chat from './components/Chat';
import OpeningModal from '../generation/components/OpeningModal';
import Loading from './loading';


export default function ChatPage() {
  const [showModal, setShowModal] = useState(true) // true

  const [docLoad, setDocLoad] = useState(null)

  const [formData, setFormData] = useState(null) // null

  useEffect(() => {
    if (!formData) return
    async function fetchUploadedFileData() {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:8001/doc-upload`, {
        method: 'POST',
        body: formData
      })

      const body = await res.json()

      setDocLoad(body)

      const newFormData = new FormData()
      newFormData.append('document_type', body.documentType)
      newFormData.append('legal_clauses', body.legalClauses)

      const res2 = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:8001/legal-clause-gen`, {
        method: 'POST',
        body: newFormData
      })

      const body2 = await res2.json()

      setDocLoad((oldDoc) => {return {...oldDoc, newLegalClauses: [body2.answer, body2.relevant_documents]}})
    }

    fetchUploadedFileData()
  } , [formData])


  return (
    <main>
      {showModal &&
        (
          <OpeningModal setShowModal={setShowModal} setFormData={setFormData} heading={'Add the contract that you want to chat with'}/>
        )
      }
      

      {formData &&
        (<Chat docLoad={docLoad}/>)
      }
    </main>
  )
}
