import GetVideoById from "../components/GetVideoById";
import { useParams } from "react-router-dom";

function VideoPage() {
    const { videoId } = useParams(); // Get videoId from the URL
    return <GetVideoById videoId={videoId} />;
}

export default VideoPage
