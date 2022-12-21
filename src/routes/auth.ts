import { Router } from "express";
import { login, changePassword } from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", login);
//Change my password
router.post("/change-password", [checkJwt], changePassword);
export default router;