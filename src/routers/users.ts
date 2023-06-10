import { Router } from 'express';
import controllers from '../controllers';
import { checkAuth } from '../utils/middlewares';

const router = Router();

router.get('/users', checkAuth, controllers.users.list);
router.post('/login', controllers.users.login);
router.post('/register', checkAuth, controllers.users.register);

export default router;
