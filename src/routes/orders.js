const express = require ('express');
const db = require ('../models');
const auth = require('../middleware/auth');
const staff = require('../middleware/staff');


const router = express.Router();

const { Order, staff } = db.sequelize.models;

router.get('/', [ auth, staff], async (req, res) => {
  // log out that the endpoint was hit
  console.log('/api/v1/orders - GET');
  try {
    const orders = await Order.findAll();
    console.log(orders);
    // Send back a message
    res.status(200).send(orders);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }  
});

router.get('/:id', [ auth, staff], async (req, res) => {
  console.log('/api/v1/orders/:id - GET');
  let id = Number(req.params.id);

  try {
    const order = await Order.findByPk(id);

    if (!Order) {
      return res.status(404).json({ error: 'Order Not Found'});
    }

    // Check role if customer
    if (req.user.role === 'customer' && order.id !== req.user.custid) {
        return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).send(order);

  } catch (err) {
    console.log(err);
    res.status(500).send({erroe: 'Order Not Found'});
  }
});

router.post('/', [ auth, staff], async (req, res) => {
  console.log('/api/v1/orders - POST');

  try {
    const { deliveryAddress, paymentMethod, status } = req.body

    const neworder = await Order.create({
        deliveryAddress,
        paymentMethod,
        status,
        custid: req.user.id,
        total
    });

    return res.status(201).json(neworder);

  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Server Error');
  }
});

router.put('/:id', [ auth, staff], async (req, res) => {
  console.log('api/v1/orders/:id - PUT');
  let id = Number(req.params.id);
  try {
    await Order.update(req.body, {where: { orderId: id }});
    const updatedOrder = await Order.findByPk(id);
    res.status(200).send(updatedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.delete('/:id', [ auth, staff], async (req, res) => {
  console.log('/api/v1/orders/:id - DELETE');
  let id = Number(req.params.id);
  try {
    await Order.destroy({ where: { orderId: id}});
    res.status(204).send();
  } catch (err) { 
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;