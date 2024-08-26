import { useEffect, useState } from "react";
import styles from "./Gallery.module.css";
import GalleryItem from "./GalleryItem";
import { useSelector } from "react-redux";
import { fetchStatePaymentTokenInterceptor, statePayment } from "../../http/statePayment";
import { fetchGetPaidOrderTokenInterceptor } from "../../http/getPaidOrders";
import { getCookie } from "../../utils/setCookie";
export const Gallery = () => {
  const accessStor = localStorage.getItem('access');
  const [paidOrders, setPaidOrders] = useState([]);
  const [isPaid, setIsPaid] = useState(false)
  useEffect(() => {
    const order = getCookie('order');
    if (order) {
      try {
        fetchStatePaymentTokenInterceptor(accessStor)
          .then(res => {
            if (res.ok) {
              res.json()
                .then(res => {
                  setIsPaid(res)
                })
            }
          })
      } catch (error) {
        console.log(error)
      }
    }
  }, [])
  useEffect(() => {
    fetchGetPaidOrderTokenInterceptor(accessStor)
      .then(res => {
        if (res.ok) {
          res.json()
            .then(res => {
              setPaidOrders(res)
            })
        }
      })
  }, [])

  return <>
    <div className={styles.ordersWrap}>
      {isPaid === 'OK' ?
        <GalleryItem
          orders={paidOrders}
        /> :
        <div className={styles.ordersInfo}>
          Нет оплаченных заказов.
        </div>}
    </div>
  </>;
};
