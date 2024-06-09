import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Header } from "../Header/Header";
import { SideBar } from "../SideBar/SideBar";
import { useState, useEffect } from "react";

export const App = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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

  return (
    <div className="body">
      <div className="page">
        <Routes>
          <>
            <Route
              path={"/"}
              element={
                <>
                  <Header />
                  {isSidebarVisible > 768 && <SideBar />}
                </>
              }
            />
          </>
        </Routes>
      </div>
    </div>
  );
};
