import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import ScrollToTopButton from "../Components/ScrollToTopButton";

export default function Layout() {
  return (
    <>
        <Navbar/>
        <Outlet/>
        <ScrollToTopButton/>
    </>
  )
}