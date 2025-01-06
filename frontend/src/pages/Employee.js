import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import  Modal  from 'react-modal';
// import { handleError } from '../utils';
import Sidebar from '../component/sidebar';
import Header from '../component/header';
import { useNavigate } from 'react-router-dom';

// Set the app element for the modal
// Modal.setAppElement('#root'); 

function Employee() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For handling errors
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store the selected employee details
  const [loggedSid, setloggedSid] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // To store the success message
  const [errorMessage, setErrorMessage] = useState(''); // To store the success message
  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered list for the search bar


    const [updateInfo, setUpdateInfo] = useState({
      empname: '',
      fname: '',
      mname: '',
      mobile: '',
      dob: "",
      sex: "",
      state: "",
      city: "",
      id: ""
    });
    const navigate = useNavigate();
    const handleSuccess = (message) => {
      setSuccessMessage(message); // Store the success message in state
     };

    const handleError = (message) => {
    setErrorMessage(message); // Store the success message in state
    };

    const [pagination, setPagination] = useState({
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10,
    });

 useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData) {     
      setloggedSid(storedUserData.id);
    }
  }, []);

// Disable scrolling when modal is open
useEffect(() => {
  if (modalIsOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  return () => {
    document.body.style.overflow = 'auto';
  };
}, [modalIsOpen]);

 // Handle input changes
 const handleChange = (e) => {
  e.preventDefault();
  const { name, value } = e.target;
  setUpdateInfo(prev => ({
    ...prev,
    [name]: value.toUpperCase(),
  }));
};

// Search functionality
const handleSearch = (event) => {
  const value = event.target.value.toLowerCase();
  setSearchTerm(value);

  const filteredData = users.filter((user) =>
    [user.empname, user.fname, user.mname, user.mobile]
      .join(' ')
      .toLowerCase()
      .includes(value)
  );
  setFilteredUsers(filteredData);

  // Reset pagination when searching
  setPagination((prev) => ({
    ...prev,
    currentPage: 1,
    totalPages: Math.ceil(filteredData.length / prev.itemsPerPage),
  }));
};

 // Paginate displayed data
 const paginateData = () => {
  const { currentPage, itemsPerPage } = pagination;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredUsers.slice(startIndex, endIndex);
};

// Handle pagination navigation
const handlePageChange = (newPage) => {
  setPagination((prev) => ({
    ...prev,
    currentPage: newPage,
  }));
};
  useEffect(() => {
    Modal.setAppElement('#root');  // Ensure the element exists
    // Fetch data from the Node.js backend API
    axios.get('https://deploy-admin-mern-app-1.vercel.app/auth/employee')
      .then(response => {
        const users = Array.isArray(response.data) ? response.data : [];
        setUsers(users);
        setFilteredUsers(users); // Initialize filteredUsers

       
        setPagination((prev) => ({
          ...prev,
          totalPages: Math.ceil(users.length / prev.itemsPerPage),
        }));
        setLoading(false); // Data fetched successfully
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data'); // Set error message
        setLoading(false); // End loading on error
      });
  }, []);

  // Columns to display in the table
  const columns = [
    {
      name: 'Name',
      selector: row => row.empname,
      sortable: true,
    },
    {
      name: 'Father Name',
      selector: row => row.fname, // Assuming 'fname' holds the position
      sortable: true,
    },
    {
      name: 'Mother Name',
      selector: row => row.mname, // Assuming 'fname' holds the position
      sortable: true,
    }
    ,
    {
      name: 'Mobile',
      selector: row => row.mobile, 
      sortable: true,
    },    
    {
      name: 'Uploaded Document',
      cell: (row) => (
        <button type="button" onClick={() => viewDoc(row)} class="focus:outline-none text-white bg-green-700
         hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-[0.675rem] px-5
          py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">View Document</button>
      ),
      sortable: true,
    },
    {
      name: 'Uploaded Image',
      cell: (row) => (
        <button type="button" onClick={() => viewImage(row)} class="focus:outline-none text-white
         bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium 
         rounded-lg text-[0.675rem] px-5 py-2.5 me-2 mb-2 dark:bg-green-600 
         dark:hover:bg-green-700 dark:focus:ring-green-800">View Image</button>

      ),
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button type="button" className="btfocus:outline-none text-white bg-purple-700
         hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg 
         text-[0.675rem] px-5 py-2.5 me-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 
         dark:focus:ring-purple-800nedt" onClick={(e) => handleEdit(row, e)}>Edit</button>
      ),
      sortable: false,
    },
  ];

  

  // Handle 'Edit button' button click
  const handleEdit = async (row, e) => {
    e.preventDefault();
   const id = row._id;
   try {
    const url = "https://deploy-admin-mern-app-1.vercel.app/auth/editemployee";
      const response = await fetch(url, {
        method: "POST",      
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();     
      // console.log(data);
      if (data) {
        setSelectedEmployee(data); // Store the fetched employee data
        setModalIsOpen(true); // Open the modal to display employee data
        setUpdateInfo({
          empname: data.empname,
          fname: data.fname,
          mname: data.mname,
          mobile: data.mobile,
          dob: data.dob,
          sex: data.sex,
          state: data.state,
          city: data.city,
          id: data._id,
        }); // Populate the updateInfo state as well
      }else{        
      console.error('Employee data not found');
      }
      } catch (error) {
        handleError('Error during edit:');   
        console.error('An error occurred while fetching the employee details.'); 
        
      }
  };

  // Handle 'Update Button' click event

  

  const handleUpdate = async (e) => {
    e.preventDefault();   
    const { empname, fname, mname, mobile, dob, sex,state, city, id } = updateInfo;    
        // Check if required fields are filled
        if (!empname || !fname || !mname || !mobile || !dob || !sex || !state || !city ) {
          const missingFields = [];
          if (!empname) missingFields.push('Name');
          if (!fname) missingFields.push('Father Name');
          if (!mname) missingFields.push('Mother Name');
          if (!mobile) missingFields.push('Mobile No');          
          if (!sex) missingFields.push('sex');
          if (!dob) missingFields.push('dob');
          if (!state) missingFields.push('state');
          if (!city) missingFields.push('city');         
          return handleError(`${missingFields.join(', ')} are required.`);
        }
    
    const formData = new FormData();
    formData.append('empname', empname);    
    formData.append('sid', loggedSid);
    formData.append('fname', fname);
    formData.append('mname', mname);
    formData.append('mobile', mobile);    
    formData.append("dob", dob);
    formData.append("sex", sex);
    formData.append("state", state);
    formData.append("city", city); 
    formData.append("id", id);
    try {
      const url = 'https://deploy-admin-mern-app-1.vercel.app/auth/updateemployee';
      const response = await fetch(url, {
        method: "POST",      
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updateInfo }),
      });
      // const data = response.status;
      // console.log(response.status);
    if (response.status === 200) {
      handleSuccess('Employee details updated successfully');
      // Optionally, reset the success message after a short delay
      setTimeout(() => {setSuccessMessage('Employee details updated successfully'); navigate('/employee');}, 5000);
      // return false;
      // window.location.reload();

      // setTimeout(() => {
      //   navigate('/employee');
      // }, 5000);

      setModalIsOpen(false);
      setUsers(prevUsers => prevUsers.map(user => 
        user._id === id ? { ...user, ...updateInfo } : user
      ));
      
      
    } else {
      handleError('Something went wrong while updating employee details');
      setTimeout(() => setErrorMessage(''), 5000);
    }
    } catch (error) {
      handleError('500 Internal Server Error');
    }

  }


    // Handle 'View Image' button click (open in new window)
    const viewImage = (row) => {
      const imageUrl = `https://deploy-admin-mern-app-1.vercel.app/public/photo/${row.photo}`;
      window.open(imageUrl, '_blank'); // Open the image in a new tab/window
    };

    // Handle 'View Image' button click (open in new window)
    const viewDoc = (row) => {
      const docUrl = `https://deploy-admin-mern-app-1.vercel.app/public/document/${row.file}`;
      window.open(docUrl, '_blank'); // Open the image in a new tab/window
    };

  // Display loading or error message if data is not loaded
  if (loading) {
    return (
      <div className="loading-container">
        <img src="https://i.gifer.com/Vp3R.gif" alt="Loading" className="loading-gif" />
        <p>Loading...</p>
      </div>      
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

  // Handle empty data scenario
  if (users.length === 0) {
    return <div>No employee data available</div>;
  }

  return (
    
    <div>
        <Header/>  
        <div className="content-container">
        {/* Sidebar */}
        <Sidebar/>
        <aside className='main_content'>
          {/* Conditionally render the success message */}
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
        <div className="tblcontainer">       
         <div className='empheader'>
            <h1 className=''>Employee Details</h1>   
            <input
                type="text"
                placeholder="Search..."
                className="search-bar"
                value={searchTerm}
                onChange={handleSearch}
              />                  
         </div>
      <DataTable
        // title="Employee Data"
        columns={columns}
        data={paginateData()}
        pagination={false} // Use custom pagination
        fixedHeader
        highlightOnHover
        
      />
      
      <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))
                }
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>

      {/* Modal to display selected employee data */}
      {selectedEmployee && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)} // Close modal
          contentLabel="Employee Details"
          className="modal-content"
          overlayClassName="modal-overlay"
          shouldCloseOnOverlayClick={false} // Prevent modal from closing on outside click
        >
          
          <form onSubmit={handleUpdate}>
          <h2 className='text-center'>Edit Employee Details</h2>
          <div>            
            <div className='mb-5'>
            <div><label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Name</label></div>
            <div>              
              <input type='text' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               name='empname' id='empname' value={updateInfo.empname || ''} onChange={handleChange} />
            </div>
            </div>
            <div className='mb-5'>
            <div><label htmlFor='fathername' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Father Name</label></div>
            <div>              
              <input type='text' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               name='fname' id='sname' value={updateInfo.fname || ''} onChange={handleChange} />
            </div>
            </div>
            <div className='mb-5'>
            <div><label htmlFor='mothername' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Mother Name</label></div>
            <div>              
              <input type='text' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               name='mname' id='mname' value={updateInfo.mname || ''} onChange={handleChange} />
            </div>
            </div>
            <div className='mb-5'>
            <div><label htmlFor='mobile' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Mobile No.</label></div>
            <div>              
              <input type='text' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               name='mobile' id='mobile' value={updateInfo.mobile || ''} onChange={handleChange} />
            </div>
            </div>

            <div className='mb-5'>
            <div><label htmlFor='mobile' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>State.</label></div>
            <div>              
              <input type='text' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               name='state' id='state' value={updateInfo.state || ''} onChange={handleChange} />
            </div>
            </div>
            <div className='mb-5'>
            <div><label htmlFor='mobile' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>City.</label></div>
            <div>              
              <input type='text' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               name='city' id='city' value={updateInfo.city || ''} onChange={handleChange} />
            </div>
            </div>
            
          </div>
          <button onClick={() => setModalIsOpen(false)}>Close</button>
          <button type='submit' className='btn-upd'>Update</button>
          </form>
        </Modal>
      )}
    </div>
        </aside>
        </div>
      
    </div>

    
  );
}

export default Employee;
