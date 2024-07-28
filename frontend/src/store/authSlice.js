import { createSlice } from "@reduxjs/toolkit";
import { setCookie } from "../utils/setCookie";

const authSlice = createSlice({
    name: 'user',
    initialState: {
        email: null,
        access: localStorage.getItem('access'),
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
            kindergarten: [{
                name:'',
                country:'',
                region:''
            }],
            phone_number: '',
        },
        resetDataUser: {
            emailForReset: '',
            newPass: ''
        },
        accessToken: '',
        photosLine: [],
        photoLineId: '',
        photoPrice:[],
        cartList:[],
        cart:[]
    },
    reducers: {
        setUser: (state, action) => {
            setCookie('refresh', action.payload.refresh);
            localStorage.setItem('access', action.payload.access);
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
        },
        removeUser: (state) => {
            state.email = null;
            localStorage.setItem('access', '')

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
            // Плоский массив фотографий
            const data = {  
                photos: action.payload.photos.flat()
            };
        
            // Создаем множество для хранения уникальных id
            const existingIds = new Set(state.photos.map(photo => photo.id));
        
            // Фильтруем фотографии по уникальному id
            const updateData = {
                ...data,
                photos: data.photos
                    .filter(photo => !existingIds.has(photo.id)) // Оставляем только уникальные фото
                    .map(photo => ({
                        ...photo,
                        photoLineId: action.payload.id,
                    }))
            };
        
            // Добавляем уникальные фотографии в состояние
            state.photos.push(...updateData.photos);
        },
        removePhotos(state, action){
            state.photos = state.photos.filter(photo => photo.photoLineId !== action.payload);
        },
        addUserData(state, action) {
            state.userData = action.payload;
            localStorage.setItem('idP', action.payload.id);
            localStorage.setItem('first_name', action.payload.first_name);
            localStorage.setItem('last_name', action.payload.last_name);
            localStorage.setItem('second_name', action.payload.second_name);
            localStorage.setItem('email', action.payload.email);
            localStorage.setItem('phone', action.payload.phone_number === null ? '+7' : action.payload.phone_number);

            action.payload.kindergarten.forEach(elem => {
                localStorage.setItem('kindergarten', elem.name);
                state.userData.kindergarten.name = elem.name;
                localStorage.setItem('country', elem.region.country)
                state.userData.kindergarten.country = elem.region.country;
                localStorage.setItem('regionName', elem.region.name)
                state.userData.kindergarten.region = elem.region.name;
            })
        },
        setResetData(state, action) {
            state.resetDataUser.emailForReset = action.payload.emailForReset;
            state.resetDataUser.newPass = action.payload.newPass;
        },
        addPhotoLine(state, action) {
            const data = {  
                photos: action.payload.photos.flat()
            }
            const updateData = {
                ...data,
                photos: data.photos.map(photo=> ({
                    ...photo,
                    photoLineId: action.payload.id,
                }))
            }
            state.photosLine = updateData.photos;
        },
        addQrIdPhoto(state, action) {
            state.photoLineId = action.payload
            sessionStorage.setItem('photoline', action.payload);
        },
        addPhotoPrice(state, action){
            state.photoPrice = action.payload;
        }
        ,
        addCartList(state, action){
            state.cartList.push(action.payload);
        },
        setCart(state, action){
            state.cart = action.payload
        }
    }
});
export const {
    setUser,
    removeUser,
    addBlur,
    setEmail,
    setCode,
    setAccessToken,
    addPhotos,
    addUserData,
    setResetData,
    addPhotoLine,
    addQrIdPhoto,
    addPhotoPrice,
    addCartList,
    setCart,
    removePhotos
} = authSlice.actions;


export default authSlice.reducer;