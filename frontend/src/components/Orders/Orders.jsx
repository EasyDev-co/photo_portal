import styles from "./Orders.module.css";
import React, { useState, useRef, useEffect } from 'react';
import PhotoCard from "./PhotoCard/PhotoCard";
import PaymentTimer from '../Payment/PaymentTimer/PaymentTimer'
import { useClickOutside } from "../../utils/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import AddKidsForm from "./AddKids/AddKidsForm";
import { fetchWithTokenInterceptor } from '../../http/getPhotoLine'
import Scaner from "../Scaner/Scaner";
import { addCartList, addPhotoLine } from "../../store/authSlice";
import { useAuth } from "../../utils/useAuth";

export const Orders = () => {
  const dispatch = useDispatch();
  const addPhoto = useSelector(state => state.user.photos);
  const [photos, setPhotos] = useState({
    photos:
      []
  });
  const photoLineId = useSelector(state => state.user.photoLineId)
  const [scanActive, setScanActive] = useState(false);
  const [sessionData, setSessionData] = useState(sessionStorage.getItem('photoline'));
  const accessStor = localStorage.getItem('access');
  const { isAuth } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchData = async () => {
      try {
        const response = await fetchWithTokenInterceptor(!photoLineId && sessionData, accessStor, { signal });
        const data = await response.json();
        setPhotos(data);
        dispatch(addPhotoLine(data.photos));
      } catch (error) {
        console.log(error)
        if (error.name === 'AbortError') {
          console.log('Fetch запрос был отменен');
        } else {
          console.error('Произошла ошибка:', error);
        }
      }
    };
    if (isAuth) {
      fetchData();
    }
    return () => {
      abortController.abort();
    };
  }, []);

  const [blocks, setBlocks] = useState([]);

  const addBlock = () => {
    if (blocks.length < 2) {
      setBlocks([...blocks, { id: blocks.length + 1 }]);
    }
  };

  const deleteBlock = (id) => {
    const filteredBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(filteredBlocks);
  };

  const [inputValue, setInputValue] = useState({
    "10x15": 0,
    "15x20": 0,
    "20x30": 0,
    magnet: 0,
    calendar: 0,
    photo_book: 0
  });

  const onChangeHandler = (name, count, number, photoId) => {

    dispatch(addCartList(
      {
        ['quantity']: count,
        ['id']: photoId,
        ['photo_type']: Number(name)
      }
    ))
    const newInput = (data) => ({ ...data, [name]: count, });

    setInputValue(newInput);
  };

  const getChangeData = (e) => {
    console.log(e)
  }
  const cartList = useSelector(state => state.user.cartList)
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const uniqueByPhotoType = arr => Object.values(arr.reduce((acc, obj) => (!acc[obj.id] || !acc[obj.id][obj.photo_type] || acc[obj.id][obj.photo_type].quantity < obj.quantity) ? { ...acc, [obj.id]: { ...acc[obj.id], [obj.photo_type]: obj } } : acc, {})).reduce((res, subObj) => [...res, ...Object.values(subObj)], []);

    console.log(uniqueByPhotoType(cartList))
  };

  const [isBlur, setIsBlur] = useState(false);
  const blurRef = useRef(null);

  useClickOutside(blurRef, () => {
    setIsBlur(false);
  })

  const [isActiveForm, setIsActiveForm] = useState(false);

  return (
    <div className={styles.ordersWrap}>
      <Scaner
        isAuth
        scanActive={scanActive}
        setScanActive={setScanActive}
      />
      <div className={styles.orderWidggetWrap}>
        <div className={styles.orderWidggetContainer}>
          <h1 className={styles.profileTitle}>Выбор фотографии  <button onClick={() => setScanActive(!scanActive)} className={styles.qrCodeBtn}></button></h1>
          <div key={photos.length} id="orderForm" className={isBlur ? styles.photoCardsFormBlur : styles.photoCardsForm}>
            <div ref={blurRef} className={styles.photoCardsWrap}>
              {photos.photos?.map((photo, i) => {
                return (
                  <PhotoCard
                    onSubmitHandler={onSubmitHandler}
                    number={photo.number}
                    photoId={photo.id}
                    key={i}
                    blurRef={blurRef}
                    setIsBlur={setIsBlur}
                    photo={photo.photo}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                    getChangeData={getChangeData}
                  />
                )
              })}
            </div>
            {blocks.map((block, i) => (
              <div key={i}>
                <div className={styles.photoCardsWrap}>
                  {addPhoto?.filter((obj, index, self) => self.map(item => item.number).indexOf(obj.number) === index).map((elem, i) => {
                    return (
                      <PhotoCard
                        number={elem.number}
                        key={i}
                        blurRef={blurRef}
                        setIsBlur={setIsBlur}
                        photo={elem.photo}
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue}
                        getChangeData={getChangeData}
                      />
                    )
                  })}
                </div>
                <div className={styles.addBtnWrap}>
                  <button className={styles.deleteBlockBtn} onClick={() => deleteBlock(block.id)}>Удалить блок</button>
                </div>
              </div>
            ))}
          </div>
          <AddKidsForm
            setIsActiveForm={setIsActiveForm}
            isActiveForm={isActiveForm}
            addBlock={addBlock}
          />
          <div className={styles.orderPromoWrap}>
            <div className={styles.orderPromo}>
              <div className={styles.promoStringWrap}>
                <div className={styles.dot}>
                </div>
                <div className={styles.promoInputWrapp}>
                  <span style={styles.promoString}>
                    Отправить электронную версию на электронную почту
                  </span>
                  <input className={styles.promoInput} placeholder="Электронный адрес*" type="text" />
                </div>
              </div>
              <div className={styles.promoStringWrap}>
                <div className={styles.dot}>
                </div>
                <span style={styles.promoString}>
                  При заказе от 2000 рублей, к такой-то дате, вы получите все фото в электронном виде
                </span>
              </div>
              <div className={styles.promoStringWrap}>
                <div className={styles.dot}>

                </div>
                <span style={styles.promoString}>
                  При заказе от 2700 рублей, эл. версия всех фотографий календаря в подарок
                </span>
              </div>
            </div>
            <div className={styles.orderPromo}>
              <span style={styles.promoString}>
                Введите промо-код для получения скидки
              </span>
              <div className={styles.promoInputWrap}>
                <input className={styles.promoInput} placeholder="Введите промокод" type="text" />
                <span>Промо-код активирован</span>
              </div>
            </div>
          </div>
          <div className={styles.promoButtonWrap}>
            <button onClick={() => setIsActiveForm(true)} className={styles.mainButton}>Добавить ребенка</button>
            <span>{1 + blocks.length} из 3</span>
          </div>
        </div>
        <div className={styles.paymentTimerWrap}>
          <PaymentTimer
            formId={'orderForm'}
            onSubmitHandler={onSubmitHandler}
            count={'3 500'}
          />
        </div>
      </div>

    </div>
  );

};
