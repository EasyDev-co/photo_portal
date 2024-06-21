import ManagerProfile from "./ManagerProfile/ManagerProfile";
import ParentProfile from "./ParentProfile/ParentProfile";
import styles from "./Profile.module.css";
import { Title } from "../Title/Title";
import { useState } from "react";
export const Profile = ({ role }) => {
  const [nurseryIsAuth, setNurseryIsAuth] = useState(false)
  return <>
    <div className={styles.profileWrap}>
   
      {role === 'manager' ? <ManagerProfile /> : <ParentProfile nurseryIsAuth={nurseryIsAuth}/>}
    </div>

  </>;
};
