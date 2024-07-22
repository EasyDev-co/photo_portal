import { useEffect } from "react";
import styles from "./Gallery.module.css";
import { fetchGetOrderWithTokenInterceptor } from "../../http/getOrder";
export const Gallery = () => {
  const accessStor = localStorage.getItem('access');
  useEffect(()=>{
    try {
      const response = fetchGetOrderWithTokenInterceptor(accessStor)
      if(response.ok){
        const data = response.json()
        console.log(data)
      } else {
        const data = response.json()
        console.log(data)
      }
    } catch (error) {
        
    }
   
      
  },[])
  return <>
    <div className={styles.ordersWrap}>
      <div>
        <h1 className={styles.profileTitle}>

        </h1>
        <div className={styles.Orders}> 

        </div>
      </div>
      <div className={styles.photosGallery}>

      </div>
    </div>
  </>;
};
