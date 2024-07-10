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
            second_name: '',
            kindergarten: '',
            phone_number: '',
        },
        resetDataUser: {
            emailForReset: '',
            newPass: ''
        },
        accessToken: ''
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
            localStorage.setItem('first_name', action.payload.first_name);
            localStorage.setItem('last_name', action.payload.last_name);
            localStorage.setItem('second_name', action.payload.second_name);
            localStorage.setItem('email', action.payload.email);
            localStorage.setItem('phone', action.payload.phone_number);

            action.payload.kindergarten.forEach(elem => {
                localStorage.setItem('kindergarten', elem.name);
                localStorage.setItem('country', elem.region.country)
                localStorage.setItem('regionName', elem.region.name)
            })
        },
        setResetData(state, action) {
            state.resetDataUser.emailForReset = action.payload.emailForReset;
            state.resetDataUser.newPass = action.payload.newPass;
        }
    }
})

export const { setUser, removeUser, addBlur, setEmail, setCode, setAccessToken, addPhotos, addUserData, setResetData } = authSlice.actions;

export default authSlice.reducer;