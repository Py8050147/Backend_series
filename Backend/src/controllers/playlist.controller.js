import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {Video} from '../models/video.model.js'



const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    // const {playlistId} = req.params.id
    // if (!isValidObjectId(playlistId)) {
    //     throw new ApiError(404, "Playlist  not found")
    // }

    // const videoPlaylist = await Playlist.findById(playlistId)
    // if (condition) {
        
    // }

    //TODO: create playlist

    const cratePlaylist = await Playlist.create({
        name,
        description,
        user: req.user._id,
    })

    return res.status(200).json(new ApiResponse(200, cratePlaylist, 'Playlist successfull create'))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "Playlist  not found")
    }

    const playlists = await Playlist.findOne({user: userId})
    if (!playlists.length) {
        throw new ApiError(404, 'No playlists found for this user');
    }

    return res.status(200).json(200, playlists, 'No playlists found for this user')

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(401, 'playlistId not found')
    }

    const getplaylistinfo = await Playlist.findById(playlistId)
    if (!getplaylistinfo) {
        throw new ApiError(400, 'getplaylistinfo not found')
    }

   return res
    .status(200)
    .json(
      new ApiResponse(200, getplaylistinfo, "Playlist info successfully fetched.")
    );

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(404, 'Invalid playlist ID or video ID');
    }

    const video = await Video.findById({ _id: videoId })
    if (!video) {
        throw new ApiError(404, 'No video found with this video Id.');
    }

    const playlist = await Playlist.findByIdAndUpdate(
        {
            playlistId
        },
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }
    // if (playlist.videos.includes(videoId)) {
    //     throw new ApiError(400, 'Video already exists in the playlist');
    // }
    // playlist.videos.push(videoId)
    // await playlist.save()
    return res.status(200).json(new ApiResponse(200, playlist, "Added video to playlist"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
   if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(404, 'Invalid playlist ID or video ID')
    }
    
    const video = await Video.findById({ _id: videoId })
    if (!video) {
        throw new ApiError(404, 'No video found with this video Id.')
    }

    const playlist = await Playlist.findByIdAndUpdate(
        {
            playlistId
        },
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Removed video to playlist successfull"));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, 'please provide a valid playlist Id')
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if (!playlist) {
        throw new ApiError(404, 'Video not found');
    }

    return res
    .status(200)
  .json(new ApiError(200, {}, 'Video deleted successfully'))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "playlist id not found");
        
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(
        {
            _id: playlistId
        },
        {
            $set: {
                name,
                description,
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(new ApiResponse(200, updatePlaylist, 'Playlist update successfull'))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}