const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const staff = require('../middleware/staff');
const { customerSchema, customerUpdateSchema } = require('../validation/customerValidation');
const { validateRequest } = require('../utils/validation');

const router = express.Router();

const { Customer } = db.sequelize.models;

router.get('/', [auth, staff], async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).send(customers);
  } catch (err) {
    res.status(500).send(err.message);
  }  
});

router.get('/:id', [auth], async (req, res) => {
  let id = Number(req.params.id);
  try {
    if (req.user.user.role === 'customer' && req.user.user.custId !== id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const customer = await Customer.findByPk(id);
    res.status(200).send(customer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', [auth, staff, validateRequest(customerSchema)], async(req, res) => {
  try {
    const customer = await Customer.create(req.validatedData);
    return res.status(201).send(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });  
  }
});

router.put('/:id', [auth, validateRequest(customerUpdateSchema)], async (req, res) => {
  let id = Number(req.params.id);
  try {
    if (req.user.user.role === 'customer' && req.user.user.custId !== id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    await Customer.update(req.validatedData, {where: { custid: id }});
    const updatedCustomer = await Customer.findByPk(id);
    res.status(200).send(updatedCustomer);
  } catch (err) {
    res.status(500).send(err.message);    
  }
});

router.delete('/:id', [auth, staff], async (req, res) => {
  let id = Number(req.params.id);
  try {
    await Customer.destroy({ where: { custid: id}});
    res.status(204).send();
  } catch (err) { 
    res.status(500).send(err.message);
  }
});

module.exports = router;
