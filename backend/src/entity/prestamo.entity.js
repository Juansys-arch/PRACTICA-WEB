"use strict";
import { EntitySchema } from "typeorm";

const PrestamoSchema = new EntitySchema({
  name: "Prestamo",
  tableName: "prestamos",
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
    descripcionEquipo: {
      type: "text",
      nullable: true,
    },
    estudianteNombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    estudianteRut: {
      type: "varchar",
      length: 15,
      nullable: false,
    },
    fechaPrestamo: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    fechaDevolucionEstimada: {
      type: "timestamp with time zone",
      nullable: true,
    },
    fechaDevolucionReal: {
      type: "timestamp with time zone",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "prestado",
      nullable: false,
      // valores: "prestado" | "devuelto" | "vencido"
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

export default PrestamoSchema;
