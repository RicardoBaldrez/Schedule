const middlewareGlobal = (req, res, next) => {
  console.log('Passando pelo Middleware');
  next();
}

const checkCsrfError = (error, req, res, next) => {
  console.log('Checando erros CSRF');
  if(error) {
    return res.render('404');
  }
}

const csrfMiddleware = (req, res, next) => {
  console.log('CSRF criado e armazenado na variável local csrfToken');
  res.locals.csrfToken = req.csrfToken(); // Criando o token
  next();
}

module.exports = {
  middlewareGlobal,
  checkCsrfError,
  csrfMiddleware
}