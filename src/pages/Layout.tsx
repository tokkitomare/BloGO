import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Layout() {
  return (
    <div className="flex h-screen flex-col">
      <NavBar />

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}