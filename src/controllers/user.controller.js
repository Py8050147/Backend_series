import { asyncHandlar } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadonCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
       const accessToken =  user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()
        
        user.refreshToken = refreshToken
       await user.save({ validateBeforeSave: false })
        
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

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
    $or: [ {username} ,  {email} ]
})
    
    if (existedUser) {
        throw new ApiError(409, "User with email or username exits")
    }

    console.log(req.files)
    
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // console.log(coverImageLocalPath)
    // console.log(avatarLocalPath)
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
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

const loginUser = asyncHandlar(async (req, res) => {
    // req.body => data -compleate
    // username or email -compleate
    // find the user
    //password cheack
    // accesstoken and refreshtoken
    
    const { username, email, password } = req.body
    // if (!(username || email))
    if (!username && !email) {
        throw new ApiError(400, "username and email is required")
    }

   const user = await User.findOne({
        $or: [{username}, {email}]
   })
    
    if (!user) {
        throw new ApiError(404, "User does not exits")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    console.log({accessToken, refreshToken})
    const loggedInuser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInuser, accessToken, refreshToken
                },
                "User logged In Successfull"
        )
    )


})

const logoutUser = asyncHandlar(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandlar(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log("decodedToken", decodedToken)
        
        const user = await User.findById(decodedToken?._id)
        
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, " refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true // here problem and check the error
        }
    
       const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refeshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refesh token")
    }
})

const changeCurrentUser = asyncHandlar(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    // if (!(newPassword === confpassword)) {
    //     // this error throw
    // }
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed Successfully"))
})

const getCurrentUser = asyncHandlar(async (req, res) => {
    return res
        .status(200) 
        .json(200, req.user, "Current user fetched successfully")
})

const updateAccountDetails = asyncHandlar(async (req, res) => {
    const { fullname, email } = req.body
    
    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required")
    }

   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }
    ).select("-password")
    
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Update Account details successfully"))
})

const updateUserAvatar = asyncHandlar(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadonCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
        $set: {
        avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")
    return res.status(200).json(new ApiResponse(200, user, "Avatar updated is successfully "))
}) 

const updateUserCoverImage = asyncHandlar(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "coverImage file is missing")
    }

    const coverImage = await uploadonCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on coverImage")
    }

   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
        $set: {
        coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "cover image updated on successfully"))
}) 

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUser,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}