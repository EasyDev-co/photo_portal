import styles from "./Payment.module.css";
import PaymentDiagram from "./PaymentDiagram/PaymentDiagram";
import PaymentItem from "./PaymentItem";
import mir from '../../../src/assets/images/Payment/mir.png'
import t from '../../../src/assets/images/Payment/t.png'
import sber from '../../../src/assets/images/Payment/sber.png'
import sbp from '../../../src/assets/images/Payment/sbp.png'
import { useState } from "react";
import { paymentCreate } from "../../http/fetchPayment";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const Payment = () => {
  const options = [
    { id: 1, label: 'Без комиссии', src: sbp },
    { id: 2, label: 'Комиссия 3%', src: sber },
    { id: 3, label: 'Комиссия 3%', src: t },
    { id: 4, label: 'Комиссия 3%', src: mir },
  ];
  const order_id = useSelector(state=> state.user.order_id);
  const [selectedOption, setSelectedOption] = useState(null);
  const accessStor = localStorage.getItem('access');
  
  const handleOptionClick = (id) => {
    setSelectedOption(id);
    paymentCreate(accessStor, order_id)
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
  };

  return (
    <div className={styles.paymentWrap}>
      <div>
        <h1 className={styles.paymentTitle}>
          Выберите способ оплаты
        </h1>
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
