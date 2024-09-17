import axios from "axios";
import { useState, useEffect, useRef } from "react";
import videojs from "video.js"; // Import Video.js
import "video.js/dist/video-js.css"; // Import Video.js CSS

// eslint-disable-next-line react/prop-types
function GetVideoById({ videoId }) {
  const [video, setVideo] = useState(null); // Video object state
  const [error, setError] = useState(null); // Error handling state
  const videoPlayerRef = useRef(null); // Ref for the video player

  // Fetch video by ID automatically when component loads
  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) {
        setError("Video ID not found. Please provide a valid video ID.");
        return;
      }
      
      try {
        const response = await axios.get(`/api/v1/videos`, {
          params: {
            ID: `${videoId}`
          }
        }); // Fetch video by ID

        if (response.data && response.data.data.video.length > 0) {
          const videoData = response.data.data.video[0]; // Assuming the video data is in this path
          setVideo(videoData); // Set the video data
        } else {
          setError("Video not found. Please check the video ID.");
        }
      } catch (err) {
        setError("Error fetching video. Please try again later.");
        console.error("Error fetching video", err);
      }
    };

    fetchVideo();
  }, [videoId]); // Fetch video on component mount or when videoId changes

  // Initialize video.js after video is set
  useEffect(() => {
    if (video && videoPlayerRef.current) {
      const player = videojs(videoPlayerRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        sources: [
          {
            src: video.videoFile, // URL of the video file
            type: "video/mp4", // Set correct MIME type, adjust if needed
          },
        ],
      });

      // Clean up the player on unmount
      return () => {
        if (player) {
          player.dispose(); // Properly dispose the player instance
        }
      };
    }
  }, [video]); // Run the effect when the video is loaded

  return (
    <div className="conatiner max-w-4xl md:max-w-7xl py-24 px-20">
    <div className=" border border-red-700 py-20 max-w-[100%] min-h[10vh]">
      {error && <p className="text-red-500">{error}</p>} {/* Display error if any */}

      {video ? (
        <div>
          <h2>{video.title}</h2>
          {/* Video.js Player */}
            <div className="border border-black w-[800px] h-[400px]">
            <div data-vjs-player>
            <video
              ref={videoPlayerRef}
              className="video-js vjs-default-skin border border-red-800"
              controls
                preload="auto"
                // style={{ width: "640px", height: "240px" }}
                // style={{ maxWidth:"500px" }}
            ></video>
          </div>
            </div>
            <p>{video.description}</p>
        </div>
      ) : (
        !error && <p>Loading video...</p>
      )}
      </div>
      </div>
  );
}

export default GetVideoById;
