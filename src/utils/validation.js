const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.validateAsync(req.body);
      req.validatedData = validatedData;
      next();
    } catch (err) {
      res.status(400).json({ error: err.details[0].message });
    }
  };
};

module.exports = { validateRequest };