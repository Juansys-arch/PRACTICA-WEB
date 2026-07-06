import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import NotificacionesDropdown from './Notificaciones.jsx';
import '@styles/navbar.css';
import { useState, useEffect } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Guardar estado del sidebar en localStorage
        localStorage.setItem('sidebarOpen', sidebarOpen);
        // Actualizar atributo en el documento
        document.documentElement.setAttribute('data-sidebar-open', sidebarOpen);
    }, [sidebarOpen]);

    useEffect(() => {
        // Cargar estado del sidebar al montar el componente
        const saved = localStorage.getItem('sidebarOpen');
        if (saved !== null) {
            setSidebarOpen(saved === 'true');
        }
    }, []);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Obtener iniciales del usuario
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <nav className={`navbar-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            {/* Toggle Button */}
            <button 
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? 'Ocultar sidebar' : 'Mostrar sidebar'}
            >
                <span className="toggle-icon">{sidebarOpen ? '◀' : '▶'}</span>
            </button>

            {/* Profile Section */}
            <div className="sidebar-profile">
                <div 
                    className="profile-avatar-large"
                    title={user?.nombreCompleto || 'Usuario'}
                >
                    {getInitials(user?.nombreCompleto)}
                </div>
                <h3 className="profile-name-full">{user?.nombreCompleto}</h3>
                <p className="profile-role">
                    {user?.rol === 'profesor_practica' ? 'Profesor de Práctica' : user?.rol?.charAt(0).toUpperCase() + user?.rol?.slice(1)}
                </p>
            </div>

            {/* Navigation Menu */}
            <div className="sidebar-menu">
                <ul className="nav-list">
                    <li>
                        <NavLink 
                            to="/home" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            <span className="nav-icon">🏠</span>
                            <span className="nav-label">Inicio</span>
                        </NavLink>
                    </li>

                    {(userRole === 'administrador' || userRole === 'coordinador') && (
                    <li>
                        <NavLink 
                            to="/users" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            <span className="nav-icon">👥</span>
                            <span className="nav-label">Usuarios</span>
                        </NavLink>
                    </li>
                    )}

                    {(userRole === 'administrador' || userRole === 'profesor_practica' || userRole === 'reparador') && (
                    <li>
                        <NavLink 
                            to="/gestion-operativa" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            <span className="nav-icon">⚙️</span>
                            <span className="nav-label">Gestión operativa</span>
                        </NavLink>
                    </li>
                    )}

                    <li>
                        <div className="nav-notifications">
                            <span className="nav-icon">🔔</span>
                            <span className="nav-label">Notificaciones</span>
                            <NotificacionesDropdown userRole={userRole} />
                        </div>
                    </li>
                </ul>
            </div>

            {/* Logout Section */}
            <div className="sidebar-footer">
                <NavLink 
                    to="/auth" 
                    onClick={logoutSubmit}
                    className="logout-btn"
                >
                    <span className="nav-icon">🚪</span>
                    <span className="nav-label">Cerrar sesión</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;