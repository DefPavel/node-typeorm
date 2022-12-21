import { Router } from "express";
import { listAll, getOneById, newUser, editUser, deleteUser } from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
//Get all users
router.get("/", [checkJwt, checkRole(["ADMIN"])], listAll);
// Get one user
router.get(
    "/:id",
    [checkJwt, checkRole(["ADMIN"])],
    getOneById
);
//Create a new user
router.post("/",
    //[checkJwt, checkRole(["ADMIN"])],
    newUser);
//Edit one user
router.patch(
    "/:id",
    [checkJwt, checkRole(["ADMIN"])],
    editUser
);
//Delete one user
router.delete(
    "/:id",
    [checkJwt, checkRole(["ADMIN"])],
    deleteUser
);

export default router;