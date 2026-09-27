const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {

  console.error(err);

  
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