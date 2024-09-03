import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function PublishVideo() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [thumnail, setThumnail] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const from = new FormData()
    from.append('title', title)
    from.append('description', description)
    from.append('videoFile', videoFile)
    from.append('thumnail', thumnail)
    console.log(from)

    try {
      const response = await axios.post('/api/v1/videos', from, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        },)
    
      console.log(response.data)
      navigate('/')
    } catch (error) {
      console.error("Registration failed", error);
    }




  }


  return (
    <div className='container mx-auto max-w-3xl'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Publish Video</h1>
        <form className="bg-transparent shadow-md rounded px-8 pt-6 pb-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
            <input
              className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Enter video description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoFile">Video File</label>
            <input
              className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="videoFile"
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">Thumbnail</label>
            <input
              className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="thumbnail"
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={(e) => setThumnail(e.target.files[0])}
              required
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="shadow appearance-none border rounded w-full py-4 px-3 bg-blue-500 text-white leading-tight focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PublishVideo
