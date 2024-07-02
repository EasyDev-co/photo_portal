import styles from "./Orders.module.css";
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../utils/useAuth';
import { addAccessTokenToHeaders } from "../../http/addAccessToken";
import PhotoCard from "./PhotoCard/PhotoCard";
import children1 from '../../assets/images/Auth/kids/children1.png'
import children2 from '../../assets/images/Auth/kids/children2.png'
import children3 from '../../assets/images/Auth/kids/children3.png'
import children4 from '../../assets/images/Auth/kids/children4.png'
import children5 from '../../assets/images/Auth/kids/children5.png'
import children6 from '../../assets/images/Auth/kids/children6.png'
import PaymentTimer from '../Payment/PaymentTimer/PaymentTimer'
import { useClickOutside } from "../../utils/useClickOutside";
import { getPhotoLine } from "../../http/getPhotoLine";
import { tokenRefreshCreate } from "../../http/tokenRefreshCreate";
import { getCookie, setCookie } from "../../utils/setCookie";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "../../store/authSlice";

export const Orders = () => {

  const dispatch = useDispatch();
  const [photos, setPhotos] = useState([]);
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
        return res.access
      })
      .then(access => {
        getPhotoLine('0472faa8-1e9d-485c-973a-15664608ff31', access)
          .then(res => res.json())
          .then(res => {
            if(res.photos){
              setPhotos(res);
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
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
  }

  const [isBlur, setIsBlur] = useState(false);
  const blurRef = useRef(null);

  useClickOutside(blurRef, () => {
    setIsBlur(false);
  })

  return (
    <div className={styles.ordersWrap}>
      <div className={styles.orderWidggetWrap}>
        <div className={styles.orderWidggetContainer}>
          <h1 className={styles.profileTitle}>Выбор фотографии</h1>
          <form onSubmit={(e) => onSubmitHandler(e)} id="orderForm" className={isBlur ? styles.photoCardsFormBlur : styles.photoCardsForm}>
            <div ref={blurRef} className={styles.photoCardsWrap}>
              {console.log(photos)}

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
              {/* <PhotoCard
                blurRef={blurRef}
                setIsBlur={setIsBlur}
                photo={children1}
                onChangeHandler={onChangeHandler}
                inputValue={inputValue}
              />
              <PhotoCard
                setIsBlur={setIsBlur}
                photo={children2}
                onChangeHandler={onChangeHandler}
                inputValue={inputValue}
              />
              <PhotoCard
                setIsBlur={setIsBlur}
                photo={children3}
                onChangeHandler={onChangeHandler}
                inputValue={inputValue}
              />
              <PhotoCard

                setIsBlur={setIsBlur}
                photo={children4}
                onChangeHandler={onChangeHandler}
                inputValue={inputValue}
              />
              <PhotoCard

                setIsBlur={setIsBlur}
                photo={children5}
                onChangeHandler={onChangeHandler}
                inputValue={inputValue}
              />
              <PhotoCard
                setIsBlur={setIsBlur}
                photo={children6}
                onChangeHandler={onChangeHandler}
                inputValue={inputValue}
              /> */}
            </div>
            {blocks.map((block, i) => (
              <div key={i}>
                <div className={styles.photoCardsWrap}>
                  <PhotoCard

                    setIsBlur={setIsBlur}
                    photo={children1}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                  />
                  <PhotoCard

                    setIsBlur={setIsBlur}
                    photo={children2}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                  />
                  <PhotoCard

                    setIsBlur={setIsBlur}
                    photo={children3}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                  />
                  <PhotoCard

                    setIsBlur={setIsBlur}
                    photo={children4}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                  />
                  <PhotoCard

                    setIsBlur={setIsBlur}
                    photo={children5}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                  />
                  <PhotoCard

                    setIsBlur={setIsBlur}
                    photo={children6}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                  />
                </div>
                <div className={styles.addBtnWrap}>
                  <button className={styles.deleteBlockBtn} onClick={() => deleteBlock(block.id)}>Удалить блок</button>
                </div>
              </div>
            ))}
          </form>
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
            <button className={styles.mainButton} onClick={addBlock}>Добавить ребенка</button>
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
