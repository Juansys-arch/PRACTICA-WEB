"use strict";
import { EntitySchema } from "typeorm";

const SustraccionSchema = new EntitySchema({
  name: "Sustraccion",
  tableName: "sustracciones",
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
    descripcion: {
      type: "text",
      nullable: false,
    },
    tipo: {
      type: "varchar",
      length: 30,
      nullable: false,
      // valores: "robo" | "retiro_no_autorizado" | "perdida"
    },
    estado: {
      type: "varchar",
      length: 30,
      default: "reportado",
      nullable: false,
      // valores: "reportado" | "en_investigacion" | "resuelto"
    },
    fechaSuceso: {
      type: "timestamp with time zone",
      nullable: false,
    },
    ubicacionUltima: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    observacion: {
      type: "text",
      nullable: true,
    },
    reportadoPorId: {
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
    reportadoPor: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "reportadoPorId" },
      eager: true,
    },
  },
});

export default SustraccionSchema;
