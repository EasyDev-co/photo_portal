import { useEffect, useState } from 'react'
import GalleryItem from './GalleryItem'
import styles from './Gallery.module.css'
import { fetchGetPaidOrderTokenInterceptor } from '../../http/getPaidOrders'

export const Gallery = () => {
  const accessStor = localStorage.getItem('access')
  const [paidOrders, setPaidOrders] = useState(null) // null для начального состояния
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPaidOrders = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetchGetPaidOrderTokenInterceptor(accessStor)

        if (res.ok) {
          const data = await res.json()
          // console.log('Данные загружены:', data)
          setPaidOrders(data) // Устанавливаем массив данных
        } else {
          setError('Ошибка загрузки данных')
        }
      } catch (err) {
        console.error('Ошибка:', err)
        setError('Произошла ошибка при загрузке данных')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaidOrders()
  }, [accessStor])

  // Отладка состояния
  // useEffect(() => {
  //   console.log('Текущее состояние paidOrders:', paidOrders)
  //   console.log('Текущее состояние isLoading:', isLoading)
  //   console.log('Текущее состояние error:', error)
  // }, [paidOrders, isLoading, error])

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className={styles.ordersWrap}>
      <div className={styles.ordersInfo}>Загрузка данных...</div>
    </div>
    )
  }

  // Обработка ошибок
  if (error) {
    return <p>{error}</p>
  }

  // Если массив пуст
  if (!paidOrders || paidOrders.length === 0) {
    return (
      <div className={styles.ordersWrap}>
        <div className={styles.ordersInfo}>Нет оплаченных заказов</div>
      </div>
    )
  }

  // Проверки на основе всего массива
  const isDigitalMissing = paidOrders.every((order) => !order.is_digital)
  if (isDigitalMissing) {
    return (
      <div className={styles.ordersWrap}>
        <div className={styles.ordersInfo}>
          В данном заказе вы не заказывали фотографии в электронном виде,
          поэтому они не сохранились.
          <br />
          Фотосессия: {paidOrders[0].photo_theme_name},{' '}
          {paidOrders[0].photo_theme_date}
        </div>
      </div>
    )
  }

  const isSessionNotEnded = paidOrders.some(
    (order) => order.is_digital && !order.is_date_end,
  )
  if (isSessionNotEnded) {
    return (
      <div className={styles.ordersWrap}>
        <div className={styles.ordersInfo}>
          Дождитесь окончания фотосессии
          <br />
          Фотосессия: {paidOrders[0].photo_theme_name},{' '}
          {paidOrders[0].photo_theme_date}
        </div>
        {/* <p>Дождитесь окончания фотосессии</p> */}
      </div>
    )
  }

  const isGalleryReady = paidOrders.every(
    (order) => order.is_digital && order.is_date_end,
  )
  if (isGalleryReady) {
    return (
      <div className={styles.ordersWrap}>
        <GalleryItem orders={paidOrders} />
      </div>
    )
  }

  // Предохранитель
  return null
}

// import { useEffect, useState } from "react";
// import GalleryItem from "./GalleryItem";
// import { fetchGetPaidOrderTokenInterceptor } from "../../http/getPaidOrders";

// export const Gallery = () => {
//   const accessStor = localStorage.getItem("access");
//   const [paidOrders, setPaidOrders] = useState(null); // null для начального состояния
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPaidOrders = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const res = await fetchGetPaidOrderTokenInterceptor(accessStor);

//         if (res.ok) {
//           const data = await res.json();
//           console.log("Данные загружены:", data);
//           setPaidOrders(data); // Устанавливаем массив данных
//         } else {
//           setError("Ошибка загрузки данных");
//         }
//       } catch (err) {
//         console.error("Ошибка:", err);
//         setError("Произошла ошибка при загрузке данных");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPaidOrders();
//   }, [accessStor]);

//   // Отладка состояния
//   useEffect(() => {
//     console.log("Текущее состояние paidOrders:", paidOrders);
//     console.log("Текущее состояние isLoading:", isLoading);
//     console.log("Текущее состояние error:", error);
//   }, [paidOrders, isLoading, error]);

//   // Состояние загрузки
//   if (isLoading) {
//     return <p>Загрузка данных...</p>;
//   }

//   // Обработка ошибок
//   if (error) {
//     return <p>{error}</p>;
//   }

//   // Если массив пуст
//   if (!paidOrders || paidOrders.length === 0) {
//     return <p>Нет оплаченных заказов</p>;
//   }

//   // Логика для каждого объекта в массиве
//   return (
//     <div>
//       {paidOrders.map((order, index) => {
//         if (!order.is_digital) {
//           return (
//             <p key={index}>
//               В данном заказе вы не заказывали фотографии в электронном виде, поэтому
//               они не сохранились.
//             </p>
//           );
//         }

//         if (order.is_digital && !order.is_date_end) {
//           return <p key={index}>Дождитесь окончания фотосессии</p>;
//         }

//         if (order.is_digital && order.is_date_end) {
//           return <GalleryItem key={index} orders={order} />;
//         }

//         return null; // Предохранитель
//       })}
//     </div>
//   );
// };

// import { useEffect, useState } from 'react'
// import styles from './Gallery.module.css'
// import GalleryItem from './GalleryItem'
// import { fetchGetPaidOrderTokenInterceptor } from '../../http/getPaidOrders'

// export const Gallery = () => {
//   const accessStor = localStorage.getItem('access')
//   const [paidOrders, setPaidOrders] = useState([])

//   useEffect(() => {
//     console.log(paidOrders)
//   }, [paidOrders])

//   useEffect(() => {
//     try {
//       fetchGetPaidOrderTokenInterceptor(accessStor).then((res) => {
//         if (res.ok) {
//           res.json().then((res) => {
//             setPaidOrders(res)
//           })
//         }
//       })
//     } catch (error) {
//       console.log(error)
//     }
//     console.log(paidOrders.length)
//   }, [])

//   return (
//     <>
{
  /* <div className={styles.ordersWrap}>
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
      </div> */
}

//       <div className={styles.ordersWrap}>
//       {(paidOrders.length !== 0 && paidOrders[0].id) ?
//         <GalleryItem
//           orders={paidOrders}
//         /> :
//         <div className={styles.ordersInfo}>
//           Нет оплаченных заказов.
//         </div>}
//     </div>
//     </>
//   )
// }
//Если is_digital===false => "Вы не набрали заказ на нужную сумму"
//Если is_digital===true, а is_digital_free===false, то фото были куплены
//Если is_digital===true, is_date_end===false, то "Дождитесь окончания фото"
