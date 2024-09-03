import { useEffect, useState } from 'react'
import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

function Profile() {
  const [user, setUser] = useState(null)
    // const navigate = useNavigate()
    useEffect(() => {
        ; (async() => {
           try {
               const response = await axios.get('/api/v1/users/current-user')
               console.log(response)
             setUser(response.data.data)
            //  navigate('/')
           } catch (error) {
            console.log("Failed to fetch user data", error);
           }
        })()
    }, [])
    if (!user) return <div>Loading...</div>;
  return (
    <div className='container mt-52'>
      <img src={user.coverImage} alt="Cover" className='min-w-20 h-40'/>
      <img src={user.avatar} alt="Avatar"  className='w-40 h-40 border rounded-full'/>
      <h1 className='text-gray-300'>Welcome, {user.username}</h1>
      <h1 className='text-gray-300'>Welcome, {user.fullname}</h1>
      <p className='text-gray-300'>Email: {user.email}</p>
      
    </div>
  )
}

export default Profile
