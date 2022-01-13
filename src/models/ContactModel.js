const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false, defalt: '' },
  email: { type: String, required: false, defalt: '' },
  tel: { type: String, required: false, defalt: '' },
  created: { type: Date, defalt: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contact.prototype.register = function() {
  this.valid();
};

Contact.prototype.valid = function() {
  this.cleanUp();
  if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
}

Contact.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    name: this.body.name,
    lastName: this.body.lastName,
    email: this.body.email,
    tel: this.body.tel,
  };
}

module.exports = Contact;