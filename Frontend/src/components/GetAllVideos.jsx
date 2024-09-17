import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GetAllVideos() {
  const navigate = useNavigate();
  const [getvideos, setGetVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/v1/videos");
        const videos = response.data.data.video || []; // Fallback to empty array if no data
        setGetVideos(videos);
        console.log(videos);
      } catch (err) {
        setError("Failed to fetch videos. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="w-full min-h-screen px-20 py-[115px]">
        <div className="flex align-middle justify-center border border-red-800 ">
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-4 flex gap-5">
          {Array.isArray(getvideos) && getvideos.length > 0 ? (
            getvideos.map((getvideo) => (
              <div key={getvideo._id} className="card card-compact bg-base-100 w-96 shadow-xl mb-4">
                <iframe className="w-full aspect-video ..." src={getvideo.videoFile} alt={getvideo.title}></iframe>
                <div className="card-body">
                  <h2 className="card-title">{getvideo.title}</h2>
                  <p>{getvideo.description}</p>
                  <div className="card-actions justify-end">
                    <button onClick={() => navigate(`/video/${getvideo._id}`)} className="btn btn-primary">
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && <p>No videos available</p> // Only show if not loading
          )}
          </div>
          </div>
      </div>
    </>
  );
}

export default GetAllVideos;
