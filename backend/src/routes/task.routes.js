import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import {
    create,
    getAll,
    getById,
    update,
    remove,
} from "../controllers/task.controller.js";
import {
    createTaskValidator,
    updateTaskValidator,
    taskIdValidator,
    validate,
} from "../validators/task.validator.js";

const router = Router();

router.use(authenticate);

router.post("/", createTaskValidator, validate, create);
router.get("/", getAll);
router.get("/:id", taskIdValidator, validate, getById);
router.put("/:id", taskIdValidator, updateTaskValidator, validate, update);
router.delete("/:id", taskIdValidator, validate, remove);

export default router;