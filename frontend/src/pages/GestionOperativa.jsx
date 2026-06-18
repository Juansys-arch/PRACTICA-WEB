"use strict";
import React, { useState } from 'react';
import Inventario from '@pages/Inventario';
import Incidencias from '@pages/Incidencias';
import Prestamos from '@pages/Prestamos';
import Sustracciones from '@pages/Sustracciones';
import OrdenesReparacion from '@pages/OrdenesReparacion';
import '@styles/styles.css';
import '@styles/inventario.css';
import '@styles/incidencias.css';

// Tabs visibles según rol
const TABS_POR_ROL = {
  administrador:     ['inventario', 'incidencias', 'prestamos', 'sustracciones', 'reparaciones'],
  profesor_practica: ['prestamos', 'sustracciones', 'reparaciones'],
  reparador:         ['reparaciones'],
};

const ALL_TABS = [
  { key: 'inventario',    label: '📋 Inventario',      roles: ['administrador'] },
  { key: 'prestamos',     label: '📦 Préstamos',        roles: ['administrador','profesor_practica'] },
  { key: 'sustracciones', label: '🚨 Sustracciones',    roles: ['administrador','profesor_practica'] },
  { key: 'reparaciones',  label: '🔧 Reparaciones',     roles: ['administrador','profesor_practica','reparador'] },
  { key: 'incidencias',   label: '⚠️ Incidencias',      roles: ['administrador'] },
];

export default function GestionOperativa({ defaultTab }) {
  const usuario = (() => {
    try { return JSON.parse(sessionStorage.getItem('usuario')); }
    catch { return null; }
  })();

  const rol = usuario?.rol || 'profesor_practica';
  
  // Reordenar las pestañas según el rol
  const tabsOrdenadas = [...ALL_TABS].sort((a, b) => {
    const orden = TABS_POR_ROL[rol] || [];
    return orden.indexOf(a.key) - orden.indexOf(b.key);
  }).filter(t => t.roles.includes(rol));

  const primerTab = defaultTab || tabsOrdenadas[0]?.key || 'prestamos';
  const [activeTab, setActiveTab] = useState(primerTab);

  // Etiqueta amigable del rol
  const rolLabel = {
    administrador: 'Administrador',
    profesor_practica: 'Profesor de Práctica',
    reparador: 'Técnico Reparador',
  }[rol] || rol;

  return (
    <div className="gestion-operativa-page">
      <div className="gestion-header">
        <h1>Panel de Gestión del Laboratorio</h1>
        <p>
          Bienvenido{usuario?.nombreCompleto ? `, ${usuario.nombreCompleto}` : ''}.
          Rol: <strong>{rolLabel}</strong>
        </p>

        <div className="gestion-tab-bar">
          {tabsOrdenadas.map(tab => (
            <button
              key={tab.key}
              id={`tab-btn-${tab.key}`}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="gestion-content">
        {activeTab === 'inventario'    && <Inventario />}
        {activeTab === 'incidencias'   && <Incidencias />}
        {activeTab === 'prestamos'     && <Prestamos />}
        {activeTab === 'sustracciones' && <Sustracciones />}
        {activeTab === 'reparaciones'  && <OrdenesReparacion />}
      </div>
    </div>
  );
}
