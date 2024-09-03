/**
 * Formats the success response with the provided data.
 *
 * @param {Object} res - The Express response object.
 * @param {Number} statusCode - HTTP status code.
 * @param {String} message - A message to include in the response.
 * @param {Object} data - The data to include in the response.
 */
const successResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  
  /**
   * Formats the error response with the provided error message.
   *
   * @param {Object} res - The Express response object.
   * @param {Number} statusCode - HTTP status code.
   * @param {String} message - A message to include in the response.
   * @param {Object} [error] - Optional error object or details.
   */
  const errorResponse = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      error
    });
  };
  
  module.exports = {
    successResponse,
    errorResponse
  };
  