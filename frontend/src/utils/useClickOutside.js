import { useEffect } from "react";

export const useClickOutside = (ref, callback) =>{
    const handelClick = (e)=>{
        if(ref.current && !ref.current.contains(e.target)){
            callback();
        }
    };
    useEffect(()=>{
        document.addEventListener('mousedown',handelClick);
        return ()=>{
            document.removeEventListener('mousedown',handelClick)
        }
    })
}