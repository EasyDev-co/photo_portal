import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'user',
    initialState:{
        email: null,
        access: null,
        refresh: null
    },
    reducers:{
        setUser:(state,action)=>{
            
            state.access = action.payload.access;
            state.refresh= action.payload.refresh;

            localStorage.setItem('accessToken', state.access);
            localStorage.setItem('refreshToken', state.refresh);
        },
        removeUser:(state) =>{
            state.email = null;
            state.access = null;
        }
    }
})

export const { setUser, removeUser} = authSlice.actions;

export default authSlice.reducer;