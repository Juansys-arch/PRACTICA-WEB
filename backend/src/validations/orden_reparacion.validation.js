"use strict";
import Joi from "joi";

export const crearOrdenReparacionValidation = Joi.object({
  equipoNombre: Joi.string().min(2).max(255).required().messages({
    "string.empty": "El nombre del equipo es requerido.",
    "any.required": "El nombre del equipo es requerido.",
  }),
  descripcionFalla: Joi.string().min(5).max(1000).required().messages({
    "string.empty": "La descripción de la falla es requerida.",
    "any.required": "La descripción de la falla es requerida.",
    "string.min": "La descripción debe tener al menos 5 caracteres.",
  }),
  motivo: Joi.string().max(1000).optional().allow("", null),
  tallerNombre: Joi.string().min(2).max(255).required().messages({
    "string.empty": "El nombre del taller es requerido.",
    "any.required": "El nombre del taller es requerido.",
  }),
  tallerProfesorNombre: Joi.string().min(2).max(255).required().messages({
    "string.empty": "El nombre del profesor del taller es requerido.",
    "any.required": "El nombre del profesor del taller es requerido.",
  }),
  tallerContacto: Joi.string().max(255).optional().allow("", null),
  fechaEnvio: Joi.date().iso().optional(),
  fechaRetornoEstimada: Joi.date().iso().optional().allow(null),
  costo: Joi.number().min(0).optional().allow(null),
  observacion: Joi.string().max(1000).optional().allow("", null),
}).unknown(false);

export const actualizarEstadoOrdenValidation = Joi.object({
  estado: Joi.string()
    .valid("enviado", "en_reparacion", "listo", "devuelto")
    .required()
    .messages({
      "any.only": "El estado debe ser enviado, en_reparacion, listo o devuelto.",
      "any.required": "El estado es requerido.",
    }),
  fechaRetornoReal: Joi.date().iso().optional().allow(null),
  costo: Joi.number().min(0).optional().allow(null),
  observacion: Joi.string().max(1000).optional().allow("", null),
}).unknown(false);
