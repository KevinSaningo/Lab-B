const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let db = {};
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
);


const Product = sequelize.define('Product', {
  prodid: 
  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  desc: { type: DataTypes.TEXT},
  image: {type: DataTypes.STRING},
  price: { type: DataTypes.DECIMAL(10, 2)},
  stock: { type: DataTypes.INTEGER}
});


const Customer = sequelize.define('Customer', {
  custid: 
  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  address: {type: DataTypes.STRING},
  phone: { type: DataTypes.STRING},
  password: { type: DataTypes.STRING, allowNull: false},
  role: { type: DataTypes.STRING, defaultValue: 'customer'}
});


const Staff = sequelize.define('Staff', {
  staffid: 
  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false},
  role: { type: DataTypes.STRING, defaultValue: 'staff'}
});


const Order = sequelize.define('Order', {
  orderid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    deliveryAddress: { type: DataTypes.STRING, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    status: { 
        type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'), 
        defaultValue: 'Pending' 
    },
  total: { type: DataTypes.DECIMAL(10, 2)}
});


const Feedback = sequelize.define('Feedback', {
  feedid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT },
  custid: { type: DataTypes.INTEGER, allowNull: false }
});


Customer.hasMany(Order, {foreignKey: 'custid'});
Order.belongsTo(Customer, {foreignKey: 'custid'});
Customer.hasMany(Feedback, {foreignKey: 'custid'});
Feedback.belongsTo(Customer, {foreignKey: 'custid'});



Customer.prototype.signToken = function(payload){
  const token = jwt.sign(payload, config.auth.jwtSecret, { 
    expiresIn: '7d',
    algorithm: 'HS512',
  });
  return token;
}

Customer.prototype.hashPwd = async function(password){
  const salt = await bcrypt.genSalt(11);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}


Staff.prototype.signToken = Customer.prototype.signToken;
Staff.prototype.hashPwd = Customer.prototype.hashPwd;


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
module.exports.Op = Sequelize.Op; 