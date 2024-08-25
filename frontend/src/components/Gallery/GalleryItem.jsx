import styles from './Gallery.module.css'

const GalleryItem = ({ orders }) => {
   
    console.log(orders)
    return (
        <>
            {orders.map(elem => {
                return (
                    <div className={styles.galleryItemWrap}>
                        <div className={styles.titleWrap}>
                            <div className={styles.galleryTitle}>
                                {elem.photo_theme_name}
                            </div>
                            <div className={styles.date}>
                                {elem.photo_theme_date}. {elem.region}
                            </div>
                        </div>
                        <div className={styles.photosGallery}>
                            {elem.photos.map(photo => {
                                return (
                                    <div className={styles.imgWrap}>
                                        <img src={photo.photo} alt="" />
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
                )
            })
            }

        </>


    );
}

export default GalleryItem;