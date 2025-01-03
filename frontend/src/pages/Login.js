import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'; 
import { handleError, handleSuccess } from '../utils';
// import ReCAPTCHA  from 'react-google-recaptcha';

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);  // Added loading state


  const handleChange = (e) => {
    const { name, value } = e.target;    
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    const { email, password } = loginInfo;

    // Check if fields are filled
    // if (!email || !password || !recaptchaToken) {
    if (!email || !password ) {
      const missingFields = [];      
      if (!email) missingFields.push("Email");
      if (!password) missingFields.push("Password");
      // if (!recaptchaToken) missingFields.push("Captcha");
      setLoading(false);  // End loading
      return handleError(`${missingFields.join(", ")} are required.`);
    }  

    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      const { success, message, jwtToken, name, id, email, error } = result;

      if (success) {
        // Store user info in localStorage
        const userData = { jwtToken, name, id, email };
        localStorage.setItem('user', JSON.stringify(userData));
        
        handleSuccess(message);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // Handle error responses
        const details = error?.details?.[0]?.message;
        handleError(details || message || "An error occurred during login.");
      }
    } catch (err) {
      handleError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);  // End loading
    }
  };

  return (
    <div className="container">
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">User</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            value={loginInfo.email} 
            placeholder="Enter your email" 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            value={loginInfo.password} 
            placeholder="Enter your password" 
            onChange={handleChange} 
          />
        </div>
        {/* <div>
          <ReCAPTCHA 
            sitekey="6LeQXqEqAAAAABplX00sKNQ2GfrhTdWzWZI0RP6c" // Replace with your site key
            onChange={onCaptchaChange}
          />
        </div> */}
        <button type="submit" className="btncls" disabled={loading}>
          {loading ? 'Logging in...' : 'Submit'}
        </button>
        {/* <span>New Here? <Link to="/signup">Sign Up</Link></span> */}
        {/* <span><Link to="/adminlogin">Admin Login</Link></span> */}
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
