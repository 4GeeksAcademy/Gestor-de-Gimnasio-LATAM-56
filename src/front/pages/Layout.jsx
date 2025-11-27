import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { UserNavbar } from "../components/UserNavbar";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Layout = () => {
    const { store } = useGlobalReducer();

    const rawToken = store.token || localStorage.getItem("token");
    const token =
        rawToken &&
            rawToken !== "null" &&
            rawToken !== "undefined" &&
            rawToken !== ""
            ? rawToken
            : null;

    return (
        <ScrollToTop>

            {/* ⬇️ Aquí va lo que debes pegar */}
            {!token && (
                <div style={{ display: "block" }}>
                    <Navbar />
                </div>
            )}

            {token && <UserNavbar />}
            {/* ⬆️ Esta es la parte nueva */}

            <Outlet />
            <Footer />
        </ScrollToTop>
    );
};
