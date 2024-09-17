
import './App.css'
// import GetAllVideos from './components/GetAllVideos'

import Header from './Header/Header'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <Header />
      {/* <GetAllVideos /> */}
      <Outlet />
  </>
  )
}

export default App
