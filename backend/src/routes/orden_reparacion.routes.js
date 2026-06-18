"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import {
  crearOrdenReparacion,
  obtenerOrdenesReparacion,
  obtenerOrdenReparacionPorId,
  actualizarEstadoOrden,
} from "../controllers/orden_reparacion.controller.js";

const router = Router();
router.use(authenticateJwt);

// profesor_practica crea la orden, reparador la gestiona
router.post(
  "/",
  isAuthorized(["administrador", "profesor_practica"]),
  crearOrdenReparacion,
);

// Todos pueden ver las órdenes
router.get(
  "/",
  isAuthorized(["administrador", "profesor_practica", "reparador"]),
  obtenerOrdenesReparacion,
);

router.get(
  "/:id",
  isAuthorized(["administrador", "profesor_practica", "reparador"]),
  obtenerOrdenReparacionPorId,
);

// El reparador actualiza el estado (en reparación, listo, devuelto)
router.patch(
  "/:id/estado",
  isAuthorized(["administrador", "profesor_practica", "reparador"]),
  actualizarEstadoOrden,
);

export default router;
