const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const { feedbackSchema } = require('../validation/feedbackValidation');
const { validateRequest } = require('../utils/validation');

const router = express.Router();

const { Feedback } = db.sequelize.models;

router.get('/', auth, async (req, res) => {
  try {
    const feedbackList = await Feedback.findAll();
    res.status(200).send(feedbackList);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    res.status(200).send(feedback);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', [auth, validateRequest(feedbackSchema)], async (req, res) => {
  try {
    const feedback = await Feedback.create({
      ...req.validatedData,
      custid: req.user.user.custId
    });
    res.status(201).send(feedback);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', [auth, validateRequest(feedbackSchema)], async (req, res) => {
  try {
    await Feedback.update(req.validatedData, { where: { feedid: req.params.id } });
    const updatedFeedback = await Feedback.findByPk(req.params.id);
    res.status(200).send(updatedFeedback);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Feedback.destroy({ where: { feedid: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;