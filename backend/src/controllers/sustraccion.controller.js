"use strict";
import {
  crearSustraccionService,
  obtenerSustraccionesService,
  obtenerSustraccionPorIdService,
  actualizarEstadoSustraccionService,
} from "../services/sustraccion.service.js";
import {
  crearSustraccionValidation,
  actualizarEstadoSustraccionValidation,
} from "../validations/sustraccion.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function crearSustraccion(req, res) {
  try {
    const { body } = req;
    const { error } = crearSustraccionValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const [sustraccion, sustraccionError] = await crearSustraccionService(body, req.user.id);
    if (sustraccionError) return handleErrorClient(res, 400, "Error al registrar sustracción", sustraccionError);

    handleSuccess(res, 201, "Sustracción registrada exitosamente", sustraccion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerSustracciones(req, res) {
  try {
    const [sustracciones, error] = await obtenerSustraccionesService();
    if (error) return handleErrorClient(res, 400, "Error al obtener sustracciones", error);
    handleSuccess(res, 200, "Sustracciones obtenidas exitosamente", sustracciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerSustraccionPorId(req, res) {
  try {
    const { id } = req.params;
    const [sustraccion, error] = await obtenerSustraccionPorIdService(parseInt(id));
    if (error) return handleErrorClient(res, 404, "Error al obtener sustracción", error);
    handleSuccess(res, 200, "Sustracción obtenida exitosamente", sustraccion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function actualizarEstadoSustraccion(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;
    const { error } = actualizarEstadoSustraccionValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const [sustraccion, sustraccionError] = await actualizarEstadoSustraccionService(parseInt(id), body);
    if (sustraccionError) return handleErrorClient(res, 400, "Error al actualizar sustracción", sustraccionError);

    handleSuccess(res, 200, "Estado de sustracción actualizado", sustraccion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
