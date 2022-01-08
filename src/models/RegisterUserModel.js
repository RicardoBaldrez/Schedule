const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordRegister: { type: String, required: true }
});

const UsersModel = mongoose.model('Users', UserSchema);

class RegisterUser {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.valid();
    if(this.errors.length > 0) return;
    try {
      this.user = await UsersModel.create(this.body);
    } catch (error) {
      console.log(error);
    }
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

module.exports = RegisterUser;