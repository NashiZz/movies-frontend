import { Outlet } from "react-router";
import Footer from "./Header/Footer";
import Header from "./Header/Header";

const Root_Page = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default Root_Page;
