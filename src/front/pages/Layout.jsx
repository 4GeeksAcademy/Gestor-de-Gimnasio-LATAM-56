import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { UserNavbar } from "../components/UserNavbar";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Layout = () => {
    const { store } = useGlobalReducer();
    const token = store.token || localStorage.getItem("token");

    return (
        <ScrollToTop>
            {token ? <UserNavbar /> : <Navbar />}
            <Outlet />
            <Footer />
        </ScrollToTop>
    );
};
