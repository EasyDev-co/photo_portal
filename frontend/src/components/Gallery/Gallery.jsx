import { useEffect, useState } from "react";
import styles from "./Gallery.module.css";
import GalleryItem from "./GalleryItem";
import { useSelector } from "react-redux";
import { fetchStatePaymentTokenInterceptor, statePayment } from "../../http/statePayment";
import { fetchGetPaidOrderTokenInterceptor } from "../../http/getPaidOrders";
export const Gallery = () => {
  const accessStor = localStorage.getItem('access');
  const order = useSelector(state => state.user.order);
  const [paidOrders, setPaidOrders] = useState([])
  useEffect(() => {
    try {
      fetchStatePaymentTokenInterceptor(accessStor)
        .then(res => {
          if (res.ok) {
            res.json()
              .then(res => {
                console.log(res)
              })
          }
        })
    } catch (error) {
      console.log(error)
    }
  }, [])
  useEffect(() => {

    fetchGetPaidOrderTokenInterceptor(accessStor)
      .then(res=>{
        if(res.ok){
          res.json()
            .then(res=>{
              setPaidOrders(res)
            })
        }
      })
  }, [])
  return <>
    <div className={styles.ordersWrap}>
      <GalleryItem
        orders={paidOrders} 
      />
    </div>
  </>;
};
