import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // для рендеринга вложенных маршрутов
import { Header } from "../Header/Header";
import { SideBar } from "../SideBar/SideBar";

export const Layout = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth);
      setInnerHeight(window.innerHeight)
    };

    window.addEventListener("resize", handleResize);
    // Проверяем начальное состояние при загрузке страницы
    handleResize();
    // Очищаем обработчик событий при размонтировании компонента
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    const handleScroll = () => {
        setScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
  return (
    <div  className="body">
      <div className="page">
        <Header />
        {isSidebarVisible > 768 && <SideBar scrollY={scrollY} innerHeight={innerHeight}/>}
        <Outlet />
      </div>
    </div>
  );
};
