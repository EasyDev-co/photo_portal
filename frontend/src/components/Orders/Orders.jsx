/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-constant-condition */
import styles from "./Orders.module.css";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PaymentTimer from '../Payment/PaymentTimer/PaymentTimer';
import { useDispatch, useSelector } from "react-redux";
import AddKidsForm from "./AddKids/AddKidsForm";
import Scaner from "../Scaner/Scaner";
import { addPhotos, setCart, setOrderId } from "../../store/authSlice";
import { useAuth } from "../../utils/useAuth";
import Block from "./PhotoCard/PhotoBlock/Block";
import { transformData } from "./PhotoCard/utils/utils";
import { patchPhotoLine } from "../../http/photo/patchPhotoLine";
import { fetchCartCreateWithTokenInterceptor } from "../../http/cart/cartCreate";
import { fetchPhotoLineListWithTokenInterceptor } from "../../http/photo/photoLineList";
import danger from '../../../src/assets/images/Auth/DangerCircle.svg'
import { fetchWithTokenInterceptor } from "../../http/photo/getPhotoLine";
import { Link, useNavigate } from "react-router-dom";
import { fetchOrderCreateWithTokenInterceptor } from "../../http/order/orderCreate";
import Modal from "../Modal/Modlal";
import { setCookie } from "../../utils/setCookie";
import { getNearestDate } from "./utils/utils";
import plus from '../../assets/icons/plus.svg'

export const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [lineLenght, setlineLenght] = useState(0)
  const addPhoto = useSelector(state => state.user.photos);
  const [scanActive, setScanActive] = useState(false);
  const [sessionData, setSessionData] = useState(sessionStorage.getItem('photoline'));
  const accessStor = localStorage.getItem('access');
  const idP = localStorage.getItem('idP');
  const { isAuth } = useAuth();
  const [blocks, setBlocks] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [orderValue, setOrderValue] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [modalText, setModalText] = useState('')
  const [codeIsActive, setCodeActive] = useState(false);
  const [payOrder, setPayOrder] = useState({});

  const [price, setPrice] = useState({
    total_price: ''
  })
  const [priceCalendar, setPriceCalendar] = useState({
    ransom_amount_for_digital_photos: '',
    ransom_amount_for_calendar: '',
  })
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
  const timeoutId = useRef(null);
  const [isActiveForm, setIsActiveForm] = useState(false);
  const cart = useSelector(state => state.user.cart);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        dispatch(setCart(savedCart));
    }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


  useEffect(() => {
    let isMounted = true;
    console.log(sessionData)
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
    let isMounted = true; 
    fetchPhotoLineListWithTokenInterceptor(accessStor, '')
      .then(res => {
        if (isMounted && res.ok) {
          res.json()
            .then(data => {
              console.log(data)       //ЗДЕСЬ ЕСТЬ АЙДИ ФОТОЛИНИИ
              // data[0].photo_theme.id
              getNearestDate(data);
              setlineLenght(data.length);
              if (data.length > 0) {

                setPriceCalendar({
                  ransom_amount_for_digital_photos: data[0].ransom_amount_for_digital_photos,
                  ransom_amount_for_calendar: data[0].ransom_amount_for_calendar,
                });
              } else {
                // Handle the case where data is empty
                console.warn('Data is empty:', data);
              }
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

  const [currentPromoCode, setCurrentPromoCode] = useState("");

  
  const onChangeHandler = (name, count, photoId, isChecked, photoLineId, blockId) => {
    const newValue = {
      blockId: blockId,
      quantity: count,
      id: photoId,
      photo_type: Number(name),
      is_photobook: isChecked,
      is_digital: false,
      photoLineId: photoLineId,
      promo_code: currentPromoCode // Используем текущий промокод из state
    };
  
    setOrderValue((prev) => {
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
  
    setInputValue((prevInput) => ({ ...prevInput, [name]: count }));
  };

  // useEffect(() => {
  //   const transformedData = transformData(orderValue);
  //   fetchCartCreateWithTokenInterceptor(accessStor, '', transformedData)
  //     .then(res => {
  //       if (res.ok) {
  //         res.json()
  //           .then(res => {
  //             setPrice({
  //               total_price: res[0]?.total_price || ''
  //             })
  //             dispatch(setCart(res))
  //           })
  //       }
  //     })
  // }, [orderValue])
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    
    if (savedCart && savedCart.length > 0) {
        dispatch(setCart(savedCart)); // Используем localStorage если данные есть
    } else {
        // Запрос данных корзины с сервера
        fetchCartCreateWithTokenInterceptor(accessStor, '/cart', {})
            .then((res) => res.json())
            .then((data) => {
                dispatch(setCart(data)); // Обновляем Redux корзину с сервера
            })
            .catch((err) => console.error("Ошибка загрузки корзины:", err));
    }
}, [dispatch, accessStor]);

// Синхронизация корзины с сервером при изменении orderValue
useEffect(() => {
    if (orderValue.length > 0) {
      console.log(orderValue)
        const transformedData = transformData(orderValue);
        console.log(transformedData)
        fetchCartCreateWithTokenInterceptor(accessStor, '', transformedData)
            .then((res) => res.json())
            .then((data) => {
              console.log(data)
                dispatch(setCart(data));
                localStorage.setItem('cart', JSON.stringify(data)); // Сохраняем в localStorage
            })
            .catch((err) => console.error("Ошибка синхронизации корзины:", err));
    }
}, [orderValue, accessStor, dispatch]);


  const onSubmitHandler = async (e) => {
    console.log("Текущее состояние корзины перед отправкой заказа:", cart);

    if (cart.length !== 0) {
      try {
        const order = await fetchOrderCreateWithTokenInterceptor(accessStor)
        if (order.ok) {
          const data = await order.json();
          setCookie('order', JSON.stringify(data))
          dispatch(setOrderId(data));
          navigate(`/cart/${data.id}`, { state: data });
        } else {
          const data = await order.json();
        }
      } catch (error) {
        console.log(error)
      }
    }
  };

  const handleCheckboxChange = (event, photoLineId) => {
    const { checked, name } = event.target;

    setOrderValue((prev) => {
      const existingItemIndex = prev.findIndex(item => item.id === photoLineId);
      console.log('prev:', prev, 'existingItemIndex:', existingItemIndex)

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

  const handlePromocodeChange = (e) => {
    const newPromoCode = e.target.value;
    setCurrentPromoCode(newPromoCode);

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      const updatedOrders = orderValue.map(order => ({
        ...order,
        promo_code: newPromoCode,
      }));
      setOrderValue(updatedOrders);
    }, 1000);
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
                price={price}
                priceCalendar={priceCalendar}
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
          <AddKidsForm setIsActiveForm={setIsActiveForm} isActiveForm={isActiveForm} addBlock={addBlock} setModalActive={setModalActive} setModalText={setModalText} />
          <Modal active={modalActive} setActive={setModalActive} text={modalText} />
          <div className={styles.orderPromoWrap}>
            <div className={styles.orderPromoPromocode}>
              <div className={styles.promoInputWrap}>
                <input onChange={(e) => handlePromocodeChange(e)} className={true ? styles.promoInputActive : styles.promoInput}
                  placeholder={codeIsActive ? "Промо-код активирован" : "Введите промокод"}
                  type="text"
                  name="digital"
                />
              </div>
            </div>
          </div>
          {lineLenght >= 3 ?
            <div className={styles.buttonAddKidsWrap}>
              <div className={styles.promoButtonWrap}>
                {/* <button onClick={() => setIsActiveForm(false)} className={styles.mainButton}>Добавить ребенка</button> */}
                <button style={{display: 'flex', alignItems: 'center'}} onClick={() => setIsActiveForm(true)} >
                  <img 
                  style={{width: '50px'}}
                  src={plus} alt="plus"></img>
                  <span 
                  style={{color: "#11bbd1", paddingLeft: '10px', whiteSpace: 'nowrap'}}
                  >
                    Добавить ребенка
                  </span>
                </button>
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
                {/* <button onClick={() => setIsActiveForm(true)} className={styles.mainButton}>Добавить ребенка</button> */}
                <button style={{display: 'flex', alignItems: 'center'}} onClick={() => setIsActiveForm(true)} >
                  <img 
                  style={{width: '50px'}}
                  src={plus} alt="plus"></img>
                  <span 
                  style={{color: "#11bbd1", paddingLeft: '10px', whiteSpace: 'nowrap'}}
                  >
                    Добавить ребенка
                  </span>
                </button>
                <span>{lineLenght} из 3</span>
              </div>
            </div>
          }
        </div>
        <div className={styles.paymentTimerWrap} style={{
          padding: '69px 0 160px 0',
          maxWidth: '380px',
        }}>
          <PaymentTimer
            payOrder={payOrder}
            formId={'orderForm'}
            onSubmitHandler={onSubmitHandler}
            count={'3 500'}
            stylesPosition={`position: 'fixed'`}
            styleTop={`top: '40px'`}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;