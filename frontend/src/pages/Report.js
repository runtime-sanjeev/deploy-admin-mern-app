import React from 'react'
import Header from '../component/header'
import Sidebar from '../component/sidebar'

function Report() {
  return (
    <div>
    <Header/>
      <div className='content-container '>
      <Sidebar/>
      <aside className="main_content flex-1 p-4">
        <div className='reg_container'>
        <h1>Employee Reports</h1>
        <p>Comming Soon</p>
        </div>
       </aside>
    </div>
    </div>
  )
}

export default Report