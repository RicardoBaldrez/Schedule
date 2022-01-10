const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

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

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.passwordRegister = bcryptjs.hashSync(this.body.passwordRegister, salt);

    try {
      this.user = await UsersModel.create(this.body);
    } catch (error) {
      console.log(error);
    }
  }

  async userExists() {
    const user = await UsersModel.findOne({ email: this.body.email });
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

module.exports = RegisterUser;