import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'; 
import { handleError, handleSuccess } from '../utils';
import Sidebar from '../component/sidebar';
import Header from '../component/header';
function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const navigate = useNavigate();

  const handleSignup = async (e) =>{
     e.preventDefault();
    const { name, email, password } = signupInfo;

    // Check if fields are filled
    if (!name || !email || !password) {
      const missingFields = [];
      if (!name) missingFields.push("Name");
      if (!email) missingFields.push("Email");
      if (!password) missingFields.push("Password");
      return handleError(`${missingFields.join(", ")} are required.`);
    } 
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return handleError('Please enter a valid email address.');
    }

    if (password.length < 6) {
      return handleError('Password must be at least 6 characters long.');
    }

    setLoading(true);

      try {
          const url = "http://localhost:8080/auth/signup";
          const response = await fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupInfo)
          });
          const result = await response.json();          
          const { success, message, error } = result;
          setLoading(false);
           if(success){
            handleSuccess(message);
            setTimeout(()=>{
              navigate('/signup')
            },5000);
            setSignupInfo({ name: '', email: '', password: '' });
           } else if(error){
            const details = error?.details[0].message;
            handleError(details); // Show server error if signup failed
          }else {
            handleError(message);
          }
           console.log(result);
      } catch (err) {
        setLoading(false);
        handleError("An error occurred during signup. Please try again.");
      }
  }

  console.log('signupInfo ->', signupInfo);
  return (
    <div>
      <Header/>
      <div className='content-container'>
      <Sidebar/>

       <aside className="main_content">
        <div className='reg_container'>
        <h1>Add Admin User</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor='name'>Name</label>
           <input type='text' name='name' id='name' value={signupInfo.name} placeholder='Enter User name' onChange={handleChange} />
        </div>
        <div>
          <label htmlFor='email'>Email</label>
           <input  type='email' name='email' id='email' value={signupInfo.email} placeholder='Enter User email' onChange={handleChange} />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
           <input type='password' name='password' id='password' value={signupInfo.password} placeholder='Enter User password' onChange={handleChange} />
        </div>
        <button type='submit' className='btncls' disabled={loading}>{loading ? 'Adding User...' : 'Submit'}</button>
        
        {/* <span>Already have an account ?
          <Link to={"/login"}>Login</Link>
        </span> */}
      </form>
      <ToastContainer />
        </div>
       </aside>
    </div>
    </div>
  )
}

export default Signup