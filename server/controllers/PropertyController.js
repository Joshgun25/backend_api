const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');

let properties = [];
let nextId = 1;

const createProperty = asyncErrorHandler(async (req, res, next) => {
  const { title, description, address, price, status } = req.body;

  const property = {
    id: nextId++,
    title,
    description: description || '',
    address,
    price: Number(price),
    status: status || 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  properties.push(property);

  res.status(201).json({
    success: true,
    property,
  });
});

const getAllProperties = asyncErrorHandler(async (req, res, next) => {
  let filteredProperties = [...properties];

  if (req.query.status) {
    filteredProperties = filteredProperties.filter(
      (prop) => prop.status === req.query.status
    );
  }

  const totalCount = filteredProperties.length;
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  if (limit !== undefined) {
    if (limit < 1) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be a positive number',
      });
    }
    if (offset < 0) {
      return res.status(400).json({
        success: false,
        error: 'Offset must be a non-negative number',
      });
    }

    filteredProperties = filteredProperties.slice(offset, offset + limit);
  }

  res.status(200).json({
    success: true,
    count: filteredProperties.length,
    total: totalCount,
    limit: limit || null,
    offset: offset,
    properties: filteredProperties,
  });
});

const getPropertyById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const propertyId = parseInt(id);

  const property = properties.find((prop) => prop.id === propertyId);

  if (!property) {
    return next(new ErrorHandler('Property not found', 404));
  }

  res.status(200).json({
    success: true,
    property,
  });
});

const updateProperty = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const propertyId = parseInt(id);

  const propertyIndex = properties.findIndex((prop) => prop.id === propertyId);

  if (propertyIndex === -1) {
    return next(new ErrorHandler('Property not found', 404));
  }

  const existingProperty = properties[propertyIndex];

  const updatedProperty = {
    ...existingProperty,
    ...req.body,
    id: existingProperty.id,
    createdAt: existingProperty.createdAt,
    updatedAt: new Date().toISOString(),
  };

  if (req.body.price !== undefined) {
    updatedProperty.price = Number(req.body.price);
  }

  properties[propertyIndex] = updatedProperty;

  res.status(200).json({
    success: true,
    property: updatedProperty,
  });
});

const deleteProperty = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const propertyId = parseInt(id);

  const propertyIndex = properties.findIndex((prop) => prop.id === propertyId);

  if (propertyIndex === -1) {
    return next(new ErrorHandler('Property not found', 404));
  }

  properties.splice(propertyIndex, 1);

  res.status(200).json({
    success: true,
    message: 'Property deleted successfully',
  });
});

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
