const userRouter = require('express').Router();
const { validateUpdateUser } = require('../middlewares/reqValidation');

const {
  getMyUser,
  updateUser,
} = require('../controllers/users');

userRouter.get('/users/me', getMyUser);
userRouter.patch('/users/me', validateUpdateUser, updateUser);

module.exports = userRouter;
