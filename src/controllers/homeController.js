const Contact = require('../models/ContactModel');

exports.index = async (req, res) => {
  const contacts = await Contact.searchAllContacts();
  res.render('index', { contacts });
}
