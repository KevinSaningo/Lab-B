const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const staff = require('../middleware/staff');

const router = express.Router();

const { Staff } = db.sequelize.models;

router.get('/', [auth, staff], async (req, res) => {
  try {
    const staffList = await Staff.findAll();
    res.status(200).send(staffList);
  } catch (err) {
    res.status(500).send(err.message);
  }  
});

router.get('/:id', [auth, staff], async (req, res) => {
  let id = Number(req.params.id);
  try {
    const staffMember = await Staff.findByPk(id);
    res.status(200).send(staffMember);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', [auth, staff], async(req, res) => {
  try {
    const staffMember = await Staff.create(req.body);
    return res.status(201).send(staffMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', [auth, staff], async (req, res) => {
  let id = Number(req.params.id);
  try {
    await Staff.update(req.body, {where: { staffId: id }});
    const updatedStaff = await Staff.findByPk(id);
    res.status(200).send(updatedStaff);
  } catch (err) {
    res.status(500).send(err.message);    
  }
});

router.delete('/:id', [auth, staff], async (req, res) => {
  let id = Number(req.params.id);
  try {
    await Staff.destroy({ where: { staffId: id}});
    res.status(204).send();
  } catch (err) { 
    res.status(500).send(err.message);
  }
});

module.exports = router;
