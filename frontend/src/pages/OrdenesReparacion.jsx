import React, { useState, useEffect } from 'react';
import { getOrdenesReparacion, crearOrdenReparacion, actualizarEstadoOrden } from '@services/orden_reparacion.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import '@styles/reparaciones.css';

const ESTADOS_ORDEN = [
  { value: 'enviado', label: '📤 Enviado' },
  { value: 'en_reparacion', label: '🔧 En Reparación' },
  { value: 'listo', label: '✅ Listo' },
  { value: 'devuelto', label: '📥 Devuelto' },
];

const FLUJO = { enviado: 'en_reparacion', en_reparacion: 'listo', listo: 'devuelto' };
const FLUJO_LABEL = { enviado: '▶ Iniciar Reparación', en_reparacion: '✅ Marcar Listo', listo: '📥 Registrar Devolución' };

const estadoClass = (e) => `badge-estado-rep rep-${e}`;
const estadoLabel = (e) => ({ enviado: '📤 Enviado', en_reparacion: '🔧 En Reparación', listo: '✅ Listo', devuelto: '📥 Devuelto' })[e] || e;

export default function OrdenesReparacion() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    equipoNombre: '',
    descripcionFalla: '',
    motivo: '',
    tallerNombre: '',
    tallerProfesorNombre: '',
    tallerContacto: '',
    fechaRetornoEstimada: '',
    costo: '',
    observacion: '',
  });

  const cargar = async () => {
    const data = await getOrdenesReparacion();
    if (Array.isArray(data)) setOrdenes(data);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.fechaRetornoEstimada) delete payload.fechaRetornoEstimada;
    if (!payload.costo) delete payload.costo;
    else payload.costo = parseFloat(payload.costo);
    const res = await crearOrdenReparacion(payload);
    if (res?.status === 'Success') {
      showSuccessAlert('Orden creada', 'La orden de reparación fue registrada exitosamente.');
      setShowModal(false);
      resetForm();
      cargar();
    } else {
      showErrorAlert('Error', res?.message || 'No se pudo crear la orden.');
    }
  };

  const handleAvanzar = async (orden) => {
    const nuevoEstado = FLUJO[orden.estado];
    if (!nuevoEstado) return;
    const res = await actualizarEstadoOrden(orden.id, { estado: nuevoEstado });
    if (res?.status === 'Success') {
      showSuccessAlert('Estado actualizado', `Orden marcada como "${estadoLabel(nuevoEstado)}".`);
      cargar();
    } else {
      showErrorAlert('Error', res?.message || 'No se pudo actualizar.');
    }
  };

  const resetForm = () => {
    setForm({ equipoNombre: '', descripcionFalla: '', motivo: '', tallerNombre: '', tallerProfesorNombre: '', tallerContacto: '', fechaRetornoEstimada: '', costo: '', observacion: '' });
  };

  const activas = ordenes.filter(o => o.estado !== 'devuelto').length;
  const enRep = ordenes.filter(o => o.estado === 'en_reparacion').length;
  const devueltas = ordenes.filter(o => o.estado === 'devuelto').length;

  if (loading) return <div className="loading-container">⏳ Cargando órdenes de reparación...</div>;

  return (
    <div className="reparaciones-page">
      <div className="reparaciones-header">
        <h1>🔧 Órdenes de Reparación</h1>
        <button id="btn-nueva-orden" className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nueva Orden
        </button>
      </div>

      {/* Stats */}
      <div className="prestamos-stats">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <span className="stat-value">{ordenes.length}</span>
        </div>
        <div className="stat-card stat-active">
          <span className="stat-label">Activas</span>
          <span className="stat-value">{activas}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label" style={{color:'var(--color-warning)'}}>En Reparación</span>
          <span className="stat-value" style={{color:'var(--color-warning)'}}>{enRep}</span>
        </div>
        <div className="stat-card stat-returned">
          <span className="stat-label">Devueltos</span>
          <span className="stat-value">{devueltas}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>Falla</th>
              <th>Taller / Profesor</th>
              <th>Contacto</th>
              <th>F. Envío</th>
              <th>F. Retorno Est.</th>
              <th>Costo</th>
              <th>Estado</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 ? (
              <tr><td colSpan="11" className="text-center" style={{padding:'32px',color:'var(--text-muted)'}}>Sin órdenes registradas.</td></tr>
            ) : ordenes.map(o => (
              <tr key={o.id}>
                <td><strong>#{o.id}</strong></td>
                <td><strong>{o.equipoNombre}</strong></td>
                <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.descripcionFalla}</td>
                <td>
                  <div className="taller-info">
                    <span className="taller-nombre">{o.tallerNombre}</span>
                    <span className="taller-profesor">Prof. {o.tallerProfesorNombre}</span>
                  </div>
                </td>
                <td style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{o.tallerContacto || '—'}</td>
                <td style={{whiteSpace:'nowrap'}}>{new Date(o.fechaEnvio).toLocaleDateString()}</td>
                <td style={{whiteSpace:'nowrap'}}>
                  {o.fechaRetornoEstimada
                    ? new Date(o.fechaRetornoEstimada).toLocaleDateString()
                    : <span style={{color:'var(--text-muted)'}}>—</span>}
                </td>
                <td>
                  {o.costo != null
                    ? <span className="costo-chip">${parseFloat(o.costo).toLocaleString()}</span>
                    : <span style={{color:'var(--text-muted)'}}>—</span>}
                </td>
                <td><span className={estadoClass(o.estado)}>{estadoLabel(o.estado)}</span></td>
                <td style={{fontSize:'0.82rem'}}>{o.responsable?.nombreCompleto || '—'}</td>
                <td>
                  {FLUJO[o.estado] && (
                    <button id={`btn-avanzar-${o.id}`} className="btn-avanzar"
                      onClick={() => handleAvanzar(o)}>
                      {FLUJO_LABEL[o.estado]}
                    </button>
                  )}
                  {o.estado === 'devuelto' && <span style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Cerrada</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{maxWidth: 620}}>
            <h2>🔧 Nueva Orden de Reparación</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-grid-2">
                <div className="form-group">
                  <label>Nombre del Equipo *</label>
                  <input id="input-rep-equipo" className="form-control" required placeholder="Laptop, impresora, etc."
                    value={form.equipoNombre} onChange={e => setForm({...form, equipoNombre: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Descripción de la Falla *</label>
                  <textarea id="input-rep-falla" className="form-control" rows={2} required placeholder="¿Qué falla presenta el equipo?"
                    value={form.descripcionFalla} onChange={e => setForm({...form, descripcionFalla: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Motivo del envío a reparación</label>
                  <input id="input-rep-motivo" className="form-control" placeholder="Ej: Pantalla rota por caída"
                    value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} />
                </div>

                <div style={{gridColumn:'1/-1', borderTop:'1px solid var(--border-subtle)', paddingTop:12, marginTop:4}}>
                  <p style={{fontSize:'0.78rem', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12}}>
                    🏭 Datos del Taller / Profesor
                  </p>
                </div>

                <div className="form-group">
                  <label>Nombre del Taller *</label>
                  <input id="input-rep-taller" className="form-control" required placeholder="Taller de Electrónica UFRO"
                    value={form.tallerNombre} onChange={e => setForm({...form, tallerNombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Nombre del Profesor a Cargo *</label>
                  <input id="input-rep-profesor" className="form-control" required placeholder="Prof. Juan Pérez"
                    value={form.tallerProfesorNombre} onChange={e => setForm({...form, tallerProfesorNombre: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Contacto del Taller</label>
                  <input id="input-rep-contacto" className="form-control" placeholder="Email o teléfono"
                    value={form.tallerContacto} onChange={e => setForm({...form, tallerContacto: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Fecha de Retorno Estimada</label>
                  <input id="input-rep-fecha" type="date" className="form-control"
                    value={form.fechaRetornoEstimada} onChange={e => setForm({...form, fechaRetornoEstimada: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Costo estimado ($)</label>
                  <input id="input-rep-costo" type="number" min="0" step="0.01" className="form-control" placeholder="0.00"
                    value={form.costo} onChange={e => setForm({...form, costo: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Observaciones</label>
                  <textarea id="input-rep-obs" className="form-control" rows={2} placeholder="Notas adicionales..."
                    value={form.observacion} onChange={e => setForm({...form, observacion: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" id="btn-cancel-orden" className="btn-cancel" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
                <button type="submit" id="btn-submit-orden" className="btn btn-primary">🔧 Crear Orden</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
