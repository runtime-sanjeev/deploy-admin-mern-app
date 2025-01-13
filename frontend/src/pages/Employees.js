import { React, useState} from 'react'
import Header from '../component/header';
import Sidebar from '../component/sidebar';
import '../component/tab.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import { handleError, handleSuccess } from '../utils';

function Employees() {
    const [step, setStep] = useState(1);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        personalDetails: {
            name: '',
            fatherName: '',
            motherName: '',
            age: '',
            gender: '',
        },
        communicationDetails: {
            address: '',
            state: '',
            city: '',
            pincode: '',
            mobile: ''
        },
        educationDetails: {
            secondary: '',
            intermediate: '',
            graduation: '',
            postGraduation: '',
        },
        professionalDetails: {
            currentJob: '',
            photo: null,
            resume: null,
        },
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const validate = (data, fields) => {
        const newErrors = {};    
        fields.forEach((field) => {
            if (!data[field]) {
                newErrors[field] = `${field} is required`;
            } else {
                // Min and Max validations for specific fields
                if (field === 'name' && (data[field] < 3 || data[field] > 20)) {
                newErrors[field] = 'Name must be between 3 and 20 characters long';
                }
                if (field === 'fatherName' && (data[field] < 3 || data[field] > 20)) {
                    newErrors[field] = 'Father Name must be between 3 and 20 characters long';
                }
                if (field === 'motherName' && (data[field] < 3 || data[field] > 20)) {
                    newErrors[field] = 'Mother Name must be between 3 and 20 characters long';
                }
                if (field === 'age' && (data[field] < 18 || data[field] > 65)) {
                    newErrors[field] = 'Age must be between 18 and 65';
                }
                if (field === 'mobile' && (data[field].length < 10 || data[field].length > 10)) {
                    newErrors[field] = 'Mobile number must be exactly 10 digits';
                }
                if (field === 'pincode' && (data[field].length < 6 || data[field].length > 6)) {
                    newErrors[field] = 'Pincode must be exactly 6 digits';
                }
                if (field === 'secondary' && (data[field].length < 1 || data[field].length > 10)) {
                    newErrors[field] = 'Secondary Grade / Marks Percentage must be between 1 and 10 characters long';
                }
                if (field === 'intermediate' && (data[field].length < 1 || data[field].length > 10)) {
                    newErrors[field] = 'Intermediate Grade / Marks Percentage must be between 1 and 10 characters long';
                }
                if (field === 'graduation' && (data[field].length < 1 || data[field].length > 10)) {
                    newErrors[field] = 'Graduation Grade / Marks Percentage must be between 1 and 10 characters long';
                }
                if (field === 'postGraduation' && (data[field].length < 1 || data[field].length > 10)) {
                    newErrors[field] = 'Post Graduation Grade / Marks Percentage must be between 1 and 10 characters long';
                }
            }
        });
    
        return newErrors;
    };
    
    
    const handleNext = () => {
        let currentErrors = {};
        switch (step) {
            case 1:
                currentErrors = validate(formData.personalDetails, ['name', 'fatherName', 'motherName', 'age', 'gender']);
                break;
            case 2:
                currentErrors = validate(formData.communicationDetails, ['address', 'state', 'city', 'pincode', 'mobile']);
                break;
            case 3:
                currentErrors = validate(formData.educationDetails, ['secondary', 'graduation']);
                break;
            case 4:
                currentErrors = validate(formData.professionalDetails, ['currentJob']);
                break;
            default:
                break;
        }
        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
        } else {
            setErrors({});
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        setStep(step - 1);
    };

    const handleChange = (e, category) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [category]: {
                ...prevFormData[category], // Preserve other properties in the category
                [name]: value, // Update the specific field
            },
        }));
    };

    
      const handleImageChange = (e,  category) => {
          const selectedPhoto = e.target.files[0];
          if (!selectedPhoto) return;
          
          const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
          const maxFileSize = 5 * 1024 * 1024;
          
          if (!allowedImageTypes.includes(selectedPhoto.type)) {
            return console.log('Please upload a valid image file (JPEG, PNG, GIF).');
          }
          if (selectedPhoto.size > maxFileSize) {
            return console.log('File size exceeds the 5MB limit.');
          }       
          setFormData({
                    ...formData,
                    [category]: {
                        ...formData[category],
                        photo: selectedPhoto,
                    },
                });
        
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(selectedPhoto);
        };

        // Handle Document file change
    
      const onFileChange = (e, category) => {
        const selectedFile = e.target.files[0];
        const allowedFileTypes = ['application/pdf', 'application/msword'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB file size limit
        if (selectedFile && !allowedFileTypes.includes(selectedFile.type)) {
          return console.log('Please upload a valid document (PDF, DOC).');
        }
        if ((selectedFile && selectedFile.size > maxFileSize)) {
          return console.log('File size exceeds the 5MB limit.');
        }
        setFormData({
            ...formData,
            [category]: {
                ...formData[category],
                resume: selectedFile,
            },
        });
      };

    const handleSubmit = async () => {       
        setIsSubmitting(true);
        const data = new FormData();
        // Append personal details
        data.append('personalDetails', JSON.stringify(formData.personalDetails));
        // Append communication details
        data.append('communicationDetails', JSON.stringify(formData.communicationDetails));
        // Append education details
        data.append('educationDetails', JSON.stringify(formData.educationDetails));
        // Append professional details
        data.append('professionalDetails', JSON.stringify({ currentJob: formData.professionalDetails.currentJob }));
        // Append files
        data.append('photo', formData.professionalDetails.photo);
        data.append('resume', formData.professionalDetails.resume);

        try {
            const response = await fetch('https://deploy-admin-mern-app-1.vercel.app/auth/employees', {
                method: 'POST',
                body: data,
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }
            // if (response.ok) {
                const result = await response.json();
                const { success, message, error } = result;
                if(success){
                    handleSuccess(message);
                    console.log(message);
                    setTimeout(() => {
                        navigate('/employee');
                    }, 5000);
                }else if (error) {
                        const details = error?.details[0].message;
                        console.log(details);
                      } else {
                        handleError(message);
                        console.log(message);
                      }            
        } catch (error) {
            console.error('Error submitting form:', error);
            handleError(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const renderStep = () => {
        switch (step) {
            case 1:
  return (
    <div>
        
                        <h2>Personal Details</h2>
                        
                        <label htmlFor="name">Name<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="name"
                        type="text" 
                        value={formData.personalDetails.name || ''} 
                        placeholder="Name" 
                        onKeyDown={(e) => {
                            if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace') {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) => handleChange(e, 'personalDetails')} 
                        />
                        {errors.name && <p className="error">{errors.name}</p>}

                        <label htmlFor="fatherName">Father Name<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="fatherName" 
                        type="text"
                        value={formData.personalDetails.fatherName || ''} 
                        placeholder="Father Name" 
                        onChange={(e) => handleChange(e, 'personalDetails')} 
                        onKeyDown={(e) => {
                            if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace') {
                                e.preventDefault();
                            }
                        }}
                        />
                        {errors.fatherName && <p className="error">{errors.fatherName}</p>}

                        <label htmlFor="motherName">Mother Name<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="motherName" 
                        type="text"
                        value={formData.personalDetails.motherName || ''} 
                        onKeyDown={(e) => {
                            if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace') {
                                e.preventDefault();
                            }
                        }}
                        placeholder="Mother Name" 
                        onChange={(e) => handleChange(e, 'personalDetails')} 
                        />
                        {errors.motherName && <p className="error">{errors.motherName}</p>}
                        

                        <label htmlFor="age">Age<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="age" 
                        value={formData.personalDetails.age || ''} 
                        placeholder="Age" 
                        type="text" 
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { 
                                handleChange(e, 'personalDetails');
                            }
                        }} 
                        />
                        {errors.age && <p className="error">{errors.age}</p>}

                        <label htmlFor="gender">Gender<span style={{ color: 'red' }}>*</span></label>
                        <select name="gender" value={formData.personalDetails.gender || ''} onChange={(e) => handleChange(e, 'personalDetails')}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Transgender</option>
                        </select>
                        {errors.gender && <p className="error">{errors.gender}</p>}
                    </div>
  );
  case 2:
                return (
                    <div>
                        <h2>Communication Details</h2>
                        <label htmlFor="address">Address<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="address" 
                        type="text" 
                        value={formData.communicationDetails.address || ''} 
                        placeholder="Address" 
                        onChange={(e) => handleChange(e, 'communicationDetails')} 
                        />
                        {errors.address && <p className="error">{errors.address}</p>}

                        <label htmlFor="state">State<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="state" 
                        type="text" 
                        value={formData.communicationDetails.state || ''} 
                        placeholder="State" 
                        onChange={(e) => handleChange(e, 'communicationDetails')} 
                        onKeyDown={(e) => {
                            if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace') {
                                e.preventDefault();
                            }
                        }}
                        />
                        {errors.state && <p className="error">{errors.state}</p>}

                        <label htmlFor="city">City<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="city" 
                        type="text" 
                        value={formData.communicationDetails.city || ''} 
                        placeholder="City" 
                        onChange={(e) => handleChange(e, 'communicationDetails')} 
                        onKeyDown={(e) => {
                            if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace') {
                                e.preventDefault();
                            }
                        }}
                        />
                        {errors.city && <p className="error">{errors.city}</p>}

                        <label htmlFor="pincode">Pincode<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="pincode" 
                        type="text" 
                        value={formData.communicationDetails.pincode || ''} 
                        placeholder="Pincode"                        
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { // Allow only digits
                                handleChange(e, 'communicationDetails');
                            }
                        }} 
                        />
                        {errors.pincode && <p className="error">{errors.pincode}</p>}

                        <label htmlFor="mobile">Mobile No.<span style={{ color: 'red' }}>*</span></label>
                        <input name="mobile" 
                        type="text"  
                        value={formData.communicationDetails.mobile || ''} 
                        placeholder="Mobile No."                        
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { // Allow only digits
                                handleChange(e, 'communicationDetails');
                            }
                        }}
                        />
                        {errors.mobile && <p className="error">{errors.mobile}</p>}

                    </div>
                );
                case 3:
                    return (
                        <div>
                            <h2>Education Details</h2>
                            <label htmlFor="secondary">Secondary Result In Grade/Percentage<span style={{ color: 'red' }}>*</span></label>
                            <input name="secondary" 
                            value={formData.educationDetails.secondary || ''} 
                            placeholder="Grade / Percentage" onChange={(e) => handleChange(e, 'educationDetails')} 
                            />
                            {errors.secondary && <p className="error">{errors.secondary}</p>}

                            <label htmlFor="intermediate">Intermediate Result In Grade/Percentage<span style={{ color: 'red' }}>*</span></label>
                            <input name="intermediate" 
                            value={formData.educationDetails.intermediate || ''} 
                            placeholder="Grade / Percentage" onChange={(e) => handleChange(e, 'educationDetails')} 
                            />
                            {errors.intermediate && <p className="error">{errors.intermediate}</p>}

                            <label htmlFor="Graduation">Graduation Result In Grade/Percentage<span style={{ color: 'red' }}>*</span></label>
                            <input name="graduation" 
                            value={formData.educationDetails.graduation || ''} 
                            placeholder="Grade / Percentage" 
                            onChange={(e) => handleChange(e, 'educationDetails')} 
                            />
                            {errors.graduation && <p className="error">{errors.graduation}</p>}

                            <label htmlFor="postGraduation">Post Graduation Result In Grade/Percentage<span style={{ color: 'red' }}>*</span></label>
                            <input name="postGraduation" 
                            value={formData.educationDetails.postGraduation || ''} 
                            placeholder="Grade / Percentage" 
                            onChange={(e) => handleChange(e, 'educationDetails')} 
                            />
                            {errors.postGraduation && <p className="error">{errors.postGraduation}</p>}
                        </div>
                    );
                case 4:
                    return (
                        <div>
                            <h2>Document Details</h2>
                            <label htmlFor="currentJob">Current Job Designation<span style={{ color: 'red' }}>*</span></label>
                            <input
                                name="currentJob" 
                                type="text" 
                                value={formData.professionalDetails.currentJob || ''}
                                placeholder="Current Job Designation" 
                                onChange={(e) => handleChange(e, 'professionalDetails')} 
                                />
                                {errors.currentJob && <p className="error">{errors.currentJob}</p>}
                                <div>
                                    {previewImage && (
                                    <div>
                                        <h3>Preview Image:</h3>
                                        <img src={previewImage} alt="Preview" style={{ width: "200px" }} />
                                    </div>
                                    )}
                                    <div>
                                    
                                    </div>
                                    <label htmlFor = "photo">Upload Photo:<span style={{color:"red"}}>*</span></label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="photo"
                                        onChange={(e) => handleImageChange(e, 'professionalDetails')}
                                    />
                                    </div>
                                <label htmlFor = "file">Upload Resume Document:<span style={{color:"red"}}>*</span></label>
                                <input 
                                type="file"
                                name="resume"
                                onChange={(e) => onFileChange(e, 'professionalDetails')}
                            />
                        </div>
                    );
                default:
                    return null;
                }
            };
            return (
                
                <div >
                    <Header />
                    <div className="content-container flex">
                    <Sidebar/>
                    <aside className="main_content flex-1 p-4">
                    <div className="tabs">
                    <div className="tab-content">{renderStep()}</div>
                    <div className="tab-navigation">
                        {step > 1 && <button onClick={handlePrev}>Previous</button>}
                        {step < 4 && <button onClick={handleNext}>Next</button>}
                        {step === 4 && ( <button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>)}
                    </div>
                </div>
                 <ToastContainer />
                </aside>
                </div>
                </div>
            );
}

export default Employees