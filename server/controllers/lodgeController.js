import Lodge from "../models/Lodge.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";

/*
    @desc    Get all lodges
    @route   GET /api/lodges
    @access  Public
*/

export const getLodges = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit", "search"];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  let query = Lodge.find(JSON.parse(queryStr));
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    query = query.or([
      { name: searchRegex },
      { location: searchRegex },
      { description: searchRegex },
    ]);
  }

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Lodge.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);
  const lodges = await query;
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: lodges.length,
    pagination,
    data: lodges,
  });
});

/*
    @desc    Get single lodge
    @route   GET /api/lodges/:id
    @access  Public
*/

export const getLodge = asyncHandler(async (req, res, next) => {
  const lodge = await Lodge.findById(req.params.id);

  if (!lodge) {
    return next(
      new ErrorResponse(`Lodge not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: lodge,
  });
});

/*
    @desc    Create new lodge
    @route   POST /api/lodges
    @access  Private (Manager, Admin)
*/

export const createLodge = asyncHandler(async (req, res, next) => {
  req.body.manager = req.user.id;

  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to create a lodge`,
        403
      )
    );
  }

  const lodge = await Lodge.create(req.body);

  res.status(201).json({
    success: true,
    data: lodge,
  });
});

/*
    @desc    Update lodge
    @route   PUT /api/lodges/:id
    @access  Private (Manager, Admin)
*/

export const updateLodge = asyncHandler(async (req, res, next) => {
  let lodge = await Lodge.findById(req.params.id);

  if (!lodge) {
    return next(
      new ErrorResponse(`Lodge not found with id of ${req.params.id}`, 404)
    );
  }

  if (lodge.manager.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this lodge`,
        403
      )
    );
  }

  lodge = await Lodge.findByIdAndUpdate(req.params.id, req.body, {
    // new: true,
    // runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: lodge,
  });
});

/*
    @desc    Delete lodge
    @route   DELETE /api/lodges/:id
    @access  Private (Manager, Admin)
*/

export const deleteLodge = asyncHandler(async (req, res, next) => {
  const lodge = await Lodge.findById(req.params.id);

  if (!lodge) {
    return next(
      new ErrorResponse(`Lodge not found with id of ${req.params.id}`, 404)
    );
  }

  if (lodge.manager.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this lodge`,
        403
      )
    );
  }

  await lodge.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/*
    @desc    Get featured lodges
    @route   GET /api/lodges/featured
    @access  Public
*/

export const getFeaturedLodges = asyncHandler(async (req, res, next) => {
  const lodges = await Lodge.find({ featured: true }).limit(6);

  res.status(200).json({
    success: true,
    count: lodges.length,
    data: lodges,
  });
});
