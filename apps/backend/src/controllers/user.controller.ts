import { Request, Response } from "express";
import {
  UserRegister,
  UserRegisterRequestModel,
} from "@domain/use-cases/user/user-register";
import { AppError, createInternalServerError } from "@domain/errors/error";
import { userService, getUserForResponse } from "../services/user/user.service";
import { cryptoService } from "../services/crypto/crypto.service";

export function userController() {
  return {
    // Register new user
    registerNewUser: async (req: Request, res: Response) => {
      try {
        const { email, password, name, surname }: UserRegisterRequestModel =
          req.body;

        const user = await UserRegister(
          {
            users: userService(),
            cryptoRepository: cryptoService(),
          },
          { email, password, name, surname }
        );

        // Si hay error de validación, user será InvalidDataError
        if ("message" in user) {
          return res.status(400).json({
            ok: false,
            message: user.message,
          });
        }

        // Usuario creado exitosamente
        const userResponse = getUserForResponse(user);

        return res.status(201).json({
          ok: true,
          data: userResponse,
          message: "Usuario registrado con éxito",
        });
      } catch (e) {
        console.error("Error in registerNewUser:", e);
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Ups, hubo un error al registrar el usuario"
              );

        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },

    // Get user by ID
    getUserById: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const userRepo = userService();
        const user = await userRepo.findById(id);
        const userResponse = getUserForResponse(user);

        return res.status(200).json({
          ok: true,
          data: userResponse,
          message: "Perfil de usuario",
        });
      } catch (e) {
        console.error("Error in getUserById:", e);
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Ups, hubo un error al obtener el perfil de usuario"
              );

        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },

    // Get all users
    getAllUsers: async (req: Request, res: Response) => {
      try {
        const userRepo = userService();
        const users = await userRepo.findAll();

        const usersResponse = users.map((user) => {
          const userDto = getUserForResponse(user);
          return {
            ...userDto,
            url: `${req.protocol}://${req.get("host")}/api/users/${user.id}`,
          };
        });

        return res.status(200).json({
          ok: true,
          data: usersResponse,
          message: "Lista de usuarios",
        });
      } catch (e) {
        console.error("Error in getAllUsers:", e);
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Ups, hubo un error al obtener la lista de usuarios"
              );

        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },

    // Update user
    updateUser: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const updateData = req.body;

        const userRepo = userService();

        // Verificar que el usuario existe
        const existingUser = await userRepo.findById(id);

        // Actualizar solo campos permitidos
        const updatedUserData = {
          ...existingUser,
          name: updateData.name || existingUser.name,
          surname: updateData.surname || existingUser.surname,
          image:
            updateData.image !== undefined
              ? updateData.image
              : existingUser.image,
          // No permitir cambiar email, password, role desde aquí
        };

        const updatedUser = await userRepo.update(updatedUserData);
        const userResponse = getUserForResponse(updatedUser);

        return res.status(200).json({
          ok: true,
          data: userResponse,
          message: "Usuario actualizado con éxito",
        });
      } catch (e) {
        console.error("Error in updateUser:", e);
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Ups, hubo un error al actualizar el usuario"
              );

        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },

    // Delete user
    deleteUser: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const userRepo = userService();
        await userRepo.delete(id);

        return res.status(200).json({
          ok: true,
          message: "Usuario eliminado con éxito",
        });
      } catch (e) {
        console.error("Error in deleteUser:", e);
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Ups, hubo un error al eliminar el usuario"
              );

        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },

    // Get current user profile (from JWT token)
    getCurrentUser: async (req: Request, res: Response) => {
      try {
        // Assuming we have middleware that adds user to request
        const userId = (req as any).user?.id;

        if (!userId) {
          return res.status(401).json({
            ok: false,
            message: "Token no válido",
          });
        }

        const userRepo = userService();
        const user = await userRepo.findById(userId);
        const userResponse = getUserForResponse(user);

        return res.status(200).json({
          ok: true,
          data: userResponse,
          message: "Perfil del usuario actual",
        });
      } catch (e) {
        console.error("Error in getCurrentUser:", e);
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Ups, hubo un error al obtener tu perfil"
              );

        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}
