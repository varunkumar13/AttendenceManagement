// import React from 'react'
import './App.css'
import ResponsiveAppBar from './components/topbar/topbar';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className='app'>
      <div className='fixed'><ResponsiveAppBar /></div>
 <div style={{ overflow: "auto", height: "81vh", padding: "1rem" }}>
        <Outlet />   {/* Child routes will render here */}
      
       
 
       
       
      </div>
      <div className='fixed'>
      <Footer />
      </div>
    </div>
  )
}

export default App
