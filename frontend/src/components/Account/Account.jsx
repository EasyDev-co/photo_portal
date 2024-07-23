import Orders from "../Orders/Orders";
import ManagerProfile from "../Profile/ManagerProfile/ManagerProfile";
import { useState } from "react";
const Account = ({role}) => {

    const [nurseryIsAuth, setNurseryIsAuth] = useState(false)
    return (
        <>
            <div className={''}>

                {role === 'manager' ?  <ManagerProfile nurseryIsAuth={nurseryIsAuth} /> : <Orders />}
            </div>

        </>
    );
}

export default Account;