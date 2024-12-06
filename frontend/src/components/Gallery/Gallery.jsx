import { useEffect, useState } from 'react'
import styles from './Gallery.module.css'
import GalleryItem from './GalleryItem'
import { fetchGetPaidOrderTokenInterceptor } from '../../http/getPaidOrders'

export const Gallery = () => {
  const accessStor = localStorage.getItem('access')
  const [paidOrders, setPaidOrders] = useState([])

  useEffect(() => {
    console.log(paidOrders)
  }, [paidOrders])

  useEffect(() => {
    try {
      fetchGetPaidOrderTokenInterceptor(accessStor).then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            setPaidOrders(res)
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
    console.log(paidOrders.length)
  }, [])

  return (
    <>
      {/* <div className={styles.ordersWrap}>
        {paidOrders.length !== 0 ? (
          paidOrders[0]?.photos.length > 0 ? (
            <GalleryItem orders={paidOrders} />
          ) : (
            <div className={styles.ordersInfo}>
              В данном заказе вы не заказывали фотографии в электронном виде, поэтому они не сохранились.
              <br/> 
              Фотосессия: {paidOrders[0].photo_theme_name}, {paidOrders[0 ].photo_theme_date}
              </div>
          )
        ) : (
          <div className={styles.ordersInfo}>Нет оплаченных заказов.</div>
        )}
      </div> */}

      <div className={styles.ordersWrap}>
      {(paidOrders.length !== 0 && paidOrders[0].id) ?
        <GalleryItem
          orders={paidOrders}
        /> :
        <div className={styles.ordersInfo}>
          Нет оплаченных заказов.
        </div>}
    </div>
    </>
  )
}
