const asyncHandelar = (requestHandler) => {
    return (res, req, next) => {
    Promise.resolve(requestHandler(res, req, next)).catch((err) => next(err))
   }
}

export {asyncHandelar}


// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }