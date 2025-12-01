import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { UserNavbar } from "../components/UserNavbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    const location = useLocation();
    const token = localStorage.getItem("token");

    // Rutas donde NO mostrar navbar
    const noNavbarRoutes = ["/login", "/register"];
    const showNavbar = !noNavbarRoutes.includes(location.pathname);

    return (
        <div>
            <ScrollToTop location={location}>
                {showNavbar && (token ? <UserNavbar /> : <Navbar />)}

                <Outlet />

                <Footer />
            </ScrollToTop>
        </div>
    );
};