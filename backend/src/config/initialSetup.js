"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const defaultUsers = [
      // ─── Administrador del sistema ─────────────────────────────
      {
        nombreCompleto: "Administrador del Lab",
        rut: "21.308.770-3",
        email: "admin@lab.cl",
        password: "admin1234",
        rol: "administrador",
        status: "active",
      },
      // ─── Profesores de práctica ────────────────────────────────
      {
        nombreCompleto: "Profesor Carlos Ramírez",
        rut: "15.432.100-K",
        email: "carlos.ramirez@lab.cl",
        password: "practica1234",
        rol: "profesor_practica",
        status: "active",
      },
      {
        nombreCompleto: "Profesora Ana Muñoz",
        rut: "16.789.234-5",
        email: "ana.munoz@lab.cl",
        password: "practica1234",
        rol: "profesor_practica",
        status: "active",
      },
      // ─── Reparadores (Taller / Profesor encargado de reparar) ─
      {
        nombreCompleto: "Prof. Técnico Jorge Soto",
        rut: "13.210.456-7",
        email: "jorge.soto@lab.cl",
        password: "reparador1234",
        rol: "reparador",
        status: "active",
      },
      {
        nombreCompleto: "Prof. Técnico Marcela Vega",
        rut: "14.567.890-2",
        email: "marcela.vega@lab.cl",
        password: "reparador1234",
        rol: "reparador",
        status: "active",
      },
    ];

    await Promise.all(
      defaultUsers.map(async (defaultUser) => {
        const existingUser = await userRepository.findOne({
          where: [
            { email: defaultUser.email },
            { rut: defaultUser.rut }
          ],
        });

        if (existingUser) {
          // Si existe, actualizamos sus datos para que coincidan con los nuevos
          existingUser.email = defaultUser.email;
          existingUser.nombreCompleto = defaultUser.nombreCompleto;
          existingUser.rol = defaultUser.rol;
          // Actualizamos la contraseña para asegurarnos de que puedan entrar con los nuevos datos
          existingUser.password = await encryptPassword(defaultUser.password);
          await userRepository.save(existingUser);
          return;
        }

        await userRepository.save(
          userRepository.create({
            ...defaultUser,
            password: await encryptPassword(defaultUser.password),
          }),
        );
      }),
    );

    console.log("* => Usuarios del laboratorio creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };