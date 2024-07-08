import { createSlice } from "@reduxjs/toolkit";
import { setCookie } from "../utils/setCookie";
const authSlice = createSlice({
    name: 'user',
    initialState: {
        email: null,
        access: true,
        refresh: null,
        blur: false,
        code: null,
        photos: [],
        userData: {
            email: '',
            first_name: '',
            is_veried: '',
            last_name: '',
            promocode: '',
            second_name: ''
        }
    },
    reducers: {
        setUser: (state, action) => {
            setCookie('refresh', action.payload.refresh);
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
        },
        removeUser: (state) => {
            state.email = null;
            state.access = null;
        },
        addBlur: (state, action) => {
            state.blur = action.payload;
        },
        setEmail(state, action) {
            state.email = action.payload;
            console.log(action.payload);
        },
        setCode(state, action) {
            state.code = action.payload.code;
        },
        setAccessToken(state, action) {
            state.access = action.payload;
        },
        addPhotos(state, action) {
            state.photos.push(action.payload);
        },
        addUserData(state, action) {
            state.userData = action.payload;
            localStorage.setItem('first_name',action.payload.first_name);
            localStorage.setItem('last_name', action.payload.last_name);
            localStorage.setItem('second_name', action.payload.second_name);
            localStorage.setItem('email', action.payload.email);
        }
    }
})

export const { setUser, removeUser, addBlur, setEmail, setCode, setAccessToken, addPhotos, addUserData } = authSlice.actions;

export default authSlice.reducer;