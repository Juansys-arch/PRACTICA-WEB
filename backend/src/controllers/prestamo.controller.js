"use strict";
import {
  crearPrestamoService,
  obtenerPrestamosService,
  obtenerPrestamoPorIdService,
  devolverPrestamoService,
} from "../services/prestamo.service.js";
import {
  crearPrestamoValidation,
  devolverPrestamoValidation,
} from "../validations/prestamo.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function crearPrestamo(req, res) {
  try {
    const { body } = req;
    const { error } = crearPrestamoValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const [prestamo, prestamoError] = await crearPrestamoService(body, req.user.id);
    if (prestamoError) return handleErrorClient(res, 400, "Error al registrar préstamo", prestamoError);

    handleSuccess(res, 201, "Préstamo registrado exitosamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerPrestamos(req, res) {
  try {
    const [prestamos, error] = await obtenerPrestamosService();
    if (error) return handleErrorClient(res, 400, "Error al obtener préstamos", error);
    handleSuccess(res, 200, "Préstamos obtenidos exitosamente", prestamos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerPrestamoPorId(req, res) {
  try {
    const { id } = req.params;
    const [prestamo, error] = await obtenerPrestamoPorIdService(parseInt(id));
    if (error) return handleErrorClient(res, 404, "Error al obtener préstamo", error);
    handleSuccess(res, 200, "Préstamo obtenido exitosamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function devolverPrestamo(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;
    const { error } = devolverPrestamoValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const [prestamo, prestamoError] = await devolverPrestamoService(parseInt(id), body);
    if (prestamoError) return handleErrorClient(res, 400, "Error al registrar devolución", prestamoError);

    handleSuccess(res, 200, "Devolución registrada exitosamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
