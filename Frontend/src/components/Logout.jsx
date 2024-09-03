// import { useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

        const handleLogout = async () => {
            try {
                // Make the logout API call
                await axios.post('/api/v1/users/logout');
                // Redirect the user to the login page
                navigate('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };
        
         // Call the async function to logout
 // Add navigate to the dependency array

    // const handleLogout = async () => {
    //     try {
    //         const response = await axios.post('/api/v1/users/logout');
    //         console.log(response.data);
    //         navigate('/login');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <div>
            <button type="button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;
