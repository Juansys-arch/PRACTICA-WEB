"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import {
  obtenerNotificaciones,
  marcarNotificacionLeida,
} from "../controllers/notificacion.controller.js";

const router = Router();
router.use(authenticateJwt);

router.get(
  "/",
  isAuthorized(["administrador", "profesor_practica"]),
  obtenerNotificaciones
);

router.patch(
  "/:id/leer",
  isAuthorized(["administrador", "profesor_practica"]),
  marcarNotificacionLeida
);

export default router;