import styles from "./Payment.module.css";
import PaymentDiagram from "./PaymentDiagram/PaymentDiagram";
import PaymentItem from "./PaymentItem";
import mir from '../../../src/assets/images/Payment/mir.png'
import t from '../../../src/assets/images/Payment/t.png'
import sber from '../../../src/assets/images/Payment/sber.png'
import sbp from '../../../src/assets/images/Payment/sbp.png'
import { useEffect, useState } from "react";
import { paymentCreate } from "../../http/fetchPayment";
import { getCookie } from "../../utils/setCookie";
import { useBlocker, useLocation } from "react-router-dom";
import PaymentModal from "../Modal/PaymentModal";
import { fetchCartDeleteWithTokenInterceptor } from "../../http/cart/cartDelete";

export const Payment = () => {
  const options = [
    { id: 1, label: 'Без комиссии', src: sbp },
    { id: 2, label: 'Комиссия 3%', src: sber },
    { id: 3, label: 'Комиссия 3%', src: t },
    { id: 4, label: 'Комиссия 3%', src: mir },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const accessStor = localStorage.getItem('access');
  const location = useLocation();
  const [value, setValue] = useState(false);
  const [activeModal, setActiveModal] = useState(false);

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !value &&
      currentLocation.pathname !== nextLocation.pathname
  );

  const handleOptionClick = (id) => {
    setSelectedOption(id);
    paymentCreate(accessStor, location.state)
      .then(res => {
        if (res.ok) {
          res.json()
            .then(res => {
              window.location.href = res;
            })
        } else {
          res.json()
            .then(res => {
              console.log(res)
            })
        }
      })
  };

  const deleteCartItem = () => {
    if (!value) {
      try {
        fetchCartDeleteWithTokenInterceptor(accessStor, location.state.id)
          .then(res => {
            if (res.ok) {
              setValue(true);
              if (blocker.location) {
                blocker.proceed();
              }
            }
          })

      } catch (error) {
        console.error("Ошибка при удалении элемента корзины:", error);
      }
    }

  };

  useEffect(() => {
    blocker.state === "blocked" ? setActiveModal(true) : setActiveModal(false)
  }, [blocker])

  return (
    <div className={styles.paymentWrap}>
      <div>
        <h1 className={styles.paymentTitle}>
          Выберите способ оплаты
        </h1>
        <PaymentModal
          active={activeModal}
          setActive={setActiveModal}
          blocker={blocker}
          text={<div>
            <p>Если вы покинете эту страницу, ваш заказ не сохранится!</p>
            <div className={styles.btnWrap}>
              <button className={styles.mainButton} onClick={() => blocker.reset()}>
                Продолжить
              </button>
              <button className={styles.resetButton} onClick={() => blocker.location ? deleteCartItem() : blocker.proceed()}>
                Покинуть
              </button>
            </div>

          </div>}
        />
        <div className={styles.paymentItemWrap}>
          {options.map(elem => {
            return (
              <div className={styles.wrapItemBox}>
                <div onClick={() => handleOptionClick(elem.id)} style={{
                  border: '1px solid',
                  borderColor: selectedOption === elem.id ? '#11BBD1' : '#E5E5E5', // Подсветка рамки
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  height: '130px'
                }}>
                  <PaymentItem
                    key={elem.id}
                    id={elem.id}
                    src={elem.src}
                    label={elem.label}
                  />
                </div>
                <div style={{
                  color: '#6E6E6E'
                }}>{elem.label}</div>
              </div>

            )
          })}

        </div>
      </div>
      <div className={styles.paymentTimerWrap}>
        <PaymentDiagram
          text={"Итого:"}
        />
      </div>

    </div>
  )
};
