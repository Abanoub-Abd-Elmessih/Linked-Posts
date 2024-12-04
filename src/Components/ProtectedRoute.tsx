import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({children}:{children:ReactNode}) {
  const {token} = useSelector((state:RootState)=>state.auth)
  const navigate = useNavigate();
    useEffect(()=>{
        if (!token) {
            navigate('/login')
        }
    },[token,navigate, children])
    return <>{children}</>;
}