const express = require("express");
const PropertyController = require("../controllers/PropertyController");
const {
  validate,
  validateQuery,
  propertySchema,
  updatePropertySchema,
  propertyQuerySchema,
} = require("../middlewares/validation");

const router = express.Router();

router.post(
  "/",
  validate(propertySchema),
  PropertyController.createProperty
);

router.get(
  "/",
  validateQuery(propertyQuerySchema),
  PropertyController.getAllProperties
);

router.get(
  "/:id",
  PropertyController.getPropertyById
);

router.put(
  "/:id",
  validate(updatePropertySchema),
  PropertyController.updateProperty
);

router.delete(
  "/:id",
  PropertyController.deleteProperty
);

module.exports = router;
