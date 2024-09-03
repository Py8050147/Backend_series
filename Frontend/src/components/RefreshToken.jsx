import { useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function RefreshToken() {
    // const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const refreshToken = async () => {
            const response = await axios.post('/api/v1/users/refresh-token')
            console.log(response.data)
            // setCurrentUser(response.user)
            navigate('/profile')
        }

        refreshToken()
    }, [navigate])
    

  return (
    <div>
      
    </div>
  )
}

export default RefreshToken
