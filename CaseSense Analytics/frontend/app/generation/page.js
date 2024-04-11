"use client"

import styles from './generation.module.css'

import { useState } from "react";

import FormPages from './components/FormPages';
import OpeningModal from './components/OpeningModal';


export default function Generation() {
  const [showModal, setShowModal] = useState(true)

  const [formData, setFormData] = useState(null)

  return (
    <main className={styles["flex-container"]}>
      {showModal &&
        (
          <OpeningModal setShowModal={setShowModal} setFormData={setFormData} heading={'Add the contract template that you want to fill'}/>
        )
      }
      
      {formData &&
        (<FormPages formData={formData}/>)
      }


    </main>
  )
}
