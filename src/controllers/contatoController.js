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

exports.edit = async (req, res) => {
  try {
    if(!req.params.id) return res.render('404');
    const contact = new Contact(req.body);
    await contact.edit(req.params.id);
    if(contact.errors.length > 0) {
      req.flash('errors', contact.errors);
      req.session.save(() => res.redirect('/contact'));
      return;
    }

    req.flash('success', 'Contato editado com sucesso');
    req.session.save(() => res.redirect(`/contact/${contact.contact._id}`));
    return;
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
}

exports.delete = async (req, res) => {
  if(!req.params.id) return res.render('404');
  const deleteContact = await Contact.delete(req.params.id);
  if(!deleteContact) return res.render('404');
  req.flash('success', 'Contato deletado com sucesso');
  req.session.save(() => res.redirect('/'));
}
