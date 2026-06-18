"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import {
  crearMaterial,
  obtenerMateriales,
  obtenerMaterialPorId,
  actualizarMaterial,
  registrarMovimiento,
  obtenerMovimientos,
} from "../controllers/inventario.controller.js";

const router = Router();
router.use(authenticateJwt);

// Gestión de materiales del laboratorio
router.post(
  "/materiales",
  isAuthorized(["administrador", "profesor_practica"]),
  crearMaterial
);

router.get(
  "/materiales",
  isAuthorized(["administrador", "profesor_practica", "reparador"]),
  obtenerMateriales
);

router.get(
  "/materiales/:id",
  isAuthorized(["administrador", "profesor_practica", "reparador"]),
  obtenerMaterialPorId
);

router.patch(
  "/materiales/:id",
  isAuthorized(["administrador", "profesor_practica"]),
  actualizarMaterial
);

// Movimientos de stock (entradas/salidas)
router.post(
  "/movimientos",
  isAuthorized(["administrador", "profesor_practica"]),
  registrarMovimiento
);

router.get(
  "/movimientos",
  isAuthorized(["administrador", "profesor_practica"]),
  obtenerMovimientos
);

export default router;