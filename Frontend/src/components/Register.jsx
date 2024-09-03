import axios from 'axios'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
function Register() {
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [fullname, setFullname] = useState(null)
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('fullname', fullname)
    formData.append('avatar', avatar)
    formData.append('coverImage', coverImage)

    console.log(formData)

    try {
      const response = await axios.post('/api/v1/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        },)
    
      console.log(response.data)
      navigate('/login')
    } catch (error) {
      console.error("Registration failed", error);
    }
  }

  return (
    
      <>
       
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-400">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="/register" className="space-y-6" onSubmit={handleSubmit} >
            <div className=" flex align-middle gap-5">
            <div>
                <label htmlFor="avatar" className="block text-sm font-medium leading-6 text-gray-400">
                  Avatar
                </label>
                <div className="mt-2">
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    required
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="block w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 file:rounded-md file:p-1.5  file:bg-transparent file:text-gray-400 file:ring-1 file:cursor-pointer file:border-0 file:font-medium"
                  />
                </div>
            </div>
            <div>
                <label htmlFor="coverimage" className="block text-sm font-medium leading-6 text-gray-400">
                  CoverImage
                </label>
                <div className="mt-2">
                  <input
                    id="coverimage"
                    name="coverimage"
                    type="file"
                    required
                    onChange={(e) => setCoverImage(e.target.files[0])}
                    className="block w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 file:rounded-md file:p-1.5 file:bg-transparent file:text-gray-400 file:ring-1 file:cursor-pointer file:border-0 file:font-medium"
                  />
                </div>
              </div>
          </div>
          <div>
                <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-400">
                  Fullname
                </label>
                <div className="mt-2">
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                  required
                  onChange={(e) => setFullname(e.target.value)}
                    autoComplete="fullname"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-400">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
            </div>
           
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
                  onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
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
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
  

export default Register


 {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}


        /*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
