import { useSelector } from "react-redux";
import Orders from "../Orders/Orders";
import { Payment } from "../Payment/Payment";
import ManagerProfile from "../Profile/ManagerProfile/ManagerProfile";
import { useState } from "react";
const Account = () => {

    const [nurseryIsAuth, setNurseryIsAuth] = useState(false);
    const [isPayment, setIsPayment] = useState(false);
    const role = useSelector(state=> state.user.role);
    return (
        <>
            <div className={''}>
                {isPayment ? <Payment/> :
                    <div>
                        {role !== 1 ?  <ManagerProfile nurseryIsAuth={nurseryIsAuth} /> : <Orders />}
                    </div>
                }
            </div>
        </>
    );
}

export default Account;