'use client'

import styles from './helpdesk.module.css'
import Image from "next/image"
import { useState, useRef, useEffect } from 'react';
import useAutosizeTextArea from '@/hooks/useAutoResizeTextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faCircleXmark, faRobot } from '@fortawesome/free-solid-svg-icons';
import ParticleAnimation from './components/ParticleAnimation';
import getHelpDeskResponse from '@/lib/getHelpDeskResponse';
import { ReactTyped } from 'react-typed';

export default function HelpDesk() {
    
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const [history, setHistory] = useState([])

    const textAreaRef = useRef(null);
    const scrollRef = useRef(null);

    useAutosizeTextArea(textAreaRef.current, message);
  
    function handleChange(e) {
      const val = e.target.value;
      setMessage(val);
    };

    async function handleSubmit() {
        if (message.trim() == '') return
        setIsLoading(true)

        setMessages(messages => [...messages, message])

        // LLM call
        const {output, updatedHistory} = await getHelpDeskResponse(message, history)

        setHistory(updatedHistory)
        setMessages(messages => [...messages, output])
        setMessage('')

        setIsLoading(false)

    }

    


    useEffect(() => {
        async function keyDownHandler(event) {
          if (event.keyCode == 13 && !event.shiftKey) {
            handleSubmit();
          }
        };
    
        document.addEventListener('keydown', keyDownHandler);
    
        return () => {
          document.removeEventListener('keydown', keyDownHandler);
        };
      }, [handleSubmit]);

    useEffect(() => {
      if (scrollRef.current && messages.length) {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });

      }
    }, [messages]);

    useEffect(() => {

        async function initLLM() {

            setIsLoading(true)

            // LLM initialization
            const { output, updatedHistory } = await getHelpDeskResponse('You are a helpful legal help desk assistant. You only provide answers to direct legal question and when asked other types of questions refuse to answer. Only answer legal questions in this chat. You provide succinct and point by point answers. You can only use HTML lists for displaying points. Your name is LegalEaseAI.', history)

            setHistory(updatedHistory)

            setIsLoading(false)
        }

        initLLM()
    
        return () => setHistory([])

    }, [])
    

    return (
        <div className={styles['helpdesk-container']}>
            <div className={styles['helpdesk-chatbot']}>
                <header>Looking for help? Use our 24x7 helpbot</header>
                <div className={styles["chatbot-window"]}>
                    <div className={styles["message-window"]}>
                            
                        {
                            messages.map(
                                (message1, index) => {
                                    
                                    if (index % 2 == 0) {
                                        return (<div className={`${styles['msg']} ${styles['msg-right']}`} key={index}>{message1}</div>)
                                    } else {
                                        return (
                                            <div className={`${styles['msg']} ${styles['msg-left']}`}  key={index}>
                                                <FontAwesomeIcon icon={faRobot} style={{color: '#ffffff', margin: '5px 0'}} size='1x'/> <br/>
                                                
                                                {/* (<ReactTyped strings={'help'} typeSpeed={10} showCursor={false} />) */}
                                                {message1}
                                            </div>
                                        )
                                    }
                                }
                            )
                        }
                        <div style={{height: '30px'}} ref={scrollRef}/>
                    </div>
                    <div className={styles["input-window"]}>
                        <textarea
                            onChange={handleChange}
                            placeholder="Explain your query"
                            ref={textAreaRef}
                            rows={1}
                            value={message}
                            disabled={isLoading}
                        />
                        <FontAwesomeIcon icon={faArrowCircleRight} onClick={handleSubmit} style={{color: "#ffffff",}} size='2x' disabled={isLoading}/>
                    </div>
                </div>
            </div>
            <div className={styles['helpdesk-img']}>
                <Image src='/helpdesk.jpg' alt='An official solving queries' fill/>
                <ParticleAnimation/>
            </div>
        </div>
    )
}