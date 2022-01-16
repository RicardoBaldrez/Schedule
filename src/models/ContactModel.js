const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: false, defalt: '' },
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

Contact.prototype.register = async function() {
  this.valid();
  if(this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

Contact.prototype.valid = function() {
  this.cleanUp();
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.name) this.errors.push('Campo nome é obrigatório');
  if(!this.body.email && !this.body.tel) {
    this.errors.push('O contato precisa ter um email ou telefone para ser registrado');
  }
}

Contact.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }
  
  this.body = {
    name: this.body.name,
    lastname: this.body.lastname,
    email: this.body.email,
    tel: this.body.tel,
  };
}

Contact.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valid();
  if(this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true }); // { new: true } => para nos retornar os dados atualizado e não os antigos
}

// Methods statics
Contact.searchPerId = async (id) => {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findById(id);
  return contact;
}

Contact.searchAllContacts = async () => {
  // const contacts = await ContactModel.find({ email: 'ricardo.baldrez@gmail.com' }); -> Exemplo de filtro, buscando o contato que tem o email ricardo.baldrez@gmail.com
  const contacts = await ContactModel.find()
  .sort({ created: -1 }); // Ordenando pelo campo created e o -1 é para decrescente
  return contacts;
}

module.exports = Contact;