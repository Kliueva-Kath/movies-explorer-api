const errorMessages = {
  BadRequestErr: 'Переданы некорректные данные',
  NotFoundMovieErr: 'Запрашиваемый фильм не найден',
  ForbiddenErr: 'У вас нет прав на удаление этого фильма',
  NotFoundUserErr: 'Пользователь с таким id не найден',
  ExistingUserErr: 'Пользователь с таким email уже существует',
  AuthErr: 'Неправильные почта или пароль',
  NotFoundPageErr: 'Страница не найдена',
  ServerError: 'На сервере произошла ошибка',
  UrlError: 'Ошибка в url-адресе',
  TokenError: 'Произошла ошибка авторизации',
};

module.exports = errorMessages;
