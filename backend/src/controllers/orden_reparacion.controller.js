"use strict";
import {
  crearOrdenReparacionService,
  obtenerOrdenesReparacionService,
  obtenerOrdenReparacionPorIdService,
  actualizarEstadoOrdenService,
} from "../services/orden_reparacion.service.js";
import {
  crearOrdenReparacionValidation,
  actualizarEstadoOrdenValidation,
} from "../validations/orden_reparacion.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function crearOrdenReparacion(req, res) {
  try {
    const { body } = req;
    const { error } = crearOrdenReparacionValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const [orden, ordenError] = await crearOrdenReparacionService(body, req.user.id);
    if (ordenError) return handleErrorClient(res, 400, "Error al crear orden de reparación", ordenError);

    handleSuccess(res, 201, "Orden de reparación creada exitosamente", orden);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerOrdenesReparacion(req, res) {
  try {
    const [ordenes, error] = await obtenerOrdenesReparacionService();
    if (error) return handleErrorClient(res, 400, "Error al obtener órdenes de reparación", error);
    handleSuccess(res, 200, "Órdenes de reparación obtenidas exitosamente", ordenes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerOrdenReparacionPorId(req, res) {
  try {
    const { id } = req.params;
    const [orden, error] = await obtenerOrdenReparacionPorIdService(parseInt(id));
    if (error) return handleErrorClient(res, 404, "Error al obtener orden de reparación", error);
    handleSuccess(res, 200, "Orden de reparación obtenida exitosamente", orden);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function actualizarEstadoOrden(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;
    const { error } = actualizarEstadoOrdenValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const [orden, ordenError] = await actualizarEstadoOrdenService(parseInt(id), body);
    if (ordenError) return handleErrorClient(res, 400, "Error al actualizar orden de reparación", ordenError);

    handleSuccess(res, 200, "Estado de orden de reparación actualizado", orden);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
