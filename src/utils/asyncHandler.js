// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(500).json({ message: error.message, success: false });
//     }
// };

const asyncHandler = (fn) => async (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}
export { asyncHandler };