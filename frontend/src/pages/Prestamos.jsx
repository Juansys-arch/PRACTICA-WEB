import React, { useState, useEffect } from 'react';
import { getPrestamos, crearPrestamo, devolverPrestamo } from '@services/prestamo.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import '@styles/prestamos.css';

const estadoLabel = (e) => {
  const m = { prestado: 'Prestado', devuelto: 'Devuelto', vencido: 'Vencido' };
  return m[e] || e;
};

const estadoClass = (e) => {
  const m = { prestado: 'estado-prestado', devuelto: 'estado-devuelto', vencido: 'estado-vencido' };
  return `badge-estado-prestamo ${m[e] || ''}`;
};

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [devObs, setDevObs] = useState('');
  const [form, setForm] = useState({
    equipoNombre: '',
    descripcionEquipo: '',
    estudianteNombre: '',
    estudianteRut: '',
    fechaDevolucionEstimada: '',
    observacion: '',
  });

  const cargar = async () => {
    const data = await getPrestamos();
    if (Array.isArray(data)) setPrestamos(data);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.fechaDevolucionEstimada) delete payload.fechaDevolucionEstimada;
    const res = await crearPrestamo(payload);
    if (res?.status === 'Success') {
      showSuccessAlert('Préstamo registrado', 'El préstamo fue guardado exitosamente.');
      setShowModal(false);
      resetForm();
      cargar();
    } else {
      showErrorAlert('Error', res?.message || 'No se pudo registrar el préstamo.');
    }
  };

  const handleDevolver = async () => {
    const res = await devolverPrestamo(selectedId, { observacion: devObs || undefined });
    if (res?.status === 'Success') {
      showSuccessAlert('Devolución registrada', 'El equipo fue marcado como devuelto.');
      setShowDevModal(false);
      setDevObs('');
      cargar();
    } else {
      showErrorAlert('Error', res?.message || 'No se pudo registrar la devolución.');
    }
  };

  const resetForm = () => {
    setForm({ equipoNombre: '', descripcionEquipo: '', estudianteNombre: '', estudianteRut: '', fechaDevolucionEstimada: '', observacion: '' });
  };

  const stats = {
    total: prestamos.length,
    activos: prestamos.filter(p => p.estado === 'prestado').length,
    devueltos: prestamos.filter(p => p.estado === 'devuelto').length,
    vencidos: prestamos.filter(p => p.estado === 'vencido').length,
  };

  if (loading) return <div className="loading-container">⏳ Cargando préstamos...</div>;

  return (
    <div className="prestamos-page">
      <div className="prestamos-header">
        <h1>📦 Registro de Préstamos</h1>
        <button className="btn btn-primary" id="btn-nuevo-prestamo" onClick={() => setShowModal(true)}>
          + Nuevo Préstamo
        </button>
      </div>

      {/* Stats */}
      <div className="prestamos-stats">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card stat-active">
          <span className="stat-label">Activos</span>
          <span className="stat-value">{stats.activos}</span>
        </div>
        <div className="stat-card stat-returned">
          <span className="stat-label">Devueltos</span>
          <span className="stat-value">{stats.devueltos}</span>
        </div>
        <div className="stat-card stat-overdue">
          <span className="stat-label">Vencidos</span>
          <span className="stat-value">{stats.vencidos}</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>Estudiante</th>
              <th>RUT</th>
              <th>F. Préstamo</th>
              <th>F. Devolución Est.</th>
              <th>Estado</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.length === 0 ? (
              <tr><td colSpan="9" className="text-center" style={{padding:'32px',color:'var(--text-muted)'}}>Sin préstamos registrados.</td></tr>
            ) : prestamos.map(p => (
              <tr key={p.id}>
                <td><strong>#{p.id}</strong></td>
                <td><strong>{p.equipoNombre}</strong></td>
                <td>{p.estudianteNombre}</td>
                <td style={{fontSize:'0.82rem', color:'var(--text-muted)'}}>{p.estudianteRut}</td>
                <td style={{whiteSpace:'nowrap'}}>{new Date(p.fechaPrestamo).toLocaleDateString()}</td>
                <td style={{whiteSpace:'nowrap'}}>
                  {p.fechaDevolucionEstimada
                    ? new Date(p.fechaDevolucionEstimada).toLocaleDateString()
                    : <span style={{color:'var(--text-muted)'}}>—</span>}
                </td>
                <td><span className={estadoClass(p.estado)}>{estadoLabel(p.estado)}</span></td>
                <td style={{fontSize:'0.82rem'}}>{p.responsable?.nombreCompleto || '—'}</td>
                <td>
                  {p.estado === 'prestado' && (
                    <button id={`btn-devolver-${p.id}`} className="btn-devolver"
                      onClick={() => { setSelectedId(p.id); setShowDevModal(true); }}>
                      ✓ Devolver
                    </button>
                  )}
                  {p.estado !== 'prestado' && <span style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal nuevo préstamo */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2>📦 Registrar Nuevo Préstamo</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-grid-2">
                <div className="form-group">
                  <label>Nombre del Equipo *</label>
                  <input id="input-equipo-nombre" className="form-control" required placeholder="Ej: Laptop HP Probook"
                    value={form.equipoNombre} onChange={e => setForm({...form, equipoNombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Descripción del Equipo</label>
                  <input id="input-desc-equipo" className="form-control" placeholder="Serie, color, etc."
                    value={form.descripcionEquipo} onChange={e => setForm({...form, descripcionEquipo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Nombre del Estudiante *</label>
                  <input id="input-est-nombre" className="form-control" required placeholder="Nombre completo"
                    value={form.estudianteNombre} onChange={e => setForm({...form, estudianteNombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>RUT del Estudiante *</label>
                  <input id="input-est-rut" className="form-control" required placeholder="12.345.678-9"
                    value={form.estudianteRut} onChange={e => setForm({...form, estudianteRut: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Fecha de Devolución Estimada</label>
                  <input id="input-fecha-dev" type="date" className="form-control"
                    value={form.fechaDevolucionEstimada} onChange={e => setForm({...form, fechaDevolucionEstimada: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Observación</label>
                  <textarea id="input-obs-prestamo" className="form-control" rows={3} placeholder="Condición del equipo, notas..."
                    value={form.observacion} onChange={e => setForm({...form, observacion: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" id="btn-cancel-prestamo" className="btn-cancel" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
                <button type="submit" id="btn-submit-prestamo" className="btn btn-primary">Registrar Préstamo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal devolución */}
      {showDevModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{maxWidth: 420}}>
            <h2>✓ Confirmar Devolución</h2>
            <div className="form-group">
              <label>Observación de devolución (opcional)</label>
              <textarea id="input-obs-devolucion" className="form-control" rows={3}
                placeholder="Estado del equipo al devolver..."
                value={devObs} onChange={e => setDevObs(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button id="btn-cancel-devolucion" className="btn-cancel" onClick={() => { setShowDevModal(false); setDevObs(''); }}>Cancelar</button>
              <button id="btn-confirm-devolucion" className="btn btn-success" onClick={handleDevolver}>Confirmar Devolución</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
