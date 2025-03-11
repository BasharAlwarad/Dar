import { Router } from 'express';
import multer from 'multer';

import { signinUser } from '../controllers/userControllers.js';

// import { auth } from '../middlewares/authMiddlewares.js';

const upload = multer({ storage: multer.memoryStorage() });
const userRouter = Router();

userRouter.post(`/auth/signin`, signinUser);

// userRouter.post(`/register`, upload.single('image'), createUser);
// userRouter.post(`/login`, loginUser);
// userRouter.post(`/logout`, logoutUser);
// userRouter.get(`/check-session`, auth, checkSession);
// userRouter.get(`/`, auth, getUsers);
// userRouter.get(`/:id`, auth, getUserById);
// userRouter.put(`/:id`, auth, updateUser);
// userRouter.delete(`/:id`, auth, deleteUser);

export default userRouter;
