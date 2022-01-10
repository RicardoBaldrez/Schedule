const RegisterUser = require('../models/RegisterUserModel');

exports.index = (req, res) => {
  res.render('login');
}

exports.register = async (req, res) => {
  try {
    const register = new RegisterUser(req.body);
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