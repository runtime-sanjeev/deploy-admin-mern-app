import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import { handleError, handleSuccess } from '../utils';
import Sidebar from '../component/sidebar';
import Header from '../component/header';
function Registration() {
   const [loggedInUser, setLoggedinUser] = useState('');
   const [loggedSid, setloggedSid] = useState('');
  const [regnInfo, setRegnInfo] = useState({
    empname: '',
    fname: '',
    mname: '',
    mobile: '',
    dob: "",
    sex: "",
    state: "",
    city: "",
    photo: null,
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // Handle Document file change

  // const onFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const allowedFileTypes = ['application/pdf', 'application/msword'];
  //   const maxFileSize = 5 * 1024 * 1024; // 5MB file size limit
  //   if (file && !allowedFileTypes.includes(file.type)) {
  //     return handleError('Please upload a valid document (PDF, DOC).');
  //   }
  //   if ((file && file.size > maxFileSize)) {
  //     return handleError('File size exceeds the 5MB limit.');
  //   }
  //   setRegnInfo(prev => ({
  //     ...prev,
  //     file: file,  // Update the file property
  //   }));
  // };

  // Handle Image file change

  const handleImageChange = (e) => {
    const selectedPhoto = e.target.files[0];
    if (!selectedPhoto) return;
    
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxFileSize = 5 * 1024 * 1024;
    
    if (!allowedImageTypes.includes(selectedPhoto.type)) {
      return handleError('Please upload a valid image file (JPEG, PNG, GIF).');
    }
    if (selectedPhoto.size > maxFileSize) {
      return handleError('File size exceeds the 5MB limit.');
    }
  
    setRegnInfo(prev => ({
      ...prev,
      photo: selectedPhoto,
    }));
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(selectedPhoto);
  };
  

  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegnInfo(prev => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  // Fetch logged-in user details from localStorage
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData) {
      setLoggedinUser(storedUserData.name);
      setloggedSid(storedUserData.id);
    }
  }, []);

  // const validateDob = (dob) => {
  //   const today = new Date();
  //   const birthDate = new Date(dob);
  //   const age = today.getFullYear() - birthDate.getFullYear();
  //   const m = today.getMonth() - birthDate.getMonth();
  //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age >= 18;
  // };
  

    // setLoggedinUser(user); 
    // setloggedSid(uid);
  // Handle registration form submission
  const handleRegn = async (e) => {
    e.preventDefault();
    const { empname, fname, mname, mobile, dob, sex,state, city } = regnInfo;

    // Check if required fields are filled
    if (!empname || !fname || !mname || !mobile || !dob || !sex || !state || !city ) {
      const missingFields = [];
      if (!empname) missingFields.push('Name');
      if (!fname) missingFields.push('Father Name');
      if (!mname) missingFields.push('Mother Name');
      if (!mobile) missingFields.push('Mobile No');
      // if (!file) missingFields.push('Document');
      if (!sex) missingFields.push('sex');
      if (!dob) missingFields.push('dob');
      if (!state) missingFields.push('state');
      if (!city) missingFields.push('city');
      // if (!photo) missingFields.push('Photo');
      return handleError(`${missingFields.join(', ')} are required.`);
    }

    const formData = new FormData();
    formData.append('empname', empname);
    formData.append('name', loggedInUser);
    formData.append('sid', loggedSid);
    formData.append('fname', fname);
    formData.append('mname', mname);
    formData.append('mobile', mobile);
    // formData.append('file', file);
    formData.append("dob", dob);
    formData.append("sex", sex);
    formData.append("state", state);
    formData.append("city", city);
    // formData.append("photo", photo);

    setIsSubmitting(true);  // Disable submit button

    try {
      const url = "https://deploy-admin-mern-app-1.vercel.app/auth/registration";
      const response = await fetch(url, {
        method: "POST",      
        body: formData,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const { success, message, error } = result;
      console.log(response.success);
      if (success) {        
        handleSuccess(message);
        setTimeout(() => {
          navigate('/employee');
        }, 5000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);  // Re-enable submit button after the request
    }
  };

  return (
    <div>
      <Header/>
    <div className="content-container">
      <Sidebar/>
      <aside className="main_content">
      <div className='reg_container'>
      <h1>Registration</h1>
      <form onSubmit={handleRegn}>
        <div>
          <label htmlFor='name'>Name</label>
          <input type='text' name='empname' id='empname'  value={regnInfo.empname}  onChange={handleChange} />
        </div>
        <div>
          <label htmlFor='fname'>Father Name</label>
          <input
            type='text'
            name='fname'
            id='fname'           
            value={regnInfo.fname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='mname'>Mother Name</label>
          <input
            type='text'
            name='mname'
            id='mname'          
            value={regnInfo.mname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='mobile'>Mobile No</label>
          <input
            type='text'
            name='mobile'
            id='mobile'          
            value={regnInfo.mobile}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"          
            value={regnInfo.dob}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Sex:</label>
          <select
            name="sex"
            value={regnInfo.sex}            
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            className='textChange'
            value={regnInfo.state}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            className='textChange'
            value={regnInfo.city}
            onChange={handleChange}
          />
        </div>
        <div>
        {previewImage && (
          <div>
            <h3>Preview Image:</h3>
            <img src={previewImage} alt="Preview" style={{ width: "200px" }} />
          </div>
        )}
        <div>
          
        </div>
          <label>Upload Photo:</label>
          <input
            type="file"
            accept="image/*"
            name="photo"
            onChange={handleImageChange}
          />
        </div>
        
        {/* <div>
          <label>Upload Document</label>
          <input type="file" name='file' onChange={onFileChange}  />
        </div>
        <button type='submit' className='btncls' disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button> */}
        {/* <button onClick={handleLogout} className='buttonLog'>Logout</button> */}
      </form>
      <ToastContainer />
    </div>
    </aside>
    </div>
    </div>
  );
}

export default Registration;
