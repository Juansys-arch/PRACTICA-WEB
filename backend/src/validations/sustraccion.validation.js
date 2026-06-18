"use strict";
import Joi from "joi";

export const crearSustraccionValidation = Joi.object({
  equipoNombre: Joi.string().min(2).max(255).required().messages({
    "string.empty": "El nombre del equipo es requerido.",
    "any.required": "El nombre del equipo es requerido.",
  }),
  descripcion: Joi.string().min(5).max(1000).required().messages({
    "string.empty": "La descripción es requerida.",
    "any.required": "La descripción es requerida.",
    "string.min": "La descripción debe tener al menos 5 caracteres.",
  }),
  tipo: Joi.string()
    .valid("robo", "retiro_no_autorizado", "perdida")
    .required()
    .messages({
      "any.only": "El tipo debe ser robo, retiro_no_autorizado o perdida.",
      "any.required": "El tipo es requerido.",
    }),
  fechaSuceso: Joi.date().iso().required().messages({
    "date.base": "La fecha del suceso debe ser válida.",
    "any.required": "La fecha del suceso es requerida.",
  }),
  ubicacionUltima: Joi.string().max(255).optional().allow("", null),
  observacion: Joi.string().max(1000).optional().allow("", null),
}).unknown(false);

export const actualizarEstadoSustraccionValidation = Joi.object({
  estado: Joi.string()
    .valid("reportado", "en_investigacion", "resuelto")
    .required()
    .messages({
      "any.only": "El estado debe ser reportado, en_investigacion o resuelto.",
      "any.required": "El estado es requerido.",
    }),
  observacion: Joi.string().max(1000).optional().allow("", null),
}).unknown(false);
