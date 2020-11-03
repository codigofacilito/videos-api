let bcrypt = require('bcrypt');
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        isEmail:{msg:"El valor no es un correo electrónico válido"},
        isUnique(email){
          return new Promise((res,rej)=>{
            User.findAll({ where: { email: email }, attributes: ['email'] })
              .then(docs => docs.length > 0 ? rej("El email ya está en uso") :  res())
              .catch(err => {
                rej(new Error("El email ya está en uso"))
              })
          })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {});

  User.findByCredentials = async function(params){
    let user = await User.findOne({ where: { email: params.user.email } });
    if(!user) return null;
    console.log(params.user.password,user.password)

    let result = await bcrypt.compare(params.user.password, user.password);
    if(result)
      return user;
    return null;
  }

  User.beforeSave(function (user) {
    return bcrypt.hash(user.password,10)
      .then(hash => {
        user.password = hash;
        console.log(hash);
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });
  
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};