import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "../Layout/Layout";
import { Orders } from "../Orders/Orders";
import { Gallery } from "../Gallery/Gallery";
import { Profile } from "../Profile/Profile";
import { AboutUs } from "../AboutUs/AboutUs";
import { Rules } from "../Rules/Rules";
import { Payment } from "../Payment/Payment";
import { Login } from "../Login/Login";
import { Registration } from "../Registration/Registration";
import { NotFound } from "../NotFound/NotFound";
import { AuthRoutes } from "../AuthRoutes/AuthRoutes";
import ResetPassword from "../Registration/ResetPassword/ResetPassword";
import NewPassword from "../Registration/NewPassword/NewPassword";
import Verification from "../Registration/Verificattion.jsx/Verification";
import { useAuth } from "../../utils/useAuth";
export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  useEffect(() => {
    // Перенаправляем на "/orders" при входе на сайт
    if (location.pathname === "/") {
      navigate("/orders");
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {isAuth ? <>
        <Route element={<Layout />}>
          <Route path={"/orders"} element={<Orders />} />
          <Route path={"/gallery"} element={<Gallery />} />
          <Route path={"/profile"} element={<Profile role={'parent'} />} />
          <Route path={"/about-us"} element={<AboutUs />} />
          <Route path={"/rules"} element={<Rules />} />
          <Route path={"orders/payment"} element={<Payment />} />
        </Route>
        <Route element={<AuthRoutes />}>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Registration />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/password-reset" element={<ResetPassword />} />
          <Route path="/password-reset/new-password" element={<NewPassword />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </> : <Route element={<AuthRoutes />}>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Registration />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/password-reset" element={<ResetPassword />} />
        <Route path="/password-reset/new-password" element={<NewPassword />} />
        <Route path="/*" element={<NotFound />} />
      </Route>}

    </Routes>
  );
};
