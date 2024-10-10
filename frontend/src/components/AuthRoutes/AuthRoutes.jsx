import { Outlet } from "react-router-dom";
 // для рендеринга вложенных маршрутов
export const AuthRoutes = () => {
  return (
    <div className="body">
      <div className="page">
        <Outlet />
      </div>
    </div>
  );
};
