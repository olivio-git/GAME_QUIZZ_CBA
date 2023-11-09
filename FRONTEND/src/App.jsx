import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage';
import NotFound from './components/404';
import DashboardPage from './components/DashboardPage';
import DashboardLayout from './layouts/DashboardLayout';
import HomeLayout from './layouts/HomeLayout';
import GameInProgress from './components/GameInProgress';
const code = false;
function App() {
  const ProtectedRoutes = ({ children }) => {
    if (code) {
      return children;
    } else {
      return <Navigate to="/home" ></Navigate>;
    }
  }
  return (
    <Routes>
      <Route path='/' element={
        <HomeLayout />} >
        <Route path='/' element={<HomePage></HomePage>} ></Route>
        <Route path='/gameprogress/:id' element={<GameInProgress></GameInProgress>} ></Route>
      </Route>
      <Route path='/dasboard' element={
        <ProtectedRoutes>
          <DashboardLayout>
            <DashboardPage></DashboardPage>
          </DashboardLayout>
        </ProtectedRoutes>
      } ></Route>
      <Route path='*' element={<NotFound></NotFound>} ></Route>
    </Routes>
  )
}

export default App
