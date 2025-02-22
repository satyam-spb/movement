
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Server error' : err.message;
  
  res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
      validation: err.errors,
      path: req.path,
      timestamp: new Date().toISOString()
    }
  });
};