"use strict";
import Joi from "joi";

export const crearPrestamoValidation = Joi.object({
  equipoNombre: Joi.string().min(2).max(255).required().messages({
    "string.empty": "El nombre del equipo es requerido.",
    "any.required": "El nombre del equipo es requerido.",
    "string.min": "El nombre del equipo debe tener al menos 2 caracteres.",
  }),
  descripcionEquipo: Joi.string().max(1000).optional().allow("", null),
  estudianteNombre: Joi.string().min(2).max(255).required().messages({
    "string.empty": "El nombre del estudiante es requerido.",
    "any.required": "El nombre del estudiante es requerido.",
  }),
  estudianteRut: Joi.string().min(7).max(15).required().messages({
    "string.empty": "El RUT del estudiante es requerido.",
    "any.required": "El RUT del estudiante es requerido.",
  }),
  fechaPrestamo: Joi.date().iso().optional(),
  fechaDevolucionEstimada: Joi.date().iso().optional().allow(null),
  observacion: Joi.string().max(1000).optional().allow("", null),
}).unknown(false);

export const devolverPrestamoValidation = Joi.object({
  observacion: Joi.string().max(1000).optional().allow("", null),
}).unknown(false);
