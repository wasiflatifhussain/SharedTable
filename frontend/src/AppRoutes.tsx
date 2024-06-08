import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ManageRestaurantPage from "./pages/ManageRestaurantPage";
import background from "../src/assets/hero15.png";
import background3 from "../src/assets/hero21.png";
import background4 from "../src/assets/back4.png";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import DonateSupportPage from "./pages/DonateSupportPage";
import AddAdvertisements from "./pages/AddAdvertisements";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout showHero><HomePage /></Layout>}/>
            <Route path="/auth-callback" element={<AuthCallbackPage />} />
            <Route path="/search/:area" element={<Layout showHero={false}><SearchPage /></Layout>} />
            <Route path="/detail/:restaurantId" element={<Layout showHero={false}><DetailPage /></Layout>} />
            <Route path="/donate-support" element={<Layout bgImage={background4}><DonateSupportPage /></Layout>}/>
            <Route path="/advertisements" element={<Layout bgImage={background4}><AddAdvertisements /></Layout>}/>
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