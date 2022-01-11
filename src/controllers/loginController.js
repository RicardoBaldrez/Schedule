const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  res.render('login');
}

exports.register = async (req, res) => {
  try {
    const register = new Login(req.body);
    await register.register();

    if(register.errors.length > 0) {
      req.flash('errors', register.errors);
      req.session.save(() => {
        return res.redirect('/login');
      })
      return;
    }

    req.flash('success', 'Seu usário foi criado com sucesso.');
    req.session.save(() => {
        return res.redirect('/login');
    })
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
}

exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.login();

    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(() => {
        return res.redirect('/login');
      })
      return;
    }

    req.flash('success', 'Você está logado com sucesso.');
    req.session.user = login.user;
    req.session.save(() => {
        return res.redirect('/login');
    })
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
}