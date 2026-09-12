import express from 'express';
import * as usersCtrl from '../controllers/users.controller.js';
import { validateIdParam } from '../middlewares/validators.js';
<<<<<<< HEAD
=======
import authMiddleware from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
>>>>>>> 1f0e04a (feat: complete day11)

const router = express.Router();

router.post('/', usersCtrl.create);
<<<<<<< HEAD
router.get('/', usersCtrl.findMany);
router.get('/:id', validateIdParam, usersCtrl.findById);
router.put('/:id', validateIdParam, usersCtrl.update);
router.delete('/:id', validateIdParam, usersCtrl.remove);
=======
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), usersCtrl.findMany);
router.get('/:id', authMiddleware, validateIdParam, usersCtrl.findById);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), validateIdParam, usersCtrl.update);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), validateIdParam, usersCtrl.remove);
>>>>>>> 1f0e04a (feat: complete day11)

export default router;
