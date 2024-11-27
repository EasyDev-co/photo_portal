/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './Gallery.module.css';
import { useState } from 'react';
import uploadIcon from '../../assets/icons/upload-svgrepo-com.svg'

const GalleryItem = ({ orders }) => {

    const [hoveredPhotoId, setHoveredPhotoId] = useState(null);

    const handleDownloadSinglePhoto = (photoPath, photoName) => {
        const a = document.createElement('a');
        a.href = photoPath;
        a.download = photoName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    
    const handleDownloadAllPhotos = async () => {
        for (const elem of orders) {
            for (const photo of elem.photos) {
                await new Promise((resolve) => {
                    const a = document.createElement('a');
                    a.href = photo.photo_path;
                    a.download = `${elem.photo_theme_name}_${elem.photo_theme_date}_${photo.number}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(resolve, 200); // Задержка между скачиваниями
                });
            }
        }
    };

    return (
        <>
            {orders.map((elem, i) => {
                if (elem.photos.length === 0) {
                    return null;
                }
                return (
                    <div key={i} className={styles.galleryItemWrap}>
                        <div className={styles.titleWrap}>
                            <div className={styles.galleryTitle}>{elem.photo_theme_name}</div>
                            <div className={styles.date}>
                                {elem.photo_theme_date}. {elem.region}
                            </div>
                        </div>
                        <div className={styles.photosGallery}>
                            {elem.photos.map((photo, i) => {
                                return (
                                    <div
                                        onMouseEnter={() => setHoveredPhotoId(photo.id)}
                                        onMouseLeave={() => setHoveredPhotoId(null)}
                                        key={photo.id}
                                        className={ styles.imgWrap}
                                    >
                                        <img src={photo.photo_path} alt="" />
                                        <div className={styles.photoNumber}>Фото № {photo.number}</div>
                                        {hoveredPhotoId === photo.id && (
                                        <div
                                            className={styles.uploadIconBlock}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Предотвращаем всплытие клика
                                                handleDownloadSinglePhoto(
                                                    photo.photo_path,
                                                    `${elem.photo_theme_name}_${elem.photo_theme_date}_${photo.number}.jpg`
                                                );
                                            }}
                                        >
                                            <img className={styles.uploadIcon} src={uploadIcon} alt="Download" />
                                        </div>
                                    )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <div className={styles.btnWrap}>
                <button onClick={handleDownloadAllPhotos} className={styles.galleryBtn}>
                    Скачать все
                </button>
            </div>
        </>
    );
};

export default GalleryItem;
