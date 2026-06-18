"use strict";

import { AppDataSource } from "../config/configDb.js";
import Material from "../entity/material.entity.js";
import MovimientoInventario from "../entity/movimientoinventario.entity.js";
import Notificacion from "../entity/notificacion.entity.js";
import User from "../entity/user.entity.js";
import { notificarPorRoles } from "./notificacion.service.js";

const materialRepository = AppDataSource.getRepository(Material);
const movimientoRepository = AppDataSource.getRepository(MovimientoInventario);
const notificacionRepository = AppDataSource.getRepository(Notificacion);
const userRepository = AppDataSource.getRepository(User);

export async function crearMaterialService(data) {
  try {
    const existe = await materialRepository.findOne({
      where: { nombre: data.nombre },
    });

    if (existe) return [null, "Ya existe un material con ese nombre"];

    const material = await materialRepository.save({
      ...data,
      stockActual: 0,
      stockMinimo: data.stockMinimo ?? 0,
    });

    return [material, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function obtenerMaterialesService() {
  try {
    const materiales = await materialRepository.find({
      order: { nombre: "ASC" },
    });

    return [materiales, null];
  } catch (error) {
    return [null, error.message];
  }
}


export async function obtenerMaterialPorIdService(id) {
  try {
    const material = await materialRepository.findOne({
      where: { id },
    });

    if (!material) return [null, "Material no encontrado"];

    return [material, null];
  } catch (error) {
    return [null, error.message];
  }
}


export async function actualizarMaterialService(id, data) {
  try {
    const material = await materialRepository.findOne({
      where: { id },
    });

    if (!material) return [null, "Material no encontrado"];

    await materialRepository.update(id, data);

    const actualizado = await materialRepository.findOne({
      where: { id },
    });

    return [actualizado, null];
  } catch (error) {
    return [null, error.message];
  }
}


export async function registrarMovimientoService(data, responsableId) {
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    let material = null;
    if (data.materialId) {
      material = await queryRunner.manager.findOne(Material, {
        where: { id: data.materialId },
        lock: { mode: "pessimistic_write" },
      });
    }

    // Si no existe material por id, permitir crear uno nuevo si se envía materialNombre
    if (!material && data.materialNombre) {
      material = await queryRunner.manager.save(Material, {
        nombre: data.materialNombre,
        descripcion: data.descripcion ?? null,
        unidadMedida: data.unidadMedida ?? "unid.",
        stockActual: 0,
        stockMinimo: data.stockMinimo ?? 0,
      });
      // lock the newly created material for update
      material = await queryRunner.manager.findOne(Material, {
        where: { id: material.id },
        lock: { mode: "pessimistic_write" },
      });
    }

    if (!material) {
      await queryRunner.rollbackTransaction();
      return [null, "Material no encontrado"];
    }


    if (data.tipo === "salida") {
      if (material.stockActual < data.cantidad) {
        await queryRunner.rollbackTransaction();
        return [null, `Stock insuficiente. Disponible: ${material.stockActual}`];
      }

      material.stockActual -= data.cantidad;
    }

    else {
      material.stockActual += data.cantidad;
    }

    await queryRunner.manager.save(Material, material);

    const movimiento = await queryRunner.manager.save(MovimientoInventario, {
      materialId: material.id,
      tipo: data.tipo,
      cantidad: data.cantidad,
      observacion: data.observacion ?? null,
      responsableId,
      fecha: new Date(),
    });

    await queryRunner.commitTransaction();

    if (material.stockActual <= material.stockMinimo) {
      await notificarPorRoles({
        roles: ["profesor_practica", "administrador"],
        tipo: "stock_bajo",
        mensaje: `El material "${material.nombre}" quedó con stock ${material.stockActual}. Stock mínimo: ${material.stockMinimo}.`,
        materialId: material.id,
      });
    }

    return [movimiento, null];
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return [null, error.message];
  } finally {
    await queryRunner.release();
  }
}

export async function obtenerMovimientosService(materialId = null) {
  try {
    const where = materialId ? { materialId } : {};

    const movimientos = await movimientoRepository.find({
      where,
      order: { fecha: "DESC" },
      relations: ["material", "responsable"],
    });

    return [movimientos, null];
  } catch (error) {
    return [null, error.message];
  }
}
