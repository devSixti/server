import { ExpressController, Status } from "../../common/types";
import { ErrorMsg, extractPayload } from "../../common/utils";
import { UserModel } from "../../users/models";

export const isAuth: ExpressController = async (req, res, next) => {
  try {
    const token = req.header("x-token") as string;

    const { id } = extractPayload(token);

    if (!id) {
      throw new ErrorMsg(
        "Your token is invalid. We couldn’t find your user ID.",
        401
      );
    }

    const user = await UserModel.findById(id).populate("driver");

    if (!user) {
      throw new ErrorMsg("User not found. Please check the information and try again.", 404);
    }

    if (!user.is_active) {
      throw new ErrorMsg("Invalid credentials - user inactive", 403);
    }

    if (user.driver) {

      // if (user.driver.status_request !== Status.ACCEPTED) {
      //   throw new ErrorMsg("You are not an approved driver", 403);}

      req.driver_uid = user.driver.id;

    }


    req.uid = user.id
    


    next()
  } catch (error) {
    next(error);
  }
};






// // //? Declara una nueva propiedad uid globalmente en el objeto Request
// declare global {
//   namespace Express {
//     interface Request {
//       uid?: string;
//     }
//   }
// }



// //? Valida el JWT. Si el JWT era válido previamente genera uno nuevo para que se almacene en el front-end.
// export function validationJWT(req: Request, res: Response, next: NextFunction) {
//   const token = req.header("x-token");
//   if (!token) {
//     return res
//       .status(401)
//       .json({ status: "invalido", msg: "No se envió ningún token" });
//   }
//   try {
//     if (!envValues.jwt_secret) {
//       return res.status(500).json({
//         msg: "Error interno del servidor - Revise variables de entorno.",
//       });
//     }
//     const uid = jwt.verify(token, envValues.jwt_secret!) as jwt.JwtPayload;
//     req.uid = uid["id"];
//     return next();
//   } catch (error) {
//     return res
//       .status(423)
//       .json({ status: "invalido", msg: "Error en el token - Token invalido" });
//   }
// }
