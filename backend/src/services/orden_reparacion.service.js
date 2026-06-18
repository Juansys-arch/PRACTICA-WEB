"use strict";
import { AppDataSource } from "../config/configDb.js";
import OrdenReparacion from "../entity/orden_reparacion.entity.js";
import { notificarPorRoles } from "./notificacion.service.js";

const ordenRepository = AppDataSource.getRepository(OrdenReparacion);

export async function crearOrdenReparacionService(data, responsableId) {
  try {
    const orden = await ordenRepository.save({
      equipoNombre: data.equipoNombre,
      descripcionFalla: data.descripcionFalla,
      motivo: data.motivo ?? null,
      tallerNombre: data.tallerNombre,
      tallerProfesorNombre: data.tallerProfesorNombre,
      tallerContacto: data.tallerContacto ?? null,
      fechaEnvio: data.fechaEnvio ? new Date(data.fechaEnvio) : new Date(),
      fechaRetornoEstimada: data.fechaRetornoEstimada
        ? new Date(data.fechaRetornoEstimada)
        : null,
      costo: data.costo ?? null,
      observacion: data.observacion ?? null,
      estado: "enviado",
      responsableId,
    });

    await notificarPorRoles({
      roles: ["administrador"],
      tipo: "orden_reparacion_creada",
      mensaje: `🔧 Se envió el equipo "${data.equipoNombre}" al taller "${data.tallerNombre}" (Prof. ${data.tallerProfesorNombre}) para reparación.`,
    });

    return [orden, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function obtenerOrdenesReparacionService() {
  try {
    const ordenes = await ordenRepository.find({
      order: { fechaEnvio: "DESC" },
      relations: ["responsable"],
    });
    return [ordenes, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function obtenerOrdenReparacionPorIdService(id) {
  try {
    const orden = await ordenRepository.findOne({
      where: { id },
      relations: ["responsable"],
    });
    if (!orden) return [null, "Orden de reparación no encontrada"];
    return [orden, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function actualizarEstadoOrdenService(id, data) {
  try {
    const orden = await ordenRepository.findOne({ where: { id } });
    if (!orden) return [null, "Orden de reparación no encontrada"];

    const updateData = {
      estado: data.estado,
      observacion: data.observacion ?? orden.observacion,
    };

    if (data.costo !== undefined && data.costo !== null) {
      updateData.costo = data.costo;
    }
    if (data.fechaRetornoReal) {
      updateData.fechaRetornoReal = new Date(data.fechaRetornoReal);
    }
    if (data.estado === "devuelto" && !data.fechaRetornoReal) {
      updateData.fechaRetornoReal = new Date();
    }

    await ordenRepository.update(id, updateData);

    const actualizada = await ordenRepository.findOne({
      where: { id },
      relations: ["responsable"],
    });

    if (data.estado === "devuelto") {
      await notificarPorRoles({
        roles: ["administrador", "encargado_inventario"],
        tipo: "orden_reparacion_devuelta",
        mensaje: `✅ El equipo "${orden.equipoNombre}" fue devuelto del taller "${orden.tallerNombre}".`,
      });
    }

    return [actualizada, null];
  } catch (error) {
    return [null, error.message];
  }
}
