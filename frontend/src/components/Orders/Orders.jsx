import styles from "./Orders.module.css";
import React, { useState, useRef, useEffect } from 'react';
import PhotoCard from "./PhotoCard/PhotoCard";
import PaymentTimer from '../Payment/PaymentTimer/PaymentTimer'
import { useClickOutside } from "../../utils/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import AddKidsForm from "./AddKids/AddKidsForm";
import {tokenRefreshCreate} from '../../http/tokenRefreshCreate'
import { setCookie } from "../../utils/setCookie";
import {addPhotoLine, addPhotos, setAccessToken} from '../../store/authSlice'
import {getPhotoLine} from '../../http/getPhotoLine'

export const Orders = () => {

  const dispatch = useDispatch();
  const addPhoto = useSelector(state=>state.user.photos);
  const [photos, setPhotos] = useState([]);
  const photosLine = useSelector(state=>state.user.photosLine);
  useEffect(() => {
    tokenRefreshCreate()
      .then(res => res.json())
      .then(res => {
        if (res.refresh) {
          setCookie('refresh', res.refresh);
          dispatch(
            setAccessToken(res.access)
          )
        }
        return res.access;
      })
      .then(access => {
        getPhotoLine('dba30881-4eed-40ae-bf83-4c8d0befe9d4', access)
          .then(res => res.json())
          .then(res => {
            if(res.photos){
              setPhotos(res);
              dispatch(addPhotoLine(res.photos))
            }
          })
      })
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
    "10x15": 1,
    "15x20": 1,
    "20x30": 1,
    magnet: 1,
    calendar: 1,
    photo_book: 1
  });

  const onChangeHandler = (name, count) => {
    const newInput = (data) => ({ ...data, [name]: count });
    setInputValue(newInput);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(inputValue)
  };

  const [isBlur, setIsBlur] = useState(false);
  const blurRef = useRef(null);

  useClickOutside(blurRef, () => {
    setIsBlur(false);
  });

  const [isActiveForm, setIsActiveForm] = useState(false);

  return (
    <div className={styles.ordersWrap}>
      <div className={styles.orderWidggetWrap}>
        <div className={styles.orderWidggetContainer}>
          <h1 className={styles.profileTitle}>Выбор фотографии</h1>
          <form onSubmit={(e) => onSubmitHandler(e)} id="orderForm" className={isBlur ? styles.photoCardsFormBlur : styles.photoCardsForm}>
            <div ref={blurRef} className={styles.photoCardsWrap}>
              {photos.photos?.map((photo,i) => {
                return (
                  <PhotoCard
                    key={i}
                    blurRef={blurRef}
                    setIsBlur={setIsBlur}
                    photo={photo.photo}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                  />
                )
              })}
            </div>
            {blocks.map((block, i) => (
              <div key={i}>
                <div className={styles.photoCardsWrap}>
                  {addPhoto?.filter((obj, index, self) => self.map(item => item.number).indexOf(obj.number) === index).map((elem,i)=>{
                    return(
                      <PhotoCard
                      key={i}
                      blurRef={blurRef}
                      setIsBlur={setIsBlur}
                      photo={elem.photo}
                      onChangeHandler={onChangeHandler}
                      inputValue={inputValue}
                    />
                    )
                  })}
              {console.log(addPhoto)}
                </div>
                <div className={styles.addBtnWrap}>
                  <button className={styles.deleteBlockBtn} onClick={() => deleteBlock(block.id)}>Удалить блок</button>
                </div>
              </div>
            ))}
          </form>
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
            <button onClick={()=>setIsActiveForm(true)} className={styles.mainButton}>Добавить ребенка</button>
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
