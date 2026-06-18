import React, { useState, useEffect } from 'react';
import { getSustracciones, crearSustraccion, actualizarEstadoSustraccion } from '@services/sustraccion.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import '@styles/sustracciones.css';

const TIPOS = [
  { value: 'robo', label: '🚨 Robo' },
  { value: 'retiro_no_autorizado', label: '⚠️ Retiro No Autorizado' },
  { value: 'perdida', label: '🔍 Pérdida' },
];

const ESTADOS = [
  { value: 'reportado', label: 'Reportado' },
  { value: 'en_investigacion', label: 'En Investigación' },
  { value: 'resuelto', label: 'Resuelto' },
];

const tipoLabel = (t) => ({ robo: '🚨 Robo', retiro_no_autorizado: '⚠️ No Autorizado', perdida: '🔍 Pérdida' })[t] || t;
const tipoClass = (t) => `badge-tipo-sustraccion tipo-${t}`;
const estadoClass = (e) => `badge-estado-sustraccion est-${e}`;

export default function Sustracciones() {
  const [sustracciones, setSustracciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    equipoNombre: '',
    descripcion: '',
    tipo: 'robo',
    fechaSuceso: new Date().toISOString().split('T')[0],
    ubicacionUltima: '',
    observacion: '',
  });

  const cargar = async () => {
    const data = await getSustracciones();
    if (Array.isArray(data)) setSustracciones(data);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      fechaSuceso: new Date(form.fechaSuceso).toISOString(),
    };
    const res = await crearSustraccion(payload);
    if (res?.status === 'Success') {
      showSuccessAlert('Sustracción registrada', 'Se notificó al administrador automáticamente.');
      setShowModal(false);
      resetForm();
      cargar();
    } else {
      showErrorAlert('Error', res?.message || 'No se pudo registrar la sustracción.');
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const res = await actualizarEstadoSustraccion(id, nuevoEstado);
    if (res?.status === 'Success') {
      showSuccessAlert('Estado actualizado', `Sustracción marcada como "${nuevoEstado}".`);
      cargar();
    } else {
      showErrorAlert('Error', res?.message || 'No se pudo actualizar el estado.');
    }
  };

  const resetForm = () => {
    setForm({ equipoNombre: '', descripcion: '', tipo: 'robo', fechaSuceso: new Date().toISOString().split('T')[0], ubicacionUltima: '', observacion: '' });
  };

  if (loading) return <div className="loading-container">⏳ Cargando sustracciones...</div>;

  return (
    <div className="sustracciones-page">
      <div className="sustracciones-header">
        <h1>🚨 Registro de Sustracciones</h1>
        <button id="btn-nueva-sustraccion" className="btn btn-warning" onClick={() => setShowModal(true)}>
          + Reportar Sustracción
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Fecha del Suceso</th>
              <th>Última Ubicación</th>
              <th>Estado</th>
              <th>Reportado Por</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sustracciones.length === 0 ? (
              <tr><td colSpan="9" className="text-center" style={{padding:'32px',color:'var(--text-muted)'}}>Sin sustracciones registradas.</td></tr>
            ) : sustracciones.map(s => (
              <tr key={s.id}>
                <td><strong>#{s.id}</strong></td>
                <td><strong>{s.equipoNombre}</strong></td>
                <td><span className={tipoClass(s.tipo)}>{tipoLabel(s.tipo)}</span></td>
                <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.descripcion}</td>
                <td style={{whiteSpace:'nowrap'}}>{new Date(s.fechaSuceso).toLocaleDateString()}</td>
                <td style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{s.ubicacionUltima || '—'}</td>
                <td><span className={estadoClass(s.estado)}>{s.estado.replace('_',' ')}</span></td>
                <td style={{fontSize:'0.82rem'}}>{s.reportadoPor?.nombreCompleto || '—'}</td>
                <td>
                  <div className="actions-cell">
                    {s.estado === 'reportado' && (
                      <button id={`btn-inv-${s.id}`} className="btn-investigar"
                        onClick={() => handleCambiarEstado(s.id, 'en_investigacion')}>
                        🔍 Investigar
                      </button>
                    )}
                    {s.estado === 'en_investigacion' && (
                      <button id={`btn-res-${s.id}`} className="btn-resolver"
                        onClick={() => handleCambiarEstado(s.id, 'resuelto')}>
                        ✓ Resolver
                      </button>
                    )}
                    {s.estado === 'resuelto' && <span style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Cerrado</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2>🚨 Reportar Sustracción</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-grid-2">
                <div className="form-group">
                  <label>Nombre del Equipo *</label>
                  <input id="input-eq-nombre" className="form-control" required placeholder="Laptop, proyector, etc."
                    value={form.equipoNombre} onChange={e => setForm({...form, equipoNombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tipo de Sustracción *</label>
                  <select id="input-tipo-sust" className="form-control" value={form.tipo}
                    onChange={e => setForm({...form, tipo: e.target.value})}>
                    {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha del Suceso *</label>
                  <input id="input-fecha-sust" type="date" className="form-control" required
                    value={form.fechaSuceso} onChange={e => setForm({...form, fechaSuceso: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Última Ubicación Conocida</label>
                  <input id="input-ubicacion" className="form-control" placeholder="Sala 3, Lab A, etc."
                    value={form.ubicacionUltima} onChange={e => setForm({...form, ubicacionUltima: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Descripción del Incidente *</label>
                  <textarea id="input-desc-sust" className="form-control" rows={3} required placeholder="Describe cómo ocurrió el suceso..."
                    value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Observaciones adicionales</label>
                  <textarea id="input-obs-sust" className="form-control" rows={2} placeholder="Testigos, detalles extra..."
                    value={form.observacion} onChange={e => setForm({...form, observacion: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" id="btn-cancel-sust" className="btn-cancel" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
                <button type="submit" id="btn-submit-sust" className="btn btn-danger">🚨 Registrar Sustracción</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
