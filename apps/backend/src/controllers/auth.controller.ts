import { Request, Response } from "express";
import {
  UserRegister,
  UserRegisterRequestModel,
} from "../../../../domain/src/use-cases/user/user-register";
import { createInternalServerError } from "../../../../domain/src/errors/error";
import { userService, getUserForResponse } from "../services/user/user.service";
import { cryptoService } from "../services/crypto/crypto.service";
import { UserLogin, UserLoginRequestModel } from "@no-name-store/domain";

export function authController() {
  return {
    register: async (req: Request, res: Response) => {
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

        if ("type" in user && "message" in user && "httpStatus" in user) {
          return res.status(user.httpStatus).json({
            ok: false,
            message: user.message,
          });
        }

        const userResponse = getUserForResponse(user);

        return res.status(201).json({
          ok: true,
          data: userResponse,
          message: "Usuario registrado con éxito",
        });
      } catch (e) {
        console.log("Error in register:", e);
        const error = createInternalServerError(
          "Error interno del servidor al registrar usuario"
        );

        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },

    login: async (req: Request, res: Response) => {
      try {
        const { email, password }: UserLoginRequestModel = req.body;

        const user = await UserLogin(
          {
            users: userService(),
            crypto: cryptoService(),
          },
          { email, password }
        );

        if ("type" in user && "message" in user && "httpStatus" in user) {
          return res.status(user.httpStatus).json({
            ok: false,
            message: user.message,
          });
        }

        const token = await cryptoService().generateJWT(user);

        const userResponse = getUserForResponse(user);

        return res.status(200).json({
          ok: true,
          token,
          data: userResponse,
          message: "Login exitoso",
        });
      } catch (e) {
        return res.status(500).json({
          ok: false,
          message: "Error interno del servidor al hacer login",
        });
      }
    },
  };
}
