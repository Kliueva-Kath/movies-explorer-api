const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { validateLogin, validateCreateUser } = require('../middlewares/reqValidation');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const errorMessages = require('../utils/error-messages');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.all('*', () => {
  throw new NotFoundError(errorMessages.NotFoundPageErr);
});

module.exports = router;
