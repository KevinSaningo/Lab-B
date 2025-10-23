const express = require('express');
const db = require('../models');

const bcrypt = require('bcrypt');
const Joi = require('joi');

const router = express.Router();

const { Customer, Staff } = db.sequelize.models;

router.post('/customer/login', async(req, res) => {
  console.log('/api/v1/auth/customer/login - POST');
  const { email, password} = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  try {
    const customer = await Customer.findOne({ where: { email: email }});
    if(!customer){
      return res.status(400).json({ errors: [{
        msg: 'Invalid Credentials'
      }] });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if(!isMatch){
      return res.status(400).json({ errors: [{
        msg: 'Invalid Credentials'
      }] });
    }
    const payload = {
      user: {
        custId: customer.custId,
        staffId: null,
        name: customer.name,
        email: customer.email,
        role: customer.role
      }
    }
    const token = await Customer.prototype.signToken(payload);
    console.log(token);
    res.status(200).json({token});
    
    
  } catch (err) {
    res.status(500).json({errors: [{ msg: 'Server Error'}] });
  }
});

router.post('/customer/register', async (req, res) => {
  console.log('/api/v1/auth/customer/register - POST');
  const { name, email, address, phone, password } = req.body;
  console.log(req.body);

   if (!password) {
    return res.status(400).json({ errors: [{ msg: 'Password is required' }] });
  }
  
  try {
    let customer = await Customer.findOne({ where: { email: email }});
    if(customer) {
      return res.status(400).json({ errors: [{ msg: 'User already registered' }] });
    }
    
    const hashedPassword = await Customer.prototype.hashPwd(password);
    console.log(hashedPassword);
   
    const newCust = {
      name,
      email,
      address,
      phone,
      password: hashedPassword
    }
    
    const custRes = await Customer.create({
      name: newCust.name,
      email: newCust.email,
      address: newCust.address,
      phone: newCust.phone,
      password: newCust.password
    });
    console.log(custRes);

    const payload = {
      user: {
        custId: custRes.custId,
        staffId: null,
        name: custRes.name,
        email: custRes.email,
        role: custRes.role
      }
    }
    const token = await Customer.prototype.signToken(payload);
    console.log(token);
    res.status(201).json({token});

  } catch (err) {
    console.log(err);
    res.status(500).json({errors: [{ msg: 'Server Error'}] });
  }
});

router.post('/staff/login', async(req, res) => {
  console.log('/api/v1/auth/staff/login - POST');
  const { email, password} = req.body;
  console.log(`Email: ${email}, Password: ${password}`);
  try {
    const staff = await Staff.findOne({ where: { email: email }});
    if(!staff){
      return res.status(400).json({ errors: [{
        msg: 'Invalid Credentials'
      }] });
    }
    const isMatch = await bcrypt.compare(password, staff.password);
    if(!isMatch){
      return res.status(400).json({ errors: [{
        msg: 'Invalid Credentials'
      }] });
    }
    const payload = {
      user: {
        custId: null,
        staffId: staff.staffId,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    }
     const token = await Customer.prototype.signToken(payload);
    console.log(token);
    res.status(200).json({token});
    
  } catch (err) {
    res.status(500).json({errors: [{ msg: 'Server Error'}] });
  }
});

router.post('/staff/register', async (req, res) => {
  console.log('/api/v1/staff/customer/register - POST');
  const { name, email, address, phone, password } = req.body;
  console.log(req.body);
  try {
    let staff = await Staff.findOne({ where: { email: email }});
    if(staff) {
      return res.status(400).json({ errors: [{ msg: 'Please login to the the account '}] });
    }

    const hashedPassword = await Customer.prototype.hashPwd(password);
    console.log(hashedPassword);
    const newStaff = {
      name,
      email,
      password: hashedPassword
    }
 
    const staffRes = await Staff.create({
      name: newStaff.name,
      email: newStaff.email,
      password: newStaff.password,
      role: newStaff.role
    });
    console.log(staffRes);
    const payload = {
      user: {
        custId: null,
        staffId: staffRes.staffId,
        name: staffRes.name,
        email: staffRes.email,
        role: staffRes.role
      }
    }
    const token = await Customer.prototype.signToken(payload);
    console.log(token);
    res.status(201).json({token});
        
  } catch (err) {
    res.status(500).json({errors: [{ msg: 'Server Error'}] });
  }
});

module.exports = router;
