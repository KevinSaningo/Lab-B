const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const staff = require('../middleware/staff');
const { productSchema } = require('../validation/productValidation');
const { validateRequest } = require('../utils/validation');

const router = express.Router();

const { Product } = db.sequelize.models;

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err.message);
  }  
});

router.get('/:id', async (req, res) => {
  let id = Number(req.params.id);
  try {
    const product = await Product.findByPk(id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', [auth, staff, validateRequest(productSchema)], async(req, res) => {
  try {
    const product = await Product.create(req.validatedData);
    return res.status(201).send(product);
  } catch (err) {
    res.status(500).json({ error: err.message });  
  }
});

router.put('/:id', [auth, staff], async (req, res) => {
  let id = Number(req.params.id);
  try {
    const product = await Product.update(req.body, {where: { prodid: id }});
    if(product){
      const newProd = await Product.findByPk(id);
      return res.status(200).send(newProd);
    } else {
      return res.status(400).json({ msg: "Product not updated"});
    }
  } catch (err) {
    res.status(500).send(err.message);    
  }
});

router.delete('/:id', [auth, staff], async (req, res) => {
  let id = Number(req.params.id);
  try {
    await Product.destroy({ where: { prodid: id}});
    res.status(204).send();
  } catch (err) { 
    res.status(500).send(err.message);
  }
});

router.get('/o/:field/:dir', async (req, res) => {
  const field = req.params.field;
  const dir = req.params.dir;
  const allowedFields = ['name', 'price', 'stock'];
  const allowedDirs = ['ASC', 'DESC'];
  
  if (!allowedFields.includes(field) || !allowedDirs.includes(dir.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid field or direction' });
  }
  
  try {
    const list = await Product.findAll({ order: [[ field, dir.toUpperCase() ]]});
    res.status(200).send(list);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

module.exports = router;