/* eslint-disable jsx-a11y/aria-role */
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from '../Layout/Layout'
import { Orders } from '../Orders/Orders'
import { Gallery } from '../Gallery/Gallery'
import { Profile } from '../Profile/Profile'
import { AboutUs } from '../AboutUs/AboutUs'
import { Rules } from '../Rules/Rules'
import { Payment } from '../Payment/Payment'
import { Login } from '../Login/Login'
import { Registration } from '../Registration/Registration'
import { NotFound } from '../NotFound/NotFound'
import { AuthRoutes } from '../AuthRoutes/AuthRoutes'
import ResetPassword from '../Registration/ResetPassword/ResetPassword'
import NewPassword from '../Registration/NewPassword/NewPassword'
import Verification from '../Registration/Verificattion.jsx/Verification'
import { useAuth } from '../../utils/useAuth'
import Account from '../Account/Account'
import { useSelector } from 'react-redux'
import Cart from '../Cart/Cart'
import LayoutCrm from '../../components-crm/Layout-crm/Layout-crm'
import Kindergartens from '../../pages-crm/Kindergartens/Kindergartens'
import Calendar from '../../pages-crm/Calendar/Calendar'
import MainCrm from '../../pages-crm/KindergartensInfo/KindergartensInfo'
import KindergartensInfo from '../../pages-crm/KindergartensInfo/KindergartensInfo'
import Employees from '../../components-crm/Employees/Employees'
import CreateEmployee from '../../components-crm/CreateEmployee/CreateEmployee'
import EditEmployee from '../../components-crm/EditEmployee/EditEmployee'
import Tasks from '../../pages-crm/Tasks/Tasks'
import { LoginCrm } from '../../pages-crm/LoginCrm/LoginCrm'

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  useEffect(() => {
    // Перенаправляем неавторизованных пользователей с любых CRM-маршрутов на /crm/sign-in
    if (!isAuth && location.pathname.startsWith('/crm') && location.pathname !== '/crm/sign-in') {
      navigate('/crm/sign-in');
    }
  }, [isAuth, location.pathname, navigate]);

  const CRMProtectedRoute = ({ children }) => {
    // Компонент для защиты маршрутов CRM
    if (!isAuth) {
      return <Navigate to="/crm/sign-in" />;
    }
    return children;
  };

  // Проверка поддержки CSS Grid
if ('CSS' in window && CSS.supports('display', 'grid')) {
  alert('Поддержка CSS Grid: поддерживается');
} else {
  alert('Поддержка CSS Grid: НЕ поддерживается');
}

// Проверка координат элемента
// Создаем тестовый элемент
const testElement = document.createElement('div');
testElement.id = 'test';
testElement.style.cssText = 'width: 100px; height: 50px; background: lightblue; position: absolute; top: 50px; left: 100px;';
document.body.appendChild(testElement);

// Пытаемся получить координаты
const rect = document.querySelector('#test')?.getBoundingClientRect();
if (rect) {
  alert(`Координаты элемента: 
  Лево: ${rect.left}, 
  Верх: ${rect.top}, 
  Ширина: ${rect.width}, 
  Высота: ${rect.height}`);
} else {
  alert('Элемент не найден или координаты недоступны.');
}

// Удаляем тестовый элемент через 3 секунды
setTimeout(() => {
  testElement.remove();
  alert('Тестовый элемент удален.');
}, 3000);


  return (
    <Routes>

      <Route element={<AuthRoutes />}>
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Registration />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/password-reset" element={<ResetPassword />} />
        <Route path="/password-reset/new-password" element={<NewPassword />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/about-us" />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/rules" element={<Rules />} />
        {isAuth ? (
          <>
            <Route path="/orders" element={<Account role="parent" />} />
            <Route path="/profile" element={<Profile role="parent" />} />
            <Route path="/cart/:id" element={<Cart />} />
            <Route path="/orders/payment" element={<Payment />} />
          </>
        ) : (
          <>
            <Route element={<AuthRoutes />}>
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<Registration />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/password-reset" element={<ResetPassword />} />
              <Route path="/password-reset/new-password" element={<NewPassword />} />
            </Route>
          </>
        )}
        <Route path="/*" element={<NotFound />} />
      </Route>

      {/* Переадресация с /crm на /crm/sign-in */}
      <Route path="/crm" element={<Navigate to="/crm/sign-in" />} />

      {/* Страница авторизации CRM */}
      <Route path="/crm/sign-in" element={<LoginCrm />} />

      {/* Защищенные маршруты CRM */}
      <Route
        element={
          <CRMProtectedRoute>
            <LayoutCrm />
          </CRMProtectedRoute>
        }
      >
        <Route path="/crm/kindergartens" element={<Kindergartens />} />
        <Route path="/crm/kindergartens/:id" element={<KindergartensInfo />} />
        <Route path="/crm/calendar" element={<Calendar />} />
        <Route path="/crm/employees" element={<Employees />} />
        <Route path="/crm/employees/create" element={<CreateEmployee />} />
        <Route path="/crm/employees/edit/:employeeId" element={<EditEmployee />} />
        <Route path="/crm/tasks" element={<Tasks />} />
        <Route path="/*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

