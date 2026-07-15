import { useAuth } from "../hooks/useAuth.js";
import React from "react";
import { Navigate } from "react-router";


const Protected = ({children}) => {
    const { user, loading } = useAuth();
    

    if (loading) {
        return (<main><h1>Loading...</h1></main>)
    }
    if(!user) {
       return <Navigate to={"/login"}  />
    }
    console.log(children);

    return (
        children

    )
}

export default Protected;