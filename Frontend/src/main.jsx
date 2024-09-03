
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
// import Profile from './components/Profile.jsx'
import Logout from './components/Logout.jsx'
import RefreshToken from './components/RefreshToken.jsx'
import Profile from './components/Profile.jsx'
import PublishVideo from './components/PublishVideo.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path:'logout',
        element: < Logout />
      },
      {
        path:'refresh-Token',
        element: <RefreshToken />
      },
      {
        path:'profile',
        element: <Profile />,
      },
      {
        path: 'publishAVideo',
        element: <PublishVideo />
    }
   
    ]
  }
])

// children: [
//   {
//     path: 'publishAVideo',
//     element: <PublishVideo />
// }
// ]

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)


// createRoutesFromElements(
//   <Route path='/' element={<App/>}>
//   <Route path='login' element={<Login />} />
//     <Route path='register' element={<Register />} />
//     <Route path='Logout' element={<Logout />} />
//     <Route path='refresh-Token' element={<RefreshToken />} />
//     <Route path='profile' element={<Profile />} children = {<Route path='publishAVideo' element={<PublishVideo />} />} />
    
//   </Route>
// )