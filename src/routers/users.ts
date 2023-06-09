import { Router } from "express";
import controllers from "../controllers";


const router = Router();

router.get('/users', controllers.users.list);

export default router;