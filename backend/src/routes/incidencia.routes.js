"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAuthorized } from "../middlewares/authorization.middleware.js";
import {
  crearIncidencia,
  obtenerIncidencias,
  obtenerIncidenciaPorId,
} from "../controllers/incidencia.controller.js";

const router = Router();
router.use(authenticateJwt);

// Solo profesor_practica puede reportar incidencias
router.post(
  "/",
  isAuthorized(["profesor_practica", "administrador"]),
  crearIncidencia,
);

// Todos los roles autenticados pueden ver incidencias
router.get(
  "/",
  isAuthorized(["profesor_practica", "reparador", "administrador"]),
  obtenerIncidencias,
);

router.get(
  "/:id",
  isAuthorized(["profesor_practica", "reparador", "administrador"]),
  obtenerIncidenciaPorId,
);

export default router;