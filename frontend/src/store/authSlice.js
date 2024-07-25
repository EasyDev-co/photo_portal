import { createSlice } from "@reduxjs/toolkit";
import { setCookie } from "../utils/setCookie";

const authSlice = createSlice({
    name: 'user',
    initialState: {
        email: null,
        access: true,//localStorage.getItem('access'),
        refresh: null,
        blur: false,
        code: null,
        photos: [
            {
                "id": "ce0e18b1-b49c-48da-b4d6-b7e4aa036514",
                "number": 1,
                "photo": "http://127.0.0.1/media/photo/5eXXf4mf6iE.jpg",
                "photoLineId": "1ffae2c9-2a93-48af-9daa-319ffc4f54e2"
            },
            {
                "id": "d51f4b57-1259-462e-8a91-288358f12fef",
                "number": 2,
                "photo": "http://127.0.0.1/media/photo/bazBNUFcdcA.jpg",
                "photoLineId": "1ffae2c9-2a93-48af-9daa-319ffc4f54e2"
            },
            {
                "id": "7bbf9da9-7f72-4965-89d0-f3cdf6ef609e",
                "number": 3,
                "photo": "http://127.0.0.1/media/photo/dC_z3tfsKjM.jpg",
                "photoLineId": "1ffae2c9-2a93-48af-9daa-319ffc4f54e2"
            },
            {
                "id": "0139616b-756a-4455-944b-2a1c8c0313e8",
                "number": 4,
                "photo": "http://127.0.0.1/media/photo/DU1r0HB2i-E.jpg",
                "photoLineId": "1ffae2c9-2a93-48af-9daa-319ffc4f54e2"
            },
            {
                "id": "8531ddf5-3743-4917-b4cf-ade3df4bc950",
                "number": 5,
                "photo": "http://127.0.0.1/media/photo/mDdYZD0X1jM.jpg",
                "photoLineId": "1ffae2c9-2a93-48af-9daa-319ffc4f54e2"
            },
            {
                "id": "625d8eff-fd2f-4a73-b3b2-43521dea105c",
                "number": 6,
                "photo": "http://127.0.0.1/media/photo/p9lczYjUaR8.jpg",
                "photoLineId": "1ffae2c9-2a93-48af-9daa-319ffc4f54e2"
            },
            {
                "id": "d94f2459-8795-4a94-8286-ced01edd0786",
                "number": 13,
                "photo": "http://127.0.0.1/media/photo/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2023-07-24_153559.png",
                "photoLineId": "4838520d-df82-477f-acc3-2a68764bb49c"
            },
            {
                "id": "0fbff3a3-a096-48b5-a960-ef1101d05201",
                "number": 14,
                "photo": "http://127.0.0.1/media/photo/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2023-08-02_124002.png",
                "photoLineId": "4838520d-df82-477f-acc3-2a68764bb49c"
            },
            {
                "id": "05f7cff7-bf06-436b-8e66-a31a6191ee33",
                "number": 15,
                "photo": "http://127.0.0.1/media/photo/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2023-08-23_160346.png",
                "photoLineId": "4838520d-df82-477f-acc3-2a68764bb49c"
            },
            {
                "id": "c1f02760-1ebf-4459-b680-35e5422a7687",
                "number": 16,
                "photo": "http://127.0.0.1/media/photo/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2023-08-23_160425.png",
                "photoLineId": "4838520d-df82-477f-acc3-2a68764bb49c"
            },
            {
                "id": "67b3a62b-673a-492f-9ab6-d8498ae03f74",
                "number": 17,
                "photo": "http://127.0.0.1/media/photo/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2023-08-23_161940.png",
                "photoLineId": "4838520d-df82-477f-acc3-2a68764bb49c"
            },
            {
                "id": "b25cc3af-4e60-49b6-b19f-9485cda4712f",
                "number": 18,
                "photo": "http://127.0.0.1/media/photo/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2023-08-23_175429.png",
                "photoLineId": "4838520d-df82-477f-acc3-2a68764bb49c"
            },
            {
                "id": "635f3696-4ab8-451c-919b-b60a32b96db9",
                "number": 7,
                "photo": "/media/photo/R68dnExfmHA.jpg",
                "photoLineId": "515a89ef-b0cd-46c5-8a57-d7476815b75b"
            },
            {
                "id": "82aa97df-e6f2-41b8-ac15-d4dbd74e115e",
                "number": 8,
                "photo": "/media/photo/t5Yl1EfyFTM.jpg",
                "photoLineId": "515a89ef-b0cd-46c5-8a57-d7476815b75b"
            },
            {
                "id": "a03e72e2-36e6-45e4-8351-4c81dcd21fa1",
                "number": 9,
                "photo": "/media/photo/thtWvQLxung.jpg",
                "photoLineId": "515a89ef-b0cd-46c5-8a57-d7476815b75b"
            },
            {
                "id": "5522ab04-8107-4e67-be3a-47633f29818a",
                "number": 10,
                "photo": "/media/photo/tYVJtdYkW2o.jpg",
                "photoLineId": "515a89ef-b0cd-46c5-8a57-d7476815b75b"
            },
            {
                "id": "3bc2d350-a1a2-4371-8810-99ed4d1ba00e",
                "number": 11,
                "photo": "/media/photo/Y-84TrWfvzs.jpg",
                "photoLineId": "515a89ef-b0cd-46c5-8a57-d7476815b75b"
            },
            {
                "id": "e15a842a-75ab-4ce0-afbf-b98644754e3f",
                "number": 12,
                "photo": "/media/photo/YA2CS8sWZHI.jpg",
                "photoLineId": "515a89ef-b0cd-46c5-8a57-d7476815b75b"
            }
        ],
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
    setCart
} = authSlice.actions;


export default authSlice.reducer;