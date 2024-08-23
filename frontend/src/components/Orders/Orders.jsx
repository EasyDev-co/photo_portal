import styles from "./Orders.module.css";
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import PaymentTimer from '../Payment/PaymentTimer/PaymentTimer';
import { useClickOutside } from "../../utils/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import AddKidsForm from "./AddKids/AddKidsForm";
import Scaner from "../Scaner/Scaner";
import { addPhotos, setCart } from "../../store/authSlice";
import { useAuth } from "../../utils/useAuth";
import Block from "./PhotoCard/PhotoBlock/Block";
import { transformData } from "./PhotoCard/utils/utils";
import { patchPhotoLine } from "../../http/patchPhotoLine";
import { fetchCartCreateWithTokenInterceptor } from "../../http/cartCreate";
import { fetchOrderCreateWithTokenInterceptor, orderCreate } from "../../http/orderCreate";
import { fetchPhotoLineListWithTokenInterceptor } from "../../http/photoLineList";
import danger from '../../../src/assets/images/Auth/DangerCircle.svg'
import { fetchWithTokenInterceptor } from "../../http/getPhotoLine";
import { fetchPaymentCreateTokenInterceptor, paymentCreate } from "../../http/fetchPayment";

export const Orders = () => {
  const dispatch = useDispatch();

  const [lineLenght, setlineLenght] = useState(0)
  const addPhoto = useSelector(state => state.user.photos);
  // const [photos, setPhotos] = useState([]);
  const [scanActive, setScanActive] = useState(false);
  const [sessionData, setSessionData] = useState(sessionStorage.getItem('photoline'));
  const accessStor = localStorage.getItem('access');
  const idP = localStorage.getItem('idP');
  const { isAuth } = useAuth();
  const [blocks, setBlocks] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [orderValue, setOrderValue] = useState([]);

  const [inputValue, setInputValue] = useState({
    "10x15": 0,
    "15x20": 0,
    "20x30": 0,
    magnet: 0,
    calendar: 0,
    photo_book: 0,
    digital: false
  });
  const [isBlur, setIsBlur] = useState(false);
  const blurRef = useRef(null);

  const [isActiveForm, setIsActiveForm] = useState(false);
  useEffect(() => {
    let isMounted = true;
    if (sessionData) {
      fetchWithTokenInterceptor(sessionData, accessStor)
        .then(res => {
          if (isMounted && res.ok) {
            res.json()
              .then(data => {
                dispatch(addPhotos(data));
                patchPhotoLine(accessStor, { "parent": idP }, data.id)
              })
          }
        })
      return () => {
        isMounted = false;
      };
    }

  }, [accessStor, sessionData])

  useEffect(() => {
    let isMounted = true; // добавляем переменную для отслеживания монтирования
    fetchPhotoLineListWithTokenInterceptor(accessStor, '')
      .then(res => {
        if (isMounted && res.ok) {
          res.json()
            .then(data => {
              setlineLenght(data.length)
              data.forEach(elem => {
                dispatch(addPhotos(elem));
                patchPhotoLine(accessStor, { "parent": idP }, elem.id)
              });
            })
        }
      })
    return () => {
      isMounted = false;
    };
  }, [accessStor, dispatch, idP, lineLenght]);

  const addBlock = useCallback(() => {
    if (blocks.length < 2) {
      setBlocks(prevBlocks => [...prevBlocks, { id: blocks.length + 1 }]);
    }
  }, [blocks.length]);

  const onChangeHandler = (name, count, photoId, isChecked, photoLineId, blockId) => {
    const newValue = {
      blockId: blockId,
      quantity: count,
      id: photoId,
      photo_type: Number(name),
      is_photobook: isChecked,
      is_digital: false,
      photoLineId: photoLineId
    };

    setOrderValue(prev => {
      const updatedState = [...prev];
      const existingIndex = updatedState.findIndex(
        item => item.id === photoId && item.photo_type === newValue.photo_type
      );
      if (existingIndex !== -1) {
        updatedState[existingIndex] = newValue;
      } else {
        updatedState.push(newValue);
      }
      return updatedState;
    });

    setInputValue(prevInput => ({ ...prevInput, [name]: count }));
  };
  // console.log(orderValue)
  useEffect(() => {

    const transformedData = transformData(orderValue);
    // console.log(transformedData)
    fetchCartCreateWithTokenInterceptor(accessStor, '', transformedData)
      .then(res => {
        if (res.ok) {
          res.json()
            .then(res => {
              dispatch(setCart(res))
            })

        }
      })
  }, [orderValue])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (orderValue.length !== 0) {
     
      const order = await  fetchOrderCreateWithTokenInterceptor(accessStor)
      if (order.ok) {
        const data = await order.json();
        paymentCreate(accessStor, data[0].id)
          .then(res => {
            if (res.ok) {
              res.json()
                .then(res => {
                  console.log(res)
                  window.location.href = res;
                })
            } else {
              res.json()
                .then(res => {
                  console.log(res)
                })
            }
          })

      } else {
        const data = await order.json();
        console.log(data)
      }
    }

  };

  const handleCheckboxChange = (event, photoLineId) => {
    const { checked, name } = event.target;

    setOrderValue((prev) => {
      const existingItemIndex = prev.findIndex(item => item.id === photoLineId);

      if (existingItemIndex > -1) {
        const updatedItem = { ...prev[existingItemIndex] };
        if (name == 6) {
          updatedItem.is_photobook = checked;
        } else if (name == 7) {
          updatedItem.is_digital = checked;
        }
        return [
          ...prev.slice(0, existingItemIndex),
          updatedItem,
          ...prev.slice(existingItemIndex + 1),
        ];
      } else {
        const newItem = {
          id: photoLineId,
          photos: [],
          is_photobook: name == 6 ? checked : false,
          is_digital: name == 7 ? checked : false
        };
        return [...prev, newItem];
      }
    });
  };

  return (
    <div className={styles.ordersWrap}>
      <Scaner isAuth={isAuth} scanActive={scanActive} setScanActive={setScanActive} />
      <div className={styles.orderWidggetWrap}>
        <div className={styles.orderWidggetContainer}>
          <h1 className={styles.profileTitle}>Выбор фотографии
            <button onClick={() => setScanActive(!scanActive)} className={styles.qrCodeBtn}></button>
          </h1>
          <div id="orderForm" className={isBlur ? styles.photoCardsFormBlur : styles.photoCardsForm}>
            {addPhoto.length === 0 ? <div>
              У Вас пока нет заказов
            </div> :
              <Block
                addPhoto={addPhoto}
                orderValue={orderValue}
                setOrderValue={setOrderValue}
                onChangeHandler={onChangeHandler}
                inputValue={inputValue}
                blurRef={blurRef}
                setIsBlur={setIsBlur}
                setIsChecked={setIsChecked}
                isChecked={isChecked}
                handleCheckboxChange={handleCheckboxChange}
                lineLenght={lineLenght}
                setlineLenght={setlineLenght}
              />
            }

          </div>
          <AddKidsForm setIsActiveForm={setIsActiveForm} isActiveForm={isActiveForm} addBlock={addBlock} />
          <div className={styles.orderPromoWrap}>
            <div className={styles.orderPromoPromocode}>
              <span className={styles.promoString}>Введите промо-код для получения скидки</span>
              <div className={styles.promoInputWrap}>
                <input className={true ? styles.promoInputActive : styles.promoInput}
                  placeholder={true ? "Промо-код активирован" : "Введите промокод"}
                  type="text"
                  name="digital"
                />
              </div>
            </div>
          </div>
          {lineLenght >= 3 ?
            <div className={styles.buttonAddKidsWrap}>
              <div className={styles.promoButtonWrap}>
                <button onClick={() => setIsActiveForm(false)} className={styles.mainButton}>Добавить ребенка</button>
                <span>{lineLenght} из 3</span>
              </div>
              <div className={styles.errMessage}>
                <img src={danger} alt="" />
                <span>
                  Вы превысили лимит добавления детей. Если у вас четверо детей, то напишите нам на
                  <a className={styles.mailLink} href="">
                    fotodetstvo1@yandex.ru
                  </a>
                  и мы проверим информацию
                </span>
              </div>
            </div> :
            <div>
              <div className={styles.promoButtonWrap}>
                <button onClick={() => setIsActiveForm(true)} className={styles.mainButton}>Добавить ребенка</button>
                <span>{lineLenght} из 3</span>
              </div>
            </div>
          }
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

export default Orders;