"use client"

import { createContext } from "react";

export const AuthContext = createContext({
    token : "",
    setToken : ()=>{}
})

export const AuthContextProvider = ({children, tokenObj}) =>{

    return (
        <AuthContext.Provider value={{tokenObj}}>{children}</AuthContext.Provider>
    )
}