"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import {
  crearSustraccion,
  obtenerSustracciones,
  obtenerSustraccionPorId,
  actualizarEstadoSustraccion,
} from "../controllers/sustraccion.controller.js";

const router = Router();
router.use(authenticateJwt);

// profesor_practica reporta sustracciones del lab
router.post(
  "/",
  isAuthorized(["administrador", "profesor_practica"]),
  crearSustraccion,
);

router.get(
  "/",
  isAuthorized(["administrador", "profesor_practica"]),
  obtenerSustracciones,
);

router.get(
  "/:id",
  isAuthorized(["administrador", "profesor_practica"]),
  obtenerSustraccionPorId,
);

router.patch(
  "/:id/estado",
  isAuthorized(["administrador", "profesor_practica"]),
  actualizarEstadoSustraccion,
);

export default router;
