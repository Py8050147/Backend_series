// import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const { page = 1, limit = 10 } = req.query
    
    const comments = await Comment.find({ video: videoId })
        .skip(parseInt((page - 1) * limit))
        .limit(parseInt(limit || 10))
        .populate('owner', 'username avatar')
        .lean(); // Convert mongoose documents to plain JavaScript objects for better performance
    
    const totalComments = await Comment.countDocuments({ video: videoId })
    const totalpage = Math.ceil(totalComments / limit)
    
    return res
        .status(200)
        .json(new ApiResponse(200, {comments, totalpage, page, totalComments}, 'comment fetched successfully'))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body
    const owner = req.user?._id
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required");
    }
    const comment = await Comment.create({
        content,
        owner: owner,
        video: videoId
    })
    return res
        .status(201)
    .json(200, comment, "Comment added successfully")
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    const owner = req.user?._id

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
   

    const commentsUpdate = await Comment.findByIdAndUpdate(
        {
            _id: commentId,
            owner
        },
         {
             $set: {
                 content: content,
           }
        },
        {
            new: true,
            runValidators: true
         }
    )

   return res.status(200).json(new ApiResponse(200, commentsUpdate, "Comment updated successfully"));

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    const owner = req.user?._id
    const comment = await Comment.findOneAndDelete({_id: commentId, owner})
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

   return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }