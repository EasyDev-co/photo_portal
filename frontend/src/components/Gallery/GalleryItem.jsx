import styles from './Gallery.module.css'
import kid1 from '../../assets/images/Auth/kids/children1.png'
import kid2 from '../../assets/images/Auth/kids/children1.png'
import kid3 from '../../assets/images/Auth/kids/children1.png'
import kid4 from '../../assets/images/Auth/kids/children1.png'
import kid5 from '../../assets/images/Auth/kids/children1.png'
import kid6 from '../../assets/images/Auth/kids/children1.png'
const GalleryItem = () => {
    const options = [
        { id: 1, label: 'Без комиссии', src: kid1 },
        { id: 2, label: 'Комиссия 3%', src: kid2 },
        { id: 3, label: 'Комиссия 3%', src: kid3 },
        { id: 4, label: 'Комиссия 3%', src: kid4 },
        { id: 5, label: 'Комиссия 3%', src: kid5 },
        { id: 6, label: 'Комиссия 3%', src: kid6 },
      ];
    return (
        <div className={styles.galleryItemWrap}>
            <div className={styles.titleWrap}>
               <div className={styles.galleryTitle}>
                    Зимняя сказка
               </div>
               <div className={styles.date}>
               Ноябрь 2020 года. Ростов-на-Дону
               </div>
            </div>
            <div className={styles.photosGallery}>
                {options.map(elem=>{
                    return(
                        <div className={styles.imgWrap}>
                            <img src={elem.src} alt="" />
                        </div>
                    )
                })}
            </div>
            <div className={styles.btnWrap}>
                <button className={styles.galleryBtn}>
                    Скачать
                </button>
            </div>
        </div>
    );
}

export default GalleryItem;