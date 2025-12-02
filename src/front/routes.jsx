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
import PrivateRoute from "./components/PrivateRoute";
import AboutUs from "./pages/AboutUs";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* Rutas públicas */}
      <Route index element={<Home />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="aboutus" element={<AboutUs />} />

      {/* Rutas protegidas - requieren autenticación */}
      <Route
        path="userhome"
        element={
          <PrivateRoute>
            <UserHome />
          </PrivateRoute>
        }
      />

      <Route
        path="dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="training"
        element={
          <PrivateRoute>
            <TrainingSelector />
          </PrivateRoute>
        }
      />

      <Route
        path="objetivos"
        element={
          <PrivateRoute>
            <Objetivos />
          </PrivateRoute>
        }
      />

      <Route
        path="perfil-corporal"
        element={
          <PrivateRoute>
            <PerfilCorporal />
          </PrivateRoute>
        }
      />

      <Route
        path="alimentacion"
        element={
          <PrivateRoute>
            <Alimentacion />
          </PrivateRoute>
        }
      />

      <Route
        path="contacto"
        element={
          <PrivateRoute>
            <Contacto />
          </PrivateRoute>
        }
      />

    </Route>
  )
);