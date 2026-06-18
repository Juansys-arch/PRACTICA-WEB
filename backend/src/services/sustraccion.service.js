"use strict";
import { AppDataSource } from "../config/configDb.js";
import Sustraccion from "../entity/sustraccion.entity.js";
import { notificarPorRoles } from "./notificacion.service.js";

const sustraccionRepository = AppDataSource.getRepository(Sustraccion);

export async function crearSustraccionService(data, reportadoPorId) {
  try {
    const sustraccion = await sustraccionRepository.save({
      equipoNombre: data.equipoNombre,
      descripcion: data.descripcion,
      tipo: data.tipo,
      estado: "reportado",
      fechaSuceso: new Date(data.fechaSuceso),
      ubicacionUltima: data.ubicacionUltima ?? null,
      observacion: data.observacion ?? null,
      reportadoPorId,
    });

    // Notificar automáticamente al administrador ante robo
    await notificarPorRoles({
      roles: ["administrador", "encargado_inventario"],
      tipo: "sustraccion_reportada",
      mensaje: `⚠️ Se reportó una sustracción de tipo "${data.tipo}": "${data.equipoNombre}". Fecha del suceso: ${new Date(data.fechaSuceso).toLocaleDateString()}.`,
    });

    return [sustraccion, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function obtenerSustraccionesService() {
  try {
    const sustracciones = await sustraccionRepository.find({
      order: { fechaSuceso: "DESC" },
      relations: ["reportadoPor"],
    });
    return [sustracciones, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function obtenerSustraccionPorIdService(id) {
  try {
    const sustraccion = await sustraccionRepository.findOne({
      where: { id },
      relations: ["reportadoPor"],
    });
    if (!sustraccion) return [null, "Sustracción no encontrada"];
    return [sustraccion, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function actualizarEstadoSustraccionService(id, data) {
  try {
    const sustraccion = await sustraccionRepository.findOne({ where: { id } });
    if (!sustraccion) return [null, "Sustracción no encontrada"];

    await sustraccionRepository.update(id, {
      estado: data.estado,
      observacion: data.observacion ?? sustraccion.observacion,
    });

    const actualizada = await sustraccionRepository.findOne({
      where: { id },
      relations: ["reportadoPor"],
    });
    return [actualizada, null];
  } catch (error) {
    return [null, error.message];
  }
}
