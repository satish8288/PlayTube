const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  const response = {
    success: false,
    statusCode,
    message,
  };

  if (err.errors?.length) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};

export { errorHandler };
