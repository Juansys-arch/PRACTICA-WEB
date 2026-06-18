"use strict";
import React, { useState, useEffect } from 'react';
import { getMateriales, crearMaterial, registrarMovimiento, getMovimientos } from '@services/inventario.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import '@styles/inventario.css';

export default function Inventario() {
    const [materiales, setMateriales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('materiales');
    const [movimientos, setMovimientos] = useState([]);

    const [showModalMaterial, setShowModalMaterial] = useState(false);
    const [showModalMovimiento, setShowModalMovimiento] = useState(false);

    const [nuevoMaterial, setNuevoMaterial] = useState({
        nombre: '', descripcion: '', unidadMedida: '', stockMinimo: 0
    });

    const [nuevoMovimiento, setNuevoMovimiento] = useState({
        materialId: '', tipo: 'entrada', cantidad: 1, observacion: '',
        newMaterialNombre: '', newMaterialUnidad: '', newMaterialDescripcion: ''
    });

    useEffect(() => {
        const cargar = async () => {
            const data = await getMateriales();
            if (Array.isArray(data)) setMateriales(data);
            else showErrorAlert('Error', 'No se pudieron cargar los materiales.');
            setLoading(false);
        };
        cargar();
    }, []);

    const refrescarTabla = async () => {
        const data = await getMateriales();
        if (Array.isArray(data)) setMateriales(data);
    };

    const handleOpenMovimientos = async () => {
        setActiveTab('movimientos');
        if (movimientos.length === 0) {
            const data = await getMovimientos();
            if (Array.isArray(data)) setMovimientos(data);
        }
    };

    const handleSubmitMaterial = async (e) => {
        e.preventDefault();
        const response = await crearMaterial(nuevoMaterial);
        if (response.status === 'Success' || response.id) {
            showSuccessAlert('¡Creado!', 'El material ha sido registrado correctamente.');
            setShowModalMaterial(false);
            setNuevoMaterial({ nombre: '', descripcion: '', unidadMedida: '', stockMinimo: 0 });
            refrescarTabla();
        } else {
            showErrorAlert('Error', response.message || 'No se pudo crear el material.');
        }
    };

    const handleSubmitMovimiento = async (e) => {
        e.preventDefault();
        let payload;
        if (nuevoMovimiento.materialId && nuevoMovimiento.materialId !== 'new') {
            payload = {
                materialId: parseInt(nuevoMovimiento.materialId),
                tipo: nuevoMovimiento.tipo,
                cantidad: parseInt(nuevoMovimiento.cantidad),
                observacion: nuevoMovimiento.observacion || null,
            };
        } else if (nuevoMovimiento.materialId === 'new') {
            payload = {
                materialNombre: nuevoMovimiento.newMaterialNombre,
                unidadMedida: nuevoMovimiento.newMaterialUnidad || 'unid.',
                descripcion: nuevoMovimiento.newMaterialDescripcion || null,
                tipo: nuevoMovimiento.tipo,
                cantidad: parseInt(nuevoMovimiento.cantidad),
                observacion: nuevoMovimiento.observacion || null,
            };
        } else {
            showErrorAlert('Error', 'Seleccione o ingrese un material');
            return;
        }

        const response = await registrarMovimiento(payload);
        if (response.status === 'Success' || response.id) {
            showSuccessAlert('Éxito', 'El movimiento de stock fue registrado.');
            setShowModalMovimiento(false);
            setNuevoMovimiento({ materialId: '', tipo: 'entrada', cantidad: 1, observacion: '', newMaterialNombre: '', newMaterialUnidad: '', newMaterialDescripcion: '' });
            refrescarTabla();
        } else {
            showErrorAlert('Error', response.message || 'Verifique el stock disponible.');
        }
    };

    if (loading) return <div className="loading-container">⏳ Cargando inventario...</div>;

    return (
        <div className="inventario-page">
            {/* Header */}
            <div className="header-section">
                <div>
                    <h1>📋 Inventario del Laboratorio</h1>
                    <p>Gestión de equipos y materiales disponibles.</p>
                </div>
                <div className="action-buttons">
                    <button
                        id="btn-nuevo-material"
                        className={`btn-primary-inv ${activeTab === 'materiales' ? '' : ''}`}
                        onClick={() => setActiveTab('materiales')}
                    >
                        📦 Ver Materiales
                    </button>
                    <button
                        id="btn-historial"
                        className="btn-secondary-inv"
                        onClick={handleOpenMovimientos}
                    >
                        🧾 Historial
                    </button>
                    <button
                        id="btn-registrar-movimiento"
                        className="btn-success-inv"
                        onClick={() => setShowModalMovimiento(true)}
                    >
                        ⇅ Entrada / Salida
                    </button>
                    <button
                        id="btn-crear-material"
                        className="btn-primary-inv"
                        onClick={() => setShowModalMaterial(true)}
                    >
                        + Nuevo Material
                    </button>
                </div>
            </div>

            {/* Tabla Materiales */}
            {activeTab === 'materiales' && (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Stock Actual</th>
                                <th>Mínimo</th>
                                <th>Unidad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiales.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center" style={{ padding: '32px', color: 'var(--text-muted)' }}>
                                        Sin materiales registrados.
                                    </td>
                                </tr>
                            ) : materiales.map((m) => {
                                const stockBajo = m.stockActual <= m.stockMinimo;
                                return (
                                    <tr key={m.id} className={stockBajo ? 'row-alert-stock' : ''}>
                                        <td><strong>{m.nombre}</strong></td>
                                        <td>{m.descripcion || '—'}</td>
                                        <td className="stock-number">{m.stockActual}</td>
                                        <td>{m.stockMinimo}</td>
                                        <td><span className="badge-unit">{m.unidadMedida}</span></td>
                                        <td>
                                            <span className={`status-badge ${stockBajo ? 'critico' : 'ok'}`}>
                                                {stockBajo ? 'Crítico' : 'Óptimo'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Historial de Movimientos */}
            {activeTab === 'movimientos' && (
                <div className="table-container">
                    <div className="header-section movimientos-header" style={{ padding: '16px 16px 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: 0 }}>
                        <div>
                            <h1 style={{ fontSize: '1rem' }}>🧾 Historial de Movimientos</h1>
                            <p>Entradas, salidas y responsable de cada cambio.</p>
                        </div>
                    </div>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Material</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Realizado por</th>
                                <th>Observación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center" style={{ padding: '32px', color: 'var(--text-muted)' }}>
                                        No hay movimientos registrados.
                                    </td>
                                </tr>
                            ) : movimientos.map((mov) => (
                                <tr key={mov.id}>
                                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(mov.fecha || mov.createdAt).toLocaleString()}</td>
                                    <td><strong>{mov.material?.nombre || '—'}</strong></td>
                                    <td>
                                        <span className={`status-badge ${mov.tipo === 'entrada' ? 'ok' : 'critico'}`}>
                                            {mov.tipo === 'entrada' ? '▲ Entrada' : '▼ Salida'}
                                        </span>
                                    </td>
                                    <td>{mov.cantidad}</td>
                                    <td style={{ fontSize: '0.82rem' }}>{mov.responsable?.nombreCompleto || mov.responsable?.email || '—'}</td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{mov.observacion || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL: Nuevo Material */}
            {showModalMaterial && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>+ Registrar Nuevo Material</h2>
                        <form onSubmit={handleSubmitMaterial}>
                            <label>Nombre del Material *</label>
                            <input
                                id="input-mat-nombre"
                                type="text"
                                required
                                placeholder="Ej: Laptop HP, Multímetro, Cable HDMI..."
                                value={nuevoMaterial.nombre}
                                onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, nombre: e.target.value })}
                            />
                            <label>Descripción</label>
                            <textarea
                                id="input-mat-desc"
                                placeholder="Características, modelo, color..."
                                value={nuevoMaterial.descripcion}
                                onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, descripcion: e.target.value })}
                            />
                            <div className="form-row">
                                <div>
                                    <label>Unidad de Medida *</label>
                                    <input
                                        id="input-mat-unidad"
                                        type="text"
                                        required
                                        placeholder="unid., pares, m..."
                                        value={nuevoMaterial.unidadMedida}
                                        onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, unidadMedida: e.target.value })}
                                    />
                                </div>
                                <div className="small">
                                    <label>Stock Mínimo</label>
                                    <input
                                        id="input-mat-stock"
                                        type="number"
                                        min="0"
                                        required
                                        value={nuevoMaterial.stockMinimo}
                                        onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, stockMinimo: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" id="btn-cancel-mat" className="btn-cancel" onClick={() => setShowModalMaterial(false)}>Cancelar</button>
                                <button type="submit" id="btn-save-mat" className="btn-submit">Guardar Material</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Registrar Movimiento */}
            {showModalMovimiento && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>⇅ Registrar Entrada / Salida</h2>
                        <form onSubmit={handleSubmitMovimiento}>
                            <label>Material *</label>
                            <select
                                id="input-mov-material"
                                required
                                value={nuevoMovimiento.materialId}
                                onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, materialId: e.target.value })}
                            >
                                <option value="">— Seleccionar material —</option>
                                <option value="new">+ Crear nuevo material</option>
                                {materiales.map(m => (
                                    <option key={m.id} value={m.id}>{m.nombre} (Stock: {m.stockActual} {m.unidadMedida})</option>
                                ))}
                            </select>

                            {nuevoMovimiento.materialId === 'new' && (
                                <>
                                    <label>Nombre del material</label>
                                    <input
                                        required
                                        type="text"
                                        id="input-new-mat-nombre"
                                        placeholder="Nombre del nuevo material"
                                        value={nuevoMovimiento.newMaterialNombre}
                                        onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, newMaterialNombre: e.target.value })}
                                    />
                                    <label>Descripción</label>
                                    <textarea
                                        id="input-new-mat-desc"
                                        value={nuevoMovimiento.newMaterialDescripcion}
                                        onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, newMaterialDescripcion: e.target.value })}
                                    />
                                    <label>Unidad de medida</label>
                                    <input
                                        required
                                        type="text"
                                        id="input-new-mat-unidad"
                                        placeholder="unid., Kg, m..."
                                        value={nuevoMovimiento.newMaterialUnidad}
                                        onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, newMaterialUnidad: e.target.value })}
                                    />
                                </>
                            )}

                            <label>Tipo de Movimiento *</label>
                            <select
                                id="input-mov-tipo"
                                value={nuevoMovimiento.tipo}
                                onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, tipo: e.target.value })}
                            >
                                <option value="entrada">▲ Entrada — Ingreso al laboratorio</option>
                                <option value="salida">▼ Salida — Retiro del laboratorio</option>
                            </select>

                            <label>Cantidad *</label>
                            <input
                                id="input-mov-cantidad"
                                type="number"
                                min="1"
                                required
                                value={nuevoMovimiento.cantidad}
                                onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, cantidad: e.target.value })}
                            />

                            <label>Observación</label>
                            <input
                                id="input-mov-obs"
                                type="text"
                                placeholder="Motivo del movimiento..."
                                value={nuevoMovimiento.observacion}
                                onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, observacion: e.target.value })}
                            />

                            <div className="modal-actions">
                                <button type="button" id="btn-cancel-mov" className="btn-cancel" onClick={() => setShowModalMovimiento(false)}>Cancelar</button>
                                <button type="submit" id="btn-save-mov" className="btn-submit">Procesar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}