import { Router } from "express"
import { checkRoleMiddleware } from "../middlewares/auth.js"
import { UsersController } from "../controllers/users.controller.js"

const router = Router()

// Obtener todos los usuarios (GET: http://localhost:8080/api/users)
router.get("/", checkRoleMiddleware(["admin"]), UsersController.getUsers)

// Obtener un usuario por ID (GET: http://localhost:8080/api/users/uid)
router.get("/:uid", checkRoleMiddleware(["admin"]), UsersController.getUserById)

// Modificar rol del usuario (PUT: http://localhost:8080/api/users/premium/uid)
router.put("/premium/:uid", checkRoleMiddleware(["admin"]), UsersController.modifyRole)

export { router as usersRouter }