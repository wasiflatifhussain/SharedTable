import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ManageRestaurantPage from "./pages/ManageRestaurantPage";
import background from "../src/assets/hero15.png";
import background3 from "../src/assets/hero21.png";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import OrderStatusPage from "./pages/OrderStatusPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout showHero><HomePage /></Layout>}/>
            <Route path="/auth-callback" element={<AuthCallbackPage />} />
            <Route path="/search/:city" element={<Layout showHero={false}><SearchPage /></Layout>} />
            <Route path="/detail/:restaurantId" element={<Layout showHero={false}><DetailPage /></Layout>} />
            <Route element={<ProtectedRoute />}>
                <Route path="/order-status" element={<Layout bgImage={background3}><OrderStatusPage /></Layout>}/>
                <Route path="/user-profile" element={<Layout bgImage={background3}><UserProfilePage /></Layout>}/>
                <Route path="/manage-restaurant" element={<Layout bgImage={background}><ManageRestaurantPage /></Layout>}/>
            </Route>
            <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
    )
}

export default AppRoutes;