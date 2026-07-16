const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const { cycleSchema } = require("../validators/cycle.validator");

const {
  createCycle: createCycleService,
  getUserCycles,
  getCycleById,
  updateCycle: updateCycleService,
  deleteCycle: deleteCycleService,
} = require("../services/cycle.service");

// Create Cycle
exports.createCycle = asyncHandler(async (req, res) => {
  const validatedData = cycleSchema.parse(req.body);

  const cycle = await createCycleService(req.user._id, validatedData);

  res.status(201).json(
    new ApiResponse(201, "Cycle created successfully", cycle)
  );
});

// Get All Cycles
exports.getCycles = asyncHandler(async (req, res) => {
  const cycles = await getUserCycles(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Cycles fetched successfully", cycles)
  );
});

// Get Single Cycle
exports.getCycle = asyncHandler(async (req, res) => {
  const cycle = await getCycleById(req.user._id, req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Cycle fetched successfully", cycle)
  );
});

// Update Cycle
exports.updateCycle = asyncHandler(async (req, res) => {
  const validatedData = cycleSchema.partial().parse(req.body);

  const updatedCycle = await updateCycleService(
    req.user._id,
    req.params.id,
    validatedData
  );

  res.status(200).json(
    new ApiResponse(200, "Cycle updated successfully", updatedCycle)
  );
});

// Delete Cycle
exports.deleteCycle = asyncHandler(async (req, res) => {
  await deleteCycleService(req.user._id, req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Cycle deleted successfully")
  );
});