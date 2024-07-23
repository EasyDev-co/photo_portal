import styles from "./Orders.module.css";
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import PaymentTimer from '../Payment/PaymentTimer/PaymentTimer';
import { useClickOutside } from "../../utils/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import AddKidsForm from "./AddKids/AddKidsForm";
import Scaner from "../Scaner/Scaner";
import { addCartList, addPhotoLine, addPhotos, setCart } from "../../store/authSlice";
import { useAuth } from "../../utils/useAuth";
import Block from "./PhotoCard/PhotoBlock/Block";
import { transformData } from "./PhotoCard/utils/utils";
import { patchPhotoLine } from "../../http/patchPhotoLine";
import { fetchCartCreateWithTokenInterceptor } from "../../http/cartCreate";
import { orderCreate } from "../../http/orderCreate";
import { fetchPhotoLineListWithTokenInterceptor, photoLineList } from "../../http/photoLineList";
import danger from '../../../src/assets/images/Auth/DangerCircle.svg'

export const Orders = () => {
  const dispatch = useDispatch();
  // const photoLineId = useSelector(state => state.user.photoLineId);
  // const photoLine = useSelector(state => state.user.photosLine);
  // const cartList = useSelector(state => state.user.cartList);
  const [lineLenght, setlineLenght] = useState(0)
  const [photos, setPhotos] = useState([]);
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

  useClickOutside(blurRef, () => {
    setIsBlur(false);
  });
  const [isActiveForm, setIsActiveForm] = useState(false);

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
                  .then(() => {
                    if (isMounted) {
                      // console.log('Patched photo line:', elem);
                    }
                  })
                  .catch(error => {
                    if (isMounted) {
                      console.error('Error patching photo line:', error);
                    }
                  });
              });
            })
            .catch(error => {
              if (isMounted) {
                console.error('Error parsing response:', error);
              }
            });
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error('Error fetching photo line list:', error);
        }
      });
    return () => {
      isMounted = false; 
    };
  }, [accessStor, idP, dispatch]);

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

  useEffect(() => {
    const transformedData = transformData(orderValue);
    fetchCartCreateWithTokenInterceptor(accessStor, '', transformedData)
      .then(res => res.json())
      .then(res => {
        dispatch(setCart(res))
      })
  }, [orderValue])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const order = await orderCreate(accessStor)
    if (order.ok) {
      const data = await order.json();
      console.log(data)
    } else {
      const data = await order.json();
      console.log(data)
    }
  };

  const handleCheckboxChange = (event) => {
    const { checked, id } = event.target;
    const updatedItems = orderValue.map(item => {
      if (item.blockId == id) {
        return {
          ...item,
          ['is_photobook']: checked
        };
      }
      return item;
    });
    setOrderValue(updatedItems);
  };

  const handleInputEmailChange = (event) => {
    const updatedItems = orderValue.map(item => {
      return {
        ...item,
        ['is_digital']: !!event.target.value
      };
    });
    setOrderValue(updatedItems);
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
            <Block
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
            />
          </div>
          <AddKidsForm setIsActiveForm={setIsActiveForm} isActiveForm={isActiveForm} addBlock={addBlock} />
          <div className={styles.orderPromoWrap}>
            <div className={styles.orderPromo}>
              {[{
                text: "Отправить электронную версию на электронную почту",
                input: true,
              }, {
                text: "При заказе от 2000 рублей, к такой-то дате, вы получите все фото в электронном виде",
                input: false,
              }, {
                text: "При заказе от 2700 рублей, эл. версия всех фотографий календаря в подарок",
                input: false,
              }].map((promo, index) => (
                <div key={index} className={styles.promoStringWrap}>
                  <div className={styles.dot}></div>
                  {promo.input ? (
                    <div className={styles.promoInputWrapp}>
                      <span className={styles.promoString}>{promo.text}</span>
                      <input
                        className={styles.promoInput}
                        placeholder="Электронный адрес*"
                        type="text"
                        name="digital"
                        onChange={(e) => handleInputEmailChange(e)}
                      />
                    </div>
                  ) : (
                    <span className={styles.promoString}>{promo.text}</span>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.orderPromo}>
              <span className={styles.promoString}>Введите промо-код для получения скидки</span>
              <div className={styles.promoInputWrap}>
                <input className={styles.promoInput}
                  placeholder="Введите промокод"
                  type="text"
                  name="digital"
                />
                <span>Промо-код активирован</span>
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