import { Router } from "express"
import { noSessionMiddleware, checkRoleMiddleware } from "../middlewares/auth.js"
import { uploadProfile, uploadDocuments } from "../utils.js"
import { UsersController } from "../controllers/users.controller.js"

const router = Router()

// Obtener todos los usuarios (GET: http://localhost:8080/api/users)
router.get("/", noSessionMiddleware, checkRoleMiddleware(["admin"]), UsersController.getUsers)

// Obtener un usuario por ID (GET: http://localhost:8080/api/users/uid)
router.get("/:uid", noSessionMiddleware, UsersController.getUserById)

// Actualizar un usuario (PUT: http://localhost:8080/api/users/uid)
router.put("/:uid", noSessionMiddleware, uploadProfile.single("avatar"), UsersController.updateUser)

// Eliminar un usuario (DELETE: http://localhost:8080/api/users/uid)
router.delete("/:uid", noSessionMiddleware, UsersController.deleteUser)

// Eliminar usuarios inactivos (DELETE: http://localhost:8080/api/users)
router.delete("/", noSessionMiddleware, checkRoleMiddleware(["admin"]), UsersController.deleteInactiveUsers)

// Modificar rol del usuario (PUT: http://localhost:8080/api/users/premium/uid)
router.put("/premium/:uid", noSessionMiddleware, checkRoleMiddleware(["admin"]), UsersController.modifyRole)

// Subir documentos (POST: http://localhost:8080/api/users/uid/documents)
router.post("/:uid/documents", noSessionMiddleware, uploadDocuments.fields([
    { name: "identification", maxCount: 1 },
    { name: "address", maxCount: 1 },
    { name: "account_statement", maxCount: 1 }
]), UsersController.uploadUserDocuments)

export { router as usersRouter }