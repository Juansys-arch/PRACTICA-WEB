"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import inventarioRoutes from "./inventario.routes.js";
import notificacionRoutes from "./notificacion.routes.js";
import incidenciaRoutes from "./incidencia.routes.js";
import prestamoRoutes from "./prestamo.routes.js";
import sustraccionRoutes from "./sustraccion.routes.js";
import ordenReparacionRoutes from "./orden_reparacion.routes.js";

const router = Router();
router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/inventario", inventarioRoutes)
  .use("/notificaciones", notificacionRoutes)
  .use("/incidencias", incidenciaRoutes)
  .use("/prestamos", prestamoRoutes)
  .use("/sustracciones", sustraccionRoutes)
  .use("/reparaciones", ordenReparacionRoutes);

export default router;