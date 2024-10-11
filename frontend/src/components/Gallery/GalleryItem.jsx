/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './Gallery.module.css';
import { fetchDownloadPhotoWithInterceptor } from '../../http/photo/downloadPhoto';
import { useState } from 'react';

const GalleryItem = ({ orders }) => {
    const accessStor = localStorage.getItem('access');
    const [activePhoto, setActivePhoto] = useState([]);
    const [activeIds, setActiveIds] = useState([]);

    const handleActivePhoto = (id, photo_theme_date, photo_theme_name, number) => {
        setActivePhoto(prev => {
            const photoIndex = prev.findIndex(photo => photo.id === id);
            if (photoIndex !== -1) {
                // Если фото уже есть, удалить его
                setActiveIds(prevIds => prevIds.filter(activeId => activeId !== id));
                return prev.filter(photo => photo.id !== id);
            } else {
                // Если фото нет, добавить его 
                setActiveIds(prevIds => [...prevIds, id]);
                return [...prev, {
                    id: id,
                    photo_theme_date: photo_theme_date,
                    photo_theme_name: photo_theme_name,
                    number: number
                }];
            }
        });
    }

    const fetchData = (id) => {
        activePhoto.forEach((elem) => {
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
                    a.download = `${elem.photo_theme_name}_${elem.photo_theme_date}_${elem.number}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    setActivePhoto([]);
                    setActiveIds([]);
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
                            {elem.photos.map((photo, i) => {
                                const isActive = activeIds.includes(photo.id);
                                return (
                      
                                        <div
                                            onClick={() => handleActivePhoto(photo.id, elem.photo_theme_date, elem.photo_theme_name, photo.number)}
                                            key={photo.id}
                                            className={isActive ? styles.imgWrapActive : styles.imgWrap}
                                        >
                                            <img src={photo.photo} alt="" />
                                            <div className={styles.photoNumber}>Фото № {photo.number}</div>
                                        </div>
           
                                )
                            })}
                        </div>
                    </div>
                )
            })}
            <div className={styles.btnWrap}>
                <button onClick={() => fetchData()} className={styles.galleryBtn}>
                    Скачать
                </button>
            </div>
        </>
    );
}

export default GalleryItem;