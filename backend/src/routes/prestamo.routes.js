"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import {
  crearPrestamo,
  obtenerPrestamos,
  obtenerPrestamoPorId,
  devolverPrestamo,
} from "../controllers/prestamo.controller.js";

const router = Router();
router.use(authenticateJwt);

// profesor_practica gestiona los préstamos a estudiantes
router.post(
  "/",
  isAuthorized(["administrador", "profesor_practica"]),
  crearPrestamo,
);

router.get(
  "/",
  isAuthorized(["administrador", "profesor_practica"]),
  obtenerPrestamos,
);

router.get(
  "/:id",
  isAuthorized(["administrador", "profesor_practica"]),
  obtenerPrestamoPorId,
);

router.patch(
  "/:id/devolver",
  isAuthorized(["administrador", "profesor_practica"]),
  devolverPrestamo,
);

export default router;
