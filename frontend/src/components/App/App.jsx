import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../Header/Header";
import { SideBar } from "../SideBar/SideBar";
import { Orders } from "../Orders/Orders";
import { Gallery } from "../Gallery/Gallery";
import { Profile } from "../Profile/Profile";
import { AboutUs } from "../AboutUs/AboutUs";
import { Rules } from "../Rules/Rules";
import { Payment } from "../Payment/Payment";
import { Login } from "../Login/Login";
import { Registration } from "../Registration/Registration";
import { PasswordReset } from "../PasswordReset/PasswordReset";
import { NotFound } from "../NotFound/NotFound";
import { useState, useEffect } from "react";

export const App = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    // Проверяем начальное состояние при загрузке страницы
    handleResize();
    // Очищаем обработчик событий при размонтировании компонента
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Перенаправляем на "/orders" при входе на сайт
    if (location.pathname === "/") {
      navigate("/orders");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="body">
      <div className="page">
        <Routes>
          <Route
            path={"/orders"}
            element={
              <>
                <Header />
                {isSidebarVisible > 768 && <SideBar />}
                <Orders />
              </>
            }
          />
          <Route
            path={"/gallery"}
            element={
              <>
                <Header />
                {isSidebarVisible > 768 && <SideBar />}
                <Gallery />
              </>
            }
          />
          <Route
            path={"/profile"}
            element={
              <>
                <Header />
                {isSidebarVisible > 768 && <SideBar />}
                <Profile />
              </>
            }
          />
          <Route
            path={"/about-us"}
            element={
              <>
                <Header />
                {isSidebarVisible > 768 && <SideBar />}
                <AboutUs />
              </>
            }
          />
          <Route
            path={"/rules"}
            element={
              <>
                <Header />
                {isSidebarVisible > 768 && <SideBar />}
                <Rules />
              </>
            }
          />
          <Route
            path={"orders/payment"}
            element={
              <>
                <Header />
                {isSidebarVisible > 768 && <SideBar />}
                <Payment />
              </>
            }
          />
          <Route
            path={"/sign-in"}
            element={
              <>
                <Login />
              </>
            }
          />
          <Route
            path={"/sign-up"}
            element={
              <>
                <Registration />
              </>
            }
          />
          <Route
            path={"/password-reset"}
            element={
              <>
                <PasswordReset />
              </>
            }
          />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};
