const asyncHandler = (requestHandler) => {
   return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
   };
};
const asyncHandlerGeneral = (fn) => {
   return (...args) => {
      // Return a new function that wraps the original async function
      return Promise.resolve(fn(...args)).catch((err) => {
         // Handle the error (e.g., log it or rethrow it)
         console.error("Error in async function:", err);
         throw err; // Rethrow the error if needed
      });
   };
};
export { asyncHandler, asyncHandlerGeneral };
