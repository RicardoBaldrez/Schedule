const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
  res.render('contact', {
    contact: {}
  });
}

exports.register = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.register();
    if(contact.errors.length > 0) {
      req.flash('errors', contact.errors);
      req.session.save(() => res.redirect('/contact'));
      return;
    }

    req.flash('success', 'Contato registrado com sucesso');
    req.session.save(() => res.redirect(`/contact/${contact.contact._id}`));
    return;
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
}

exports.editIndex = async (req, res) => {
  if(!req.params.id) return res.render('404');
  const user = await Contact.searchPerId(req.params.id);
  if(!user) return res.render('404');
  res.render('contact', { contact: user });
} 