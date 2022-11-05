const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-req-err');
const AuthError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const errorMessages = require('../utils/error-messages');
const { JWT_SECRET_DEV } = require('../utils/devConfig');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.NotFoundUserErr);
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.NotFoundUserErr);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.BadRequestErr));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.ExistingUserErr));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hash,
    });
    res.send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(errorMessages.BadRequestErr));
    } else if (err.code === 11000) {
      next(new ConflictError(errorMessages.ExistingUserErr));
    } else {
      next(err);
    }
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(errorMessages.AuthErr);
      }
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
              { expiresIn: '7d' },
            );
            res.cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            }).send({ token }).end();
          } else {
            throw new AuthError(errorMessages.AuthErr);
          }
        });
    })
    .catch(next);
};
