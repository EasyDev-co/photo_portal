import { useEffect } from "react";
import styles from "./Gallery.module.css";
import { fetchGetOrderWithTokenInterceptor } from "../../http/getOrder";
import GalleryItem from "./GalleryItem";
export const Gallery = () => {
  const accessStor = localStorage.getItem('access');
  // useEffect(()=>{
  //   try {
  //     const response = fetchGetOrderWithTokenInterceptor(accessStor)
  //     if(response.ok){
  //       const data = response.json()
  //       console.log(data)
  //     } else {
  //       const data = response.json()
  //       console.log(data)
  //     }
  //   } catch (error) {
        
  //   }
  // },[])
  return <>
    <div className={styles.ordersWrap}>
      <GalleryItem/>
    </div>
  </>;
};
