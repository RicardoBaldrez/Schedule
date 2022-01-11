const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordRegister: { type: String, required: true }
});

const LoginModel = mongoose.model('Users', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.valid();

    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.passwordRegister = bcryptjs.hashSync(this.body.passwordRegister, salt);

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email });
    if(user) this.errors.push('Usuário já existe.');
  }

  valid() {
    this.cleanUp();
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    if(this.body.passwordRegister.length < 3 || this.body.passwordRegister.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      passwordRegister: this.body.passwordRegister
    };
  }
}

module.exports = Login;