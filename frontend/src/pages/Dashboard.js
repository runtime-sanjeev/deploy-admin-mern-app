import React from 'react'
import Sidebar from '../component/sidebar';
import Header from '../component/header';
function Dashboard() {
  return (
    <div>
        <Header/>
        <div className="content-container">     
        <Sidebar/>   
        <aside className="main_content">
        <div className='container'>
        <h1>dashboard</h1>
        </div>
        </aside>
        </div>
    </div>
  )
}  

export default Dashboard;