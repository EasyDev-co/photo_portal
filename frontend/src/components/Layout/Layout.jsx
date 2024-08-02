import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // для рендеринга вложенных маршрутов
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
  const [scrollY, setScrollY] = useState(0);

    const handleScroll = () => {
        setScrollY(window.scrollY);
    };

    useEffect(() => {
        // Добавление обработчика события прокрутки
        window.addEventListener('scroll', handleScroll);

        // Удаление обработчика события при размонтировании компонента
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    console.log(scrollY)
  return (
    <div  className="body">
      <div className="page">
        <Header />
        {isSidebarVisible > 768 && <SideBar scrollY={scrollY}/>}
        <Outlet />
      </div>
    </div>
  );
};
