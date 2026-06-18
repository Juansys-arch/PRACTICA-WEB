"use strict";
import { EntitySchema } from "typeorm";

const OrdenReparacionSchema = new EntitySchema({
  name: "OrdenReparacion",
  tableName: "ordenes_reparacion",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    equipoNombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcionFalla: {
      type: "text",
      nullable: false,
    },
    motivo: {
      type: "text",
      nullable: true,
    },
    tallerNombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    tallerProfesorNombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    tallerContacto: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    fechaEnvio: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    fechaRetornoEstimada: {
      type: "timestamp with time zone",
      nullable: true,
    },
    fechaRetornoReal: {
      type: "timestamp with time zone",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "enviado",
      nullable: false,
      // valores: "enviado" | "en_reparacion" | "listo" | "devuelto"
    },
    costo: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: true,
    },
    observacion: {
      type: "text",
      nullable: true,
    },
    responsableId: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    responsable: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "responsableId" },
      eager: true,
    },
  },
});

export default OrdenReparacionSchema;
