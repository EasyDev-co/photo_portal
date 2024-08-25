import { useEffect } from "react";
import styles from "./Gallery.module.css";
import GalleryItem from "./GalleryItem";
import { useSelector } from "react-redux";
import { fetchStatePaymentTokenInterceptor, statePayment } from "../../http/statePayment";
export const Gallery = () => {
  const accessStor = localStorage.getItem('access');
  const order = useSelector(state => state.user.order);

  useEffect(() => {
    try {
      fetchStatePaymentTokenInterceptor(accessStor)
        .then(res => {
          if(res.ok){
            res.json()
              .then(res=>{
                console.log(res)
              }) 
          }
        })
    } catch (error) {
      console.log(error)
    }
    

  }, [])
  return <>
    <div className={styles.ordersWrap}>
      <GalleryItem />
    </div>
  </>;
};
