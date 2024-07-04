import styles from "./NotFound.module.css";
import { useAuth } from "../../utils/useAuth";
export const NotFound = () => {
  const {isAuth} = useAuth();
  console.log(isAuth);
  return (
    <>
      <p>404</p>
    </>
  );
};
