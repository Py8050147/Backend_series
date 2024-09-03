import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
// import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  // note: get all videos based on query, sort, pagination
  try {
    const filter = {};
    if (query) {
      filter.$or = [
        {
          title: { $regex: query, $options: "i" },
        },
        {
          descriptions: { $regex: query, $options: "i" },
        },
      ];
    }
    if (userId && isValidObjectId(userId)) {
      filter.owner = userId;
    }

    const sortOptions = {};
    if (sortBy && sortType) {
      sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
    }

    // const aggrigate =  Video.aggregate([
    //   { $match: filter },
    //  { $sort: sortOptions }
    // ])

    // const options = {
    //   page: parseInt(page),
    //   limit: parseInt(limit)
    // };

    // const video = await Video.aggregatePaginate(aggrigate, options)

    //   const video =  await Video.aggregatePaginate(query, {
    //         page: parseInt(page),
    //         limit: parseInt(limit),
    //         sort: sortOptions,
    //         skip: parseInt((page - 1) * limit)
    //   })

    const video = await Video.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalVideo = await Video.countDocuments(filter);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { video, totalVideo, page, limit },
          "Get all video successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error?.message || "Internal Server Error"));
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body
  console.log(req.body)
  // const videoFileLocalFilePath = req.files?.videoFile[0]?.path;
  // const thumbnailLocalPath = req.files?.thumbnail[0]?.path
  
  let videoFileLocalFilePath = '';
  if (req.files && req.files.videoFile && req.files.videoFile.length > 0) {
    videoFileLocalFilePath = req.files.videoFile[0].path;
  }
  if (!videoFileLocalFilePath) {
    throw new ApiError(400, "Video File Must be Required");
  }
  // fetch local thumbnail file path
  let thumbnailLocalFilePath = '';
  if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
    thumbnailLocalFilePath = req.files.thumbnail[0].path;
  }
  if (!thumbnailLocalFilePath) {
    throw new ApiError(400, "Thumbnail File Must be Required");
  }
  console.log(videoFileLocalFilePath, thumbnailLocalFilePath)



  // if (!isValidObjectId(videoFileLocalFilePath) || !isValidObjectId(thumbnailLocalFilePath)) {
  //   throw new ApiError(400, "video file and thumbnail is required");
  // }

  const videoFile = await uploadonCloudinary(videoFileLocalFilePath)
  const thumbnail = await uploadonCloudinary(thumbnailLocalFilePath)
  console.log(videoFile, thumbnail)
  // if (!isValidObjectId(videoFile) || !isValidObjectId(thumbnail)) {
  //   throw new ApiError(401, 'videoFile and thumbnail not found')
  // }

  // let duration = videoFile.duration

  const video = await Video.create({
    title, 
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFile.duration,
    owner: req.user?._id
  });

  return res.status(200).json(new ApiResponse(200, video, 'upload a video and thumbnail successfull'))

})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  // const userId = req.user?._id
  if (!isValidObjectId(videoId))
    throw new ApiError("Please Provide a Valid Video Id");
  const videoInfo = await Video.findById(videoId);
  if (!videoInfo) throw new ApiError("No Video Published with this id");

  return res
    .status(200)
    .json(new ApiResponse(200, videoInfo, "Video Successfully Fetched"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
  const { thumbnail, videoFile } = req.file?.path;

  if (!isValidObjectId(videoId))
    throw new ApiError("Please Provide a Valid Video Id");

  const videoInfo = await Video.findById(videoId);
  if (!videoInfo) throw new ApiError("No video Plublished with this id");

  const updateVideo = await Video.findByIdAndUpdate(
    {
      _id: videoId,
    },
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
        videoFile: videoFile.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "video update successfull"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId))
    throw new ApiError(404, "Please Provide a Valid Video Id");

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await uploadonCloudinary.destroy(video.video._id, { resource_type: "video" }); // Assuming destroy method exists in your Cloudinary utility
  await uploadonCloudinary.destroy(video.thumbnail._id);

  return res
    .status(200)
    .json(new ApiError(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;
  const updatedVideo = await video.save();

  return res.status(200).json(new ApiResponse(200, updatedVideo, message));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
