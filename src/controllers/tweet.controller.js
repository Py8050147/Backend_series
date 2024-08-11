import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    const userId = req.user.id
    
    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "User not found")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const createTweet = await User.create({
        content,
        owner: user._id
    })
   return res.status(201).json(new ApiResponse(201, createTweet, "Tweet created successfully" ));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user.id
    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "User not found")
    }

    const tweets = await Tweet.find({ owner: userId }).populate('owner', 'username');

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { content } = req.body
    const tweetId = req.params.id
    const userId = req.user.id
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Tweet not found")
    }
    
    // const tweet = await Tweet.findOne({ _id: tweetId, owner: userId });
    // if (!tweet) {
    //     throw new ApiError(404, "Tweet not found or you are not authorized to edit this tweet");
    // }
    

    const updateTweet = await Tweet.findByIdAndUpdate(
        {
            _id: tweetId,
            owner: userId
        },
        {
            $set: {
                content: content
            }
        },
        {
            new: true,
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updateTweet, "Tweet updated successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweetId = req.params
    const userId = req.user.id
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Tweet not found")
    }
    
    const tweet = await Tweet.findOneAndDelete({ _id: tweetId, owner: userId });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you are not authorized to delete this tweet");
    }

   return res.status(200).json(new ApiResponse(200, "Tweet deleted successfully"));


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}