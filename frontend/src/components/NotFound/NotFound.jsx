import styles from "./NotFound.module.css";
import { useAuth } from "../../utils/useAuth";

export const NotFound = () => {
  const {isAuth} = useAuth();
  console.log(isAuth);
  return (
    <div className={styles.notFoundWrap}>
      404
      <div className={styles.notFoundText}>Cтраница не найдена</div>  
    </div>
  );
};
