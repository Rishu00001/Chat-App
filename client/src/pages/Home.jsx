import React from 'react'
import Sidebar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'
import useSetCurrentUser from '../customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import { setOtherUsers } from '../redux/userSlice'
import useSetOtherUsers from '../customHooks/getOtherUsers'
import getMessages from '../customHooks/getMessages'
import { Navigate } from 'react-router-dom'

function Home() {
  let {userData} = useSelector((state)=>state.user)
  if(!userData) return <Navigate to="/login"/>
  if(userData) useSetOtherUsers();
  getMessages();
  return (
    <div className=' w-full h-[100dvh] flex overflow-hidden'>
      <Sidebar/>
      <MessageArea/>
    </div>
  )
}

export default Home;
