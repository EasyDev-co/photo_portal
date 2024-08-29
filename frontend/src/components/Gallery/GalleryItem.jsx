import styles from './Gallery.module.css'
import { fetchDownloadPhotoWithInterceptor } from '../../http/photo/downloadPhoto';

const GalleryItem = ({ orders }) => {
    const accessStor = localStorage.getItem('access');

    const fetchData = (id) => {
        
        orders[id].photos.forEach(elem => {
            fetchDownloadPhotoWithInterceptor(elem.id, accessStor)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Сеть ответила некорректно');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${orders[id].photo_theme_name}_${orders[id].photo_theme_date}_${elem.number}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                })
                .catch(error => console.error('Ошибка при загрузке изображения:', error));
        })

    }

    return (
        <>
            {orders.map((elem, i) => {
                return (
                    <div key={i} className={styles.galleryItemWrap}>
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
                                    <div key={photo.id}  className={styles.imgWrap}>
                                        <img src={photo.photo} alt="" />
                                    </div>
                                )
                            })}
                        </div>
                        <div className={styles.btnWrap}>
                            <button onClick={() => fetchData(i)}className={styles.galleryBtn}>
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