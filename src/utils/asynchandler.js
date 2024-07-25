const asyncHandlar =  (requestHandlar) => {
    return (res, req, next) => {
    Promise.resolve(requestHandlar(res, req, next)).catch((err) => next(err))
   }
}

export {asyncHandlar}


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