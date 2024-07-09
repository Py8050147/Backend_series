import { asyncHandlar } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadonCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandlar (async (req, res) => {
//    return res.status(200).json({
//         message: "ok"
//     })
//get user details from frontend
//validation -not empty
//check if user already exists : username email  
//check for images, check for avatar
//upload then to clodinary, avatar
//create a user object - create entery in db
//remove password and refresh token field from response
// check for user creation
// return res

const {username, fullname, email, password} = req.body
// console.log("email", email, fullname, email, password);

if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required")
}

const existedUser = await User.findOne({
    $or: [ {username} ,  {email} ] || ""
})
    
    if (existedUser) {
        throw new ApiError(409, "User with email or username exits")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    // console.log(coverImageLocalPath)
    // console.log(avatarLocalPath)
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avter file is required")
    }

    const avatar = await uploadonCloudinary(avatarLocalPath)
    // const coverImage = coverImageLocalPath ?  await uploadonCloudinary(coverImageLocalPath) : null
    const coverImage = await uploadonCloudinary(coverImageLocalPath)
    
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

   const user = await User.create({
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        fullname
   })
    
    const createdUser = await User.findById(user._id).select(
       "-password -refreshToken"
    ).lean()
    
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export {registerUser}