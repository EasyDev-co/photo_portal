import { createSlice } from "@reduxjs/toolkit";
import { setCookie } from "../utils/setCookie";
const authSlice = createSlice({
    name: 'user',
    initialState:{
        email: null,
        access: true,
        refresh: null,
        blur:false,
        code: null,
        photos:[]
    },
    reducers:{
        setUser:(state,action)=>{
            setCookie('refresh',action.payload.refresh);
            state.access = action.payload.access;
            state.refresh= action.payload.refresh;


            // localStorage.setItem('accessToken', state.access);
            // localStorage.setItem('refreshToken', state.refresh);
        },
        removeUser:(state) =>{
            state.email = null;
            state.access = null;
        },
        addBlur:(state, action)=>{
            state.blur = action.payload
        },
        setEmail(state, action){
            state.email = action.payload
            console.log(action.payload)
        },
        setCode(state,action){
            state.code = action.payload.code
        },
        setAccessToken(state,action){
            state.access = action.payload
        },
        addPhotos(state,action){
            state.photos.push(action.payload)
        }
    }
})

export const { setUser, removeUser,addBlur,setEmail, setCode, setAccessToken,addPhotos} = authSlice.actions;

export default authSlice.reducer;