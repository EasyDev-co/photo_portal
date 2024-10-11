/* eslint-disable jsx-a11y/aria-role */
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
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

export const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuth } = useAuth()
  const role = useSelector((state) => state.user.role)

  useEffect(() => {
    // Перенаправляем на "/orders" при входе на сайт
    if (location.pathname === '/') {
      navigate('/orders')
    }
    if (!isAuth) {
      if (location.pathname === '/') {
        navigate('/about-us')
      }
    }
  }, [location.pathname, navigate])

  return (
    <>
      <Routes>
        {isAuth && role !== 1 && (
          <Route element={<LayoutCrm />}>
            <Route path="/crm/kindergartens" element={<Kindergartens />} />
            <Route
              path="/crm/kindergartens/:id"
              element={<KindergartensInfo />}
            />
            <Route path="/crm/calendar" element={<Calendar />} />
            <Route path="/*" element={<>qwdqwdqwdqw</>} />
          </Route>
        )}
        {isAuth ? (
          <>
            <Route element={<Layout />}>
              <Route
                path={'/orders'}
                role={'manager'}
                element={<Account role={'parent'} />}
              />
              {role !== 1 && (
                <Route path={'/orders_manager'} element={<Orders />} />
              )}
              <Route path={'/profile'} element={<Profile role={'parent'} />} />
              <Route path={'/gallery'} element={<Gallery />} />
              <Route path={'/about-us'} element={<AboutUs />} />
              <Route path={'/rules'} element={<Rules />} />
              <Route path={'/cart/:id'} element={<Cart />} />
              <Route path={'orders/payment'} element={<Payment />} />
              <Route path="/*" element={<NotFound />} />
            </Route>
            <Route element={<AuthRoutes />}>
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<Registration />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/password-reset" element={<ResetPassword />} />
              <Route
                path="/password-reset/new-password"
                element={<NewPassword />}
              />
            </Route>
          </>
        ) : (
          <>
            <Route element={<Layout />}>
              <Route path={'/about-us'} element={<AboutUs />} />
              <Route path={'/rules'} element={<Rules />} />
              <Route path="/*" element={<NotFound />} />
            </Route>
            <Route element={<AuthRoutes />}>
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<Registration />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/password-reset" element={<ResetPassword />} />
              <Route
                path="/password-reset/new-password"
                element={<NewPassword />}
              />
            </Route>
          </>
        )}
      </Routes>
    </>
  )
}
