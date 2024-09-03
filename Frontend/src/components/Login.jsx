import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// import Profile from  './Profile.jsx'
// import axiosInstance from './axiosInstance'
  

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()


  const handlesubmit = async (e) => {
    e.preventDefault()
    
    const response = await axios.post('/api/v1/users/login', { email, password })
    // localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
    // JSON.parse(localStorage.getItem('accessToken'))['access_token']
    localStorage.setItem('accessToken', response.data.data.accessToken);
    // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
    console.log(response.data.data.accessToken)
    
    // this.setState({
    //   accessToken: response.data
    // })
    // const data = JSON.stringify(response)
    
    navigate('/')
    
    // return response.data;
     }
    // useEffect(() => {
      
  // }, [])
  
  // Profile()


    return (
    
        <>
         
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-24 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-400">
                Sign in to your account
              </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action="/login" method="post" className="space-y-6" onSubmit={handlesubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-400">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
                    />
                  </div>
                </div>
    
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-400">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4 outline-none"
                    />
                  </div>
                </div>
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
    
              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{' '}
                <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Start a 14 day free trial
                </a>
              </p>
            </div>
          </div>
        </>
      )
}

export default Login
