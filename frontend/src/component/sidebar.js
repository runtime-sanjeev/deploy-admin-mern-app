import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [loggedInUser, setLoggedinUser] = useState('');
    // const [loggedEmail, setloggedEmail] = useState('');
    // const [loggedSid, setloggedSid] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('user'));
        const user = storedUserData?.name;
        // const uid = storedUserData?.id;
        // const uemail = storedUserData?.email;
        
        if (user) {
          setLoggedinUser(user);
        //   setloggedEmail(uemail);
        //   setloggedSid(uid);
        } else {
          navigate('/login');
        }
      }, [navigate]);
      // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    
    navigate('/login');
  };
    return(
        <>
            <aside className="sidebar min-h-screen" >
                <p>Hello {loggedInUser}</p>
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/employee">Employee List</a></li>
                    <li><a href="/registration">Add Employee</a></li>
                    <li><a href="/signup">Add Admin User</a></li>
                    <li><a href="/report">Reports</a></li>
                    <li><button  className='buttonLog' onClick={handleLogout}>Logout</button></li>
                    {/* Add more sidebar menu items here */}
                </ul>
                </aside>
        </>
    )
}
export default Sidebar;