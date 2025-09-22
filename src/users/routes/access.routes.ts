import { Router } from "express";
import { AccessControllers } from "../../users/controller";
import { isAuth } from "../../common/middlewares";

const router = Router();

router.post(
  "/auth/create-user-first-time",
  AccessControllers.authOrCreateNewUserFirstTime
);
router.put("/auth/update-device", isAuth, AccessControllers.updateDevice);
router.put("/verify-email", AccessControllers.verifyEmail);
router.put("/verify-phone", AccessControllers.verifyPhone);

router.put("/email", isAuth, AccessControllers.updateEmail);
router.put("/save-document", isAuth, AccessControllers.saveDocument);
router.delete("/log-out", isAuth, AccessControllers.logOut);

router.get("/", isAuth, AccessControllers.getUserAuth);
router.put("/", isAuth, AccessControllers.updatePersonalUserInfoAuth);
router.delete("/", isAuth, AccessControllers.deleteAccount);

export default router;
