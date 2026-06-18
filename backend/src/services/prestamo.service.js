"use strict";
import { AppDataSource } from "../config/configDb.js";
import Prestamo from "../entity/prestamo.entity.js";
import { notificarPorRoles } from "./notificacion.service.js";

const prestamoRepository = AppDataSource.getRepository(Prestamo);

export async function crearPrestamoService(data, responsableId) {
  try {
    const prestamo = await prestamoRepository.save({
      equipoNombre: data.equipoNombre,
      descripcionEquipo: data.descripcionEquipo ?? null,
      estudianteNombre: data.estudianteNombre,
      estudianteRut: data.estudianteRut,
      fechaPrestamo: data.fechaPrestamo ? new Date(data.fechaPrestamo) : new Date(),
      fechaDevolucionEstimada: data.fechaDevolucionEstimada
        ? new Date(data.fechaDevolucionEstimada)
        : null,
      observacion: data.observacion ?? null,
      estado: "prestado",
      responsableId,
    });

    return [prestamo, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function obtenerPrestamosService() {
  try {
    const prestamos = await prestamoRepository.find({
      order: { fechaPrestamo: "DESC" },
      relations: ["responsable"],
    });
    return [prestamos, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function obtenerPrestamoPorIdService(id) {
  try {
    const prestamo = await prestamoRepository.findOne({
      where: { id },
      relations: ["responsable"],
    });
    if (!prestamo) return [null, "Préstamo no encontrado"];
    return [prestamo, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function devolverPrestamoService(id, data) {
  try {
    const prestamo = await prestamoRepository.findOne({ where: { id } });
    if (!prestamo) return [null, "Préstamo no encontrado"];
    if (prestamo.estado === "devuelto") return [null, "El préstamo ya fue devuelto"];

    await prestamoRepository.update(id, {
      estado: "devuelto",
      fechaDevolucionReal: new Date(),
      observacion: data.observacion ?? prestamo.observacion,
    });

    const actualizado = await prestamoRepository.findOne({
      where: { id },
      relations: ["responsable"],
    });
    return [actualizado, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function actualizarEstadosPrestamosVencidosService() {
  try {
    const ahora = new Date();
    const prestamosActivos = await prestamoRepository.find({
      where: { estado: "prestado" },
    });

    const vencidos = prestamosActivos.filter(
      (p) => p.fechaDevolucionEstimada && new Date(p.fechaDevolucionEstimada) < ahora,
    );

    if (vencidos.length > 0) {
      await Promise.all(
        vencidos.map((p) => prestamoRepository.update(p.id, { estado: "vencido" })),
      );

      await notificarPorRoles({
        roles: ["administrador", "encargado_inventario"],
        tipo: "prestamo_vencido",
        mensaje: `Hay ${vencidos.length} préstamo(s) con fecha de devolución vencida.`,
      });
    }

    return [{ actualizados: vencidos.length }, null];
  } catch (error) {
    return [null, error.message];
  }
}
