import styles from "./Gallery.module.css";
import GalleryItem from "./GalleryItem";
export const Gallery = () => {
  const accessStor = localStorage.getItem('access');
  return <>
    <div className={styles.ordersWrap}>
      <GalleryItem/>
    </div>
  </>;
};
