import { Outlet } from "react-router";
import Header from "../header/Header";

function Layout() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout;