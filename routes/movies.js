const movieRouter = require('express').Router();
const { validateSaveMovie, validateDeleteMovie } = require('../middlewares/reqValidation');

const {
  getMovies,
  saveMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateSaveMovie, saveMovie);
movieRouter.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = movieRouter;
