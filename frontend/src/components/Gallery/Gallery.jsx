import { useEffect, useState } from "react";
import styles from "./Gallery.module.css";
import GalleryItem from "./GalleryItem";
import { fetchGetPaidOrderTokenInterceptor } from "../../http/getPaidOrders";

export const Gallery = () => {
  const accessStor = localStorage.getItem('access');
  const [paidOrders, setPaidOrders] = useState([]);

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
      {paidOrders.length !== 0 ?
        <GalleryItem
          orders={paidOrders}
        /> :
        <div className={styles.ordersInfo}>
          Нет оплаченных заказов.
        </div>}
    </div>
  </>;
};
