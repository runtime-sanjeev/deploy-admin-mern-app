import React, { useEffect, useState } from 'react';
import Sidebar from '../component/sidebar';
import Header from '../component/header';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
// import { handleError, handleSuccess } from '../utils';
// import { useNavigate } from 'react-router-dom';



function Employee() {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // To store the success message
  const [errorMessage, setErrorMessage] = useState(''); // To store the success message
  // const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [resumeAvailable, setResumeAvailable] = useState(true);
  

  const [selectedEmployee, setSelectedEmployee] = useState({
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
    const handleSuccess = (message) => {
          setSuccessMessage(message); // Store the success message in state
      };
    
      const handleError = (message) => {
        setErrorMessage(message); // Store the success message in state
    };
  
  const validate = (data, fields) => {
    // alert('dd');
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

  useEffect(() => {
    Modal.setAppElement('#root');

    const fetchData = async () => {
      try {
        const response = await fetch('https://deploy-admin-mern-app-1.vercel.app/auth/employee');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setUsers(data);
        setFilteredData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);

    const filtered = users.filter((item) =>
      Object.values(item.personalDetails).some((value) =>
        value?.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredData(filtered);
  };



  const handleEdit = async (row) => {
    try {
      const response = await fetch('https://deploy-admin-mern-app-1.vercel.app/auth/editemployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row._id }),
      });

      const data = await response.json();
      if (data) {
        setSelectedEmployee(data);
      
        setModalIsOpen(true);
      } else {
        handleError('Employee data not found');
      }
    } catch (error) {
      handleError('Error during edit');
    }
  };

  const fetchDataAndUpdateTable = async () => {
    try {
        const response = await fetch('https://deploy-admin-mern-app-1.vercel.app/auth/employee'); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const updatedData = await response.json();
        setFilteredData(updatedData); 
        setSelectedEmployee(null); 
        
        } catch (error) {
            console.error('Error fetching updated data:', error);
        }
};
  const handleNext = () => {
    let currentErrors = {};
    switch (step) {
        case 1:
            currentErrors = validate(selectedEmployee.personalDetails, ['name', 'fatherName', 'motherName', 'age', 'gender']);
            break;
        case 2:
            currentErrors = validate(selectedEmployee.communicationDetails, ['address', 'state', 'city', 'pincode', 'mobile']);
            break;
        case 3:
            currentErrors = validate(selectedEmployee.educationDetails, ['secondary', 'graduation']);
            break;
        case 4:
            currentErrors = validate(selectedEmployee.professionalDetails, ['currentJob']);
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
  setSelectedEmployee((prevFormData) => ({
      ...prevFormData,
      [category]: {
          ...prevFormData[category], // Preserve other properties in the category
          [name]: value, // Update the specific field
      },
  }));
};

const handleImageChange = (e, category) => {
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

  // Update state to include the selected photo
  setSelectedEmployee({
    ...selectedEmployee,
    [category]: {
      ...selectedEmployee[category],
      photo: null, // Clear the existing photo first
    },
  });

  const reader = new FileReader();
  reader.onloadend = () => {
    setPreviewImage(reader.result); // Set the preview image
    setSelectedEmployee((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        photo: selectedPhoto, // Update with the new photo
      },
    }));
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
  if (selectedFile && selectedFile.size > maxFileSize) {
    return console.log('File size exceeds the 5MB limit.');
  }

  // Update the state with the new resume
  setSelectedEmployee({
    ...selectedEmployee,
    [category]: {
      ...selectedEmployee[category],
      resume: selectedFile, // Set the selected file
    },
  });

  // Optionally, set visibility state to hide the button
  setResumeAvailable(false);
};

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEmployee(null);    
  };

  const handleSubmit = async () => {       
          setIsSubmitting(true);
          const data = new FormData();
          data.append('id',selectedEmployee._id)
          // Append personal details
          data.append('personalDetails', JSON.stringify(selectedEmployee.personalDetails));
          // Append communication details
          data.append('communicationDetails', JSON.stringify(selectedEmployee.communicationDetails));
          // Append education details
          data.append('educationDetails', JSON.stringify(selectedEmployee.educationDetails));
          // Append professional details
          data.append('professionalDetails', JSON.stringify({ currentJob: selectedEmployee.professionalDetails.currentJob }));
          // Append files
          data.append('photo', selectedEmployee.professionalDetails.photo);
          data.append('resume', selectedEmployee.professionalDetails.resume);
  
          try {
              const response = await fetch('https://deploy-admin-mern-app-1.vercel.app/auth/updateemployee', {
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
                       // Refresh the DataTable after success
                        await fetchDataAndUpdateTable(); // Make sure this function updates the `data` prop for your DataTable
                        
                        // Reset modal and step state
                        setTimeout(() => {
                            setSuccessMessage('');
                            setModalIsOpen(false);
                            setStep(1); // Reset to the first step
                        }, 1000);
                                                            
                        // fetchDataAndUpdateTable(); // Call a function to fetch the latest data                       
                  }else if (error) {
                    const details = error?.details[0].message;
                    console.log(details);
                  } else {
                    handleError(message);
                    console.log(message);
                    setTimeout(() => setErrorMessage(''), 5000);
                  }            
          } catch (error) {
              console.error('Error submitting form:', error);
              handleError(error);
          } finally {
              setIsSubmitting(false);
          }
      };
 
  if (loading) {
    return (
      <div className="loading-container flex items-center justify-center min-h-screen">
        <img
          src="https://i.gifer.com/Vp3R.gif"
          alt="Loading"
          className="loading-gif w-16 h-16"
        />
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  if (users.length === 0) return <div>No employee data available</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="content-container flex">
        <Sidebar />
        <aside className="main_content flex-1 p-4">
        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="failed-message">
            <p>{errorMessage}</p>
          </div>
        )}
          <div className="tblcontainer bg-white rounded-lg shadow-lg p-4">
            <div className="empheader mb-4">
              <h1 className="text-xl font-bold">Employee Details</h1>
              <div className="mt-2 flex items-end">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  style={{ maxWidth: '20%' }}
                />
              </div>
            </div>
            <div className="empbody">
              <DataTable
                columns={[
                  {
                    name: 'Name',
                    selector: (row) => row.personalDetails.name,
                    sortable: true,
                  },
                  {
                    name: 'Father Name',
                    selector: (row) => row.personalDetails.fatherName,
                    sortable: true,
                  },
                  {
                    name: 'Mother Name',
                    selector: (row) => row.personalDetails.motherName,
                    sortable: true,
                  },
                  {
                    name: 'Mobile',
                    selector: (row) => row.communicationDetails.mobile,
                    sortable: true,
                  },
                  {
                    name: 'Uploaded Document',
                    cell: (row) => (
                      <button
                        type="button"
                        onClick={() => window.open(`https://deploy-admin-mern-app-1.vercel.app/${row.professionalDetails.resume}`, '_blank')}
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                      >
                        View Document
                      </button>
                    ),
                    sortable: false,
                  },
                  {
                    name: 'Uploaded Image',
                    cell: (row) => (
                      <button
                        type="button"
                        onClick={() => window.open(`https://deploy-admin-mern-app-1.vercel.app/${row.professionalDetails.photo}`, '_blank')}
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                      >
                        View Image
                      </button>
                    ),
                    sortable: false,
                  },
                  {
                    name: 'Action',
                    cell: (row) => (
                      <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        className="btn-ed focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5"
                      >
                        Edit
                      </button>
                    ),
                    sortable: false,
                  },
                ]}
                data={filteredData}
                pagination
                paginationPerPage={10}
                responsive
                highlightOnHover
              />

            {selectedEmployee && (
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Employee Details"
                className="modal-content"
                overlayClassName="modal-overlay"
                shouldCloseOnOverlayClick={false}
              >
                {(() => {
                  const renderStep = () => {
                    switch (step) {
                      case 1:
                        return (
                          <div>
                            <h2>Personal Details</h2>
                            <label htmlFor="name">
                              Name<span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                              name="name"
                              type="text"
                              value={selectedEmployee.personalDetails.name || ''}
                              onChange={(e) => handleChange(e, 'personalDetails')} 
                              placeholder="Name"
                              onKeyDown={(e) => {
                                if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace') {
                                  e.preventDefault();
                                }
                              }}
                            />
                            {errors.name && <p className="error">{errors.name}</p>} 

                            <label htmlFor="fatherName">Father Name<span style={{ color: 'red' }}>*</span></label>
                            <input 
                            name="fatherName" 
                            type="text"
                            value={selectedEmployee.personalDetails.fatherName || ''} 
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
                        value={selectedEmployee.personalDetails.motherName || ''} 
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
                        value={selectedEmployee.personalDetails.age || ''} 
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
                        <select name="gender" value={selectedEmployee.personalDetails.gender || ''} onChange={(e) => handleChange(e, 'personalDetails')}>
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
                        value={selectedEmployee.communicationDetails.address || ''} 
                        placeholder="Address" 
                        onChange={(e) => handleChange(e, 'communicationDetails')} 
                        />
                        {errors.address && <p className="error">{errors.address}</p>}

                        <label htmlFor="state">State<span style={{ color: 'red' }}>*</span></label>
                        <input 
                        name="state" 
                        type="text" 
                        value={selectedEmployee.communicationDetails.state || ''} 
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
                        value={selectedEmployee.communicationDetails.city || ''} 
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
                        value={selectedEmployee.communicationDetails.pincode || ''} 
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
                        value={selectedEmployee.communicationDetails.mobile || ''} 
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
                            value={selectedEmployee.educationDetails.secondary || ''} 
                            placeholder="Grade / Percentage" onChange={(e) => handleChange(e, 'educationDetails')} 
                            />
                            {errors.secondary && <p className="error">{errors.secondary}</p>}

                            <label htmlFor="intermediate">Intermediate Result In Grade/Percentage<span style={{ color: 'red' }}>*</span></label>
                            <input name="intermediate" 
                            value={selectedEmployee.educationDetails.intermediate || ''} 
                            placeholder="Grade / Percentage" onChange={(e) => handleChange(e, 'educationDetails')} 
                            />
                            {errors.intermediate && <p className="error">{errors.intermediate}</p>}

                            <label htmlFor="Graduation">Graduation Result In Grade/Percentage<span style={{ color: 'red' }}>*</span></label>
                            <input name="graduation" 
                            value={selectedEmployee.educationDetails.graduation || ''} 
                            placeholder="Grade / Percentage" 
                            onChange={(e) => handleChange(e, 'educationDetails')} 
                            />
                            {errors.graduation && <p className="error">{errors.graduation}</p>}

                            <label htmlFor="postGraduation">Post Graduation Result In Grade/Percentage<span style={{ color: 'red' }}>*</span></label>
                            <input name="postGraduation" 
                            value={selectedEmployee.educationDetails.postGraduation || ''} 
                            placeholder="Grade / Percentage" 
                            onChange={(e) => handleChange(e, 'educationDetails')} 
                            />
                            {errors.postGraduation && <p className="error">{errors.postGraduation}</p>}
                          </div>
                        );
                      case 4:
                        return (
                          <div>
                            <h2>Professional Details</h2>
                            <label htmlFor="currentJob">Current Job Designation<span style={{ color: 'red' }}>*</span></label>
                            <input
                                name="currentJob" 
                                type="text" 
                                value={selectedEmployee.professionalDetails.currentJob || ''}
                                placeholder="Current Job Designation" 
                                onChange={(e) => handleChange(e, 'professionalDetails')} 
                                />
                                {errors.currentJob && <p className="error">{errors.currentJob}</p>}

                                <div>
                                <div className="flex flex-col items-center">
                                      {previewImage ? (
                                        <img
                                          src={previewImage} // Use the preview image if available
                                          alt="Preview"
                                          className="w-32 h-32 object-cover rounded-md border border-gray-200"
                                        />
                                      ) : selectedEmployee?.professionalDetails?.photo ? (
                                        <img
                                          src={`https://deploy-admin-mern-app-1.vercel.app/tmp${selectedEmployee.professionalDetails.photo}`} // Fallback to existing photo
                                          alt="Preview"
                                          style={{ width: "200px" }}
                                          className="w-32 h-32 object-cover rounded-md border border-gray-200"
                                        />
                                      ) : (
                                        <span>No photo available</span>
                                      )}
                                      <h3>Uploaded Image:</h3>
                                    </div>
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
                                 

                                  <div>
                                    {resumeAvailable && selectedEmployee?.professionalDetails?.resume ? (
                                      <>
                                        <label htmlFor="uploaded Image">Uploaded Resume</label>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            window.open(
                                              `https://deploy-admin-mern-app-1.vercel.app/tmp${selectedEmployee.professionalDetails.resume}`,
                                              '_blank'
                                            )
                                          }
                                          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 mx-40"
                                        >
                                          View Document
                                        </button>
                                      </>
                                    ) : null}
                                  </div>

                                  <div>
                                  <label htmlFor = "file">Upload Resume Document:<span style={{color:"red"}}>*</span></label>
                                <input 
                                type="file"
                                name="resume"
                                onChange={(e) => onFileChange(e, 'professionalDetails')}
                            />
                                  </div>
                          </div>
                        );
                      default:
                        return null;
                    }
                  };

                return (
                  <div>
                    {renderStep()}
                    <div className="tab-navigation">
                      {step > 1 && <button onClick={handlePrev}>Previous</button>}
                      {step < 4 && <button onClick={handleNext}>Next</button>}
                      {step === 4 && (
                        <button onClick={handleSubmit} disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                      )}

                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                      Close
                    </button>
          </div>
        </div>
      );
    })()}
  </Modal>
)}

            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
export default Employee;
