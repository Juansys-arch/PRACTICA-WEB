import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import GestionOperativa from '@pages/GestionOperativa';

import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

const ROLES_PRACTICA = ['administrador', 'profesor_practica'];
const ROLES_REPARADOR = ['administrador', 'profesor_practica', 'reparador'];
const ROLES_ADMIN = ['administrador'];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={ROLES_ADMIN}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/gestion-operativa',
        element: (
          <ProtectedRoute allowedRoles={ROLES_REPARADOR}>
            <GestionOperativa />
          </ProtectedRoute>
        ),
      },
      // Alias de rutas para compatibilidad
      {
        path: '/prestamos',
        element: (
          <ProtectedRoute allowedRoles={ROLES_PRACTICA}>
            <GestionOperativa defaultTab="prestamos" />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reparaciones',
        element: (
          <ProtectedRoute allowedRoles={ROLES_REPARADOR}>
            <GestionOperativa defaultTab="reparaciones" />
          </ProtectedRoute>
        ),
      },
    ]
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)