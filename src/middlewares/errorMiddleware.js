const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {

  // Temporary but harmless to leave in: logs the real error to your
  // terminal so a 500 is never a black box again.
  console.error(err);

  // Zod validation errors were previously falling through to the
  // generic 500 branch below (ZodError has no .statusCode), which is
  // why bad registration input surfaced as "Server error. Please try
  // again later." instead of telling the user what was actually
  // wrong. Handle it explicitly as a 400 with per-field messages.
  if (err instanceof ZodError) {

    const errors = {};

    err.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    });

    return res.status(400).json({
      success: false,
      message: "Please check your input and try again.",
      errors,
    });

  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;