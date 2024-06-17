import { useState, useEffect } from "react";
import { Header } from "../Header/Header";
import { SideBar } from "../SideBar/SideBar";

export const Layout = ({ children }) => {
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
        <Header />
        {isSidebarVisible > 768 && <SideBar />}
        {children}
      </div>
    </div>
  );
};
