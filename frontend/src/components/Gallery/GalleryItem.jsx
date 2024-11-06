/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './Gallery.module.css';
import {useState} from 'react';

const GalleryItem = ({orders}) => {
    const [activePhotos, setActivePhotos] = useState([]);
    const [activeIds, setActiveIds] = useState([]);

    const handleActivePhoto = (id, photo_theme_date, photo_theme_name, number, photo_path) => {
        setActivePhotos(prev => {
            const photoIndex = prev.findIndex(photo => photo.id === id);
            if (photoIndex !== -1) {
                // Удаление выбранного фото
                setActiveIds(prevIds => prevIds.filter(activeId => activeId !== id));
                return prev.filter(photo => photo.id !== id);
            } else {
                // Добавление нового фото
                setActiveIds(prevIds => [...prevIds, id]);
                return [...prev, {
                    id,
                    photo_theme_date,
                    photo_theme_name,
                    number,
                    photo_path
                }];
            }
        });
    };

    const handleDownload = () => {
        activePhotos.forEach((photo, index) => {
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = photo.photo_path;
                a.download = `${photo.photo_theme_name}_${photo.photo_theme_date}_${photo.number}.jpg`;
                document.body.appendChild(a);
                a.click();
                a.remove();

                // Очистка выбранных фото после завершения скачивания последнего файла
                if (index === activePhotos.length - 1) {
                    setActivePhotos([]);
                    setActiveIds([]);
                }
            }, index * 200); // Задержка в 200 мс между скачиваниями
        });
    };


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
                            {elem.photos.map((photo, i) => {
                                const isActive = activeIds.includes(photo.id);
                                return (

                                    <div
                                        onClick={() => handleActivePhoto(photo.id, elem.photo_theme_date, elem.photo_theme_name, photo.number, photo.photo_path)}
                                        key={photo.id}
                                        className={isActive ? styles.imgWrapActive : styles.imgWrap}
                                    >
                                        <img src={photo.photo_path} alt=""/>
                                        <div className={styles.photoNumber}>Фото № {photo.number}</div>
                                    </div>

                                )
                            })}
                        </div>
                    </div>
                )
            })}
            <div className={styles.btnWrap}>
                <button onClick={handleDownload} className={styles.galleryBtn}>
                    Скачать
                </button>
            </div>
        </>
    );
}

export default GalleryItem;