const router = require('express').Router();
const { login, createUser, logout } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { validateLogin, validateCreateUser } = require('../middlewares/reqValidation');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const errorMessages = require('../utils/error-messages');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);
router.post('/signout', logout);

router.use(auth);

router.use('/', userRouter);
router.use('/', movieRouter);

router.all('*', () => {
  throw new NotFoundError(errorMessages.NotFoundPageErr);
});

module.exports = router;
