"use client"

import styles from '../chat.module.css'

import { faArrowCircleRight, faUser, faRobot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useAutosizeTextArea from "../../../hooks/useAutoResizeTextArea";
import { ReactTyped } from 'react-typed';
import { useEffect, useRef, useState } from "react";
import Loading from '../loading';
import ChatLoading from './ChatLoading';
import RelevantDocs from './RelevantDocs';

export default function Chat({docLoad}) {
    // true - for type 1 of chatbot & false - for type 2 of chatbot

    const [chatbotType, setChatbotType] = useState(true)

    const textAreaRef = useRef(null);
    const scrollRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false)
    const [isGenerated, setIsGenerated] = useState(false)
    const [showRelevantDocs, setShowRelevantDocs] = useState(null)

    const [dataTalk, setDataTalk] = useState({messages: [["Hello, How may I help you today?"]], summary: ' ', curMessage: ''})

    const [dataDiscover, setDataDiscover] = useState({messages: [["Hello, How may I help you today?\nThe following legal clauses can be added to the provided contract."]], summary: ' ', curMessage: ''})
    
    const handleChange = (evt) => {
      const val = evt.target.value;
  
      setData((oldData) => { return {...oldData, curMessage: val} });
    };
  
    const messages = chatbotType ? dataTalk.messages : dataDiscover.messages
    
    const summary = chatbotType ? dataTalk.summary : dataDiscover.summary

    const curMessage = chatbotType ? dataTalk.curMessage : dataDiscover.curMessage

    const setData = chatbotType ? setDataTalk : setDataDiscover

    useAutosizeTextArea(textAreaRef.current, curMessage);

    useEffect(() => {
        if (docLoad && Object.hasOwn(docLoad, 'newLegalClauses')) {
            const newMessages = [...dataDiscover.messages]
            newMessages[0][0] += docLoad['newLegalClauses'][0]
            newMessages[0].push(docLoad['newLegalClauses'][1])
            setDataDiscover(data => { return {...data, messages: newMessages} })
        }
    }, [docLoad])

    async function handleSubmit() {
        if (curMessage.trim() == '') return

        setIsLoading(true)

        setData(data => { return {...data, messages: [...data.messages, [curMessage]]} })

        if (chatbotType) {

            const newFormData = new FormData()

            newFormData.append('summary', summary)
            newFormData.append('query', curMessage)

            const res = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:8001/doc-chat`, {
                method: 'POST',
                body: newFormData
            })

            const json = await res.json()
            if (parseFloat(json.similarity).toFixed(2) < 0.2) {
                json.answer = 'The following content is AI generated. Please make sure to verify the generated content with your lawyer before any further proceedings based on the content.\n\n' + json.answer
            }
            setData(data => { return {...data, messages: [...data.messages, [json.answer.trimStart(), json.relevant_documents, parseFloat(json.similarity).toFixed(2)]], summary: json.summary} })
        } else {
            const newFormData = new FormData()

            newFormData.append('summary', summary)
            newFormData.append('query', curMessage)
            newFormData.append('legal_clauses', docLoad.newLegalClauses[0])

            const res = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:8001/legal-clause-chat`, {
                method: 'POST',
                body: newFormData
            })

            const json = await res.json()

            if (parseFloat(json.similarity).toFixed(2) < 0.2) {
             json.answer = 'The following content is AI generated. Please make sure to verify the generated content with your lawyer before any further proceedings based on the content.\n\n' + json.answer
            }
            setData(data => { return {...data, messages: [...data.messages, [json.answer.trimStart(), json.relevant_documents, parseFloat(json.similarity).toFixed(2)]], summary: json.summary} })
        }

        setData((oldData) => { return {...oldData, curMessage: ''} });
        setIsGenerated(true)
        setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading) return

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

    // console.log(messages, chatbotType)

    if (!docLoad) return <Loading/>

    if (showRelevantDocs) return <RelevantDocs relevantDocs={showRelevantDocs} setShowRelevantDocs={setShowRelevantDocs}/>

    return (
        <>
            <div className={styles["chatbot-container"]}>
                <div>
                    <div className={styles["chatbot-type-selector"]}>
                        <div className={`${styles["chatbot-btn"]} ${(chatbotType && styles["chatbot-type-active"])}`} onClick={() => setChatbotType(true)}>Talk with your document</div>
                        <div className={`${styles["chatbot-btn"]} ${(!chatbotType && styles["chatbot-type-active"])}`} onClick={() => setChatbotType(false)}>Discover more clauses</div>
                    </div>
                    <div className={styles["chatbot-window"]}>
                        <div className={styles["message-window"]}>
                            {
                                messages.map(
                                    (message, index) => {
                                        const generated = isGenerated;
                                        if (generated) setIsGenerated(false)
                                        if (index % 2 == 1) {
                                            return (<div className={`${styles['msg-container']}`} key={index}>
                                                <span className={`${styles['msg-logo']}`}><FontAwesomeIcon icon={faUser} size='1x' style={{width: '20px'}}/></span>
                                                <span className={`${styles['msg']}`}>{message[0]}</span></div>)
                                        } else {
                                            return (
                                                <div className={`${styles['msg-container']}`} key={index} onClick={() => {if (chatbotType) setShowRelevantDocs(message[1])}}>
                                                    <span className={`${styles['msg-logo']}`}><FontAwesomeIcon icon={faRobot} size='1x' style={{width: '20px'}} /></span>
                                                    {generated ?
                                                        (<ReactTyped className={`${styles['msg']}`} strings={[message[0]]} typeSpeed={10} showCursor={false} />)
                                                        :
                                                        (<span className={`${styles['msg']}`}>{message[0]}</span>)
                                                    }
                                                    {typeof message[2] !== 'undefined' && <span className={`${styles['similarity']} ${message[2] >= 0.2 ? styles['similarity-green'] : styles['similarity-yellow']}`} title='Similarity with legal document'>{message[2]}</span>}
                                                </div>
                                            )
                                        }
                                    }
                                ) 
                            }
                            {isLoading && (                                                
                            <div className={`${styles['msg-container']}`}>
                                <span className={`${styles['msg-logo']}`}><FontAwesomeIcon icon={faRobot} size='1x'/></span>
                                <span className={`${styles['msg']}`}><ChatLoading /></span>
                            </div>
                            )}
                            {(messages.length == 1 && chatbotType) &&
                            (<div style={{margin: '15px', paddingTop: '10px'}}>
                                Query Suggestions: {'   '}
                                <span className={`${styles['msg']}`} onClick={() => {
                                    setData((oldData) => { return {...oldData, curMessage: 'Summarize the given document'} });
                                }}>Summarize the given document</span>
                                {'   '}
                                <span className={`${styles['msg']}`} onClick={() => {
                                    setData((oldData) => { return {...oldData, curMessage: 'What are the legal clauses in the document'} });
                                }}>What are the legal clauses in the document</span>
                            </div>)
                            }
                            {(messages.length == 1 && !chatbotType) &&
                            (<div style={{margin: '15px', paddingTop: '10px'}}>
                                Query Suggestions: {'   '}
                                <span className={`${styles['msg']}`} onClick={() => {
                                    setData((oldData) => { return {...oldData, curMessage: 'Explain the XYZ clause in detail'} });
                                }}>Explain the XYZ clause in detail</span>
                                {'   '}
                                <span className={`${styles['msg']}`} onClick={() => {
                                    setData((oldData) => { return {...oldData, curMessage: 'Find loopholes in the XYZ clause'} });
                                }}>Find loopholes in the XYZ clause</span>
                            </div>)
                            }
                            <div style={{height: '30px'}} ref={scrollRef}/>
                        </div>
                        <div className={styles["input-window"]}>
                            <textarea
                                onChange={handleChange}
                                placeholder="Message LegalEaseAI..."
                                ref={textAreaRef}
                                rows={1}
                                value={curMessage}
                                disabled={isLoading}
                            />
                            <FontAwesomeIcon icon={faArrowCircleRight} onClick={handleSubmit} style={{color: "#ffffff",}} size='2x' disabled={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}