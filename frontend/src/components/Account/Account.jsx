import Orders from "../Orders/Orders";
import { Payment } from "../Payment/Payment";
import ManagerProfile from "../Profile/ManagerProfile/ManagerProfile";
import { useState } from "react";
const Account = ({role}) => {

    const [nurseryIsAuth, setNurseryIsAuth] = useState(false);
    const [isPayment, setIsPayment] = useState(true);
    return (
        <>
            <div className={''}>
                {isPayment ? <Payment/> :
                    <div>
                        {role === 'manager' ?  <ManagerProfile nurseryIsAuth={nurseryIsAuth} /> : <Orders />}
                    </div>
                }
            </div>
        </>
    );
}

export default Account;