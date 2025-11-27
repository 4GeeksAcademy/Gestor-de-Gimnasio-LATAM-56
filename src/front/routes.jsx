import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";

import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TrainingSelector from "./pages/TrainingSelector";
import Objetivos from "./pages/Objetivos";
import PerfilCorporal from "./pages/PerfilCorporal";
import Alimentacion from "./pages/Alimentacion";
import Contacto from "./pages/Contacto";
import { UserHome } from "./pages/UserHome";
import { Navigate } from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      <Route index element={<Home />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />

      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />

      <Route path="dashboard" element={<Dashboard />} />
      <Route path="training" element={<TrainingSelector />} />
      <Route path="objetivos" element={<Objetivos />} />
      <Route path="perfil-corporal" element={<PerfilCorporal />} />
      <Route path="alimentacion" element={<Alimentacion />} />
      <Route path="contacto" element={<Contacto />} />

      {/* Ruta protegida */}
      <Route
        path="userhome"
        element={
          localStorage.getItem("token")
            ? <UserHome />
            : <Navigate to="/login" />
        }
      />

    </Route>
  )
);
