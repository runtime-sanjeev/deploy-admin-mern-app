import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
// import { handleError } from '../utils';
import Sidebar from '../component/sidebar';
import Header from '../component/header';
import { useNavigate } from 'react-router-dom';

function Employee() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loggedSid, setLoggedSid] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [updateInfo, setUpdateInfo] = useState({
    empname: '',
    fname: '',
    mname: '',
    mobile: '',
    dob: '',
    sex: '',
    state: '',
    city: '',
    id: ''
  });
  const navigate = useNavigate();

  // Success and error handlers
  const handleSuccess = (message) => {
    setSuccessMessage(message);
  };

    // Fetch paginated data from the API
  const fetchEmployees = async (page, limit) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://deploy-admin-mern-app-1.vercel.app/auth/employee?page=${page}&limit=${limit}`);
      setEmployees(response.data.data);
      setTotalRecords(response.data.metadata.totalRecords);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page, limit);
  }, [page, limit]);

  // Handle page change
  const handlePageChange = page => {
    setPage(page);
  };

  // Handle rows per page change
  const handlePerRowsChange = async (newPerPage, page) => {
    setLimit(newPerPage);
    setPage(page);
  };
  const handleError = (message) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    if (storedUserData) {
      setLoggedSid(storedUserData.id);
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

  // Handle input changes for employee data update
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdateInfo(prev => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  // Fetch employee data
  useEffect(() => {
    axios.get('https://deploy-admin-mern-app-1.vercel.app/auth/employee')
      .then(response => {
        console.log(response.data); 
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  // Columns for DataTable
  const columns = [
    {
      name: 'Name',
      selector: row => row.empname,
      sortable: true,
    },
    {
      name: 'Father Name',
      selector: row => row.fname,
      sortable: true,
    },
    {
      name: 'Mother Name',
      selector: row => row.mname,
      sortable: true,
    },
    {
      name: 'Mobile',
      selector: row => row.mobile,
      sortable: true,
    },
    {
      name: 'Uploaded Document',
      cell: (row) => (
        <button onClick={() => viewDoc(row)} className="focus:outline-none text-white bg-green-700
        hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-[0.675rem] px-5
         py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">View Document</button>
      ),
      sortable: false,
    },
    {
      name: 'Uploaded Image',
      cell: (row) => (
        <button onClick={() => viewImage(row)} className="focus:outline-none text-white
        bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium 
        rounded-lg text-[0.675rem] px-5 py-2.5 me-2 mb-2 dark:bg-green-600 
        dark:hover:bg-green-700 dark:focus:ring-green-800">View Image</button>
      ),
      sortable: false,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button onClick={(e) => handleEdit(row, e)} className="btfocus:outline-none text-white bg-purple-700
        hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg 
        text-[0.675rem] px-5 py-2.5 me-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 
        dark:focus:ring-purple-800nedt">Edit</button>
      ),
      sortable: false,
    },
  ];

  // Edit button functionality
  const handleEdit = async (row, e) => {
    e.preventDefault();
    const id = row._id;
    try {
      const url = "https://deploy-admin-mern-app-1.vercel.app/auth/editemployee";
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (data) {
        setSelectedEmployee(data);
        setModalIsOpen(true);
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
        });
      } else {
        handleError('Employee data not found');
      }
    } catch (error) {
      handleError('Error during edit');
    }
  };

  // Modal update functionality
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { empname, fname, mname, mobile, dob, sex, state, city, id } = updateInfo;
    if (!empname || !fname || !mname || !mobile || !dob || !sex || !state || !city) {
      handleError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('empname', empname);
    formData.append('sid', loggedSid);
    formData.append('fname', fname);
    formData.append('mname', mname);
    formData.append('mobile', mobile);
    formData.append('dob', dob);
    formData.append('sex', sex);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('id', id);

    try {
      const url = 'https://deploy-admin-mern-app-1.vercel.app/auth/updateemployee';
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateInfo })
      });

      if (response.status === 200) {
        handleSuccess('Employee details updated successfully');
        setTimeout(() => {
          setModalIsOpen(false);
          navigate('/employee');
        }, 2000);
        setUsers(prevUsers => prevUsers.map(user => user._id === id ? { ...user, ...updateInfo } : user));
      } else {
        handleError('Something went wrong');
      }
    } catch (error) {
      handleError('500 Internal Server Error');
    }
  };

  // View document functionality
  const viewDoc = (row) => {
    const docUrl = `https://deploy-admin-mern-app-1.vercel.app/public/document/${row.file}`;
    window.open(docUrl, '_blank');
  };

  // View image functionality
  const viewImage = (row) => {
    const imageUrl = `https://deploy-admin-mern-app-1.vercel.app/public/photo/${row.photo}`;
    window.open(imageUrl, '_blank');
  };

  // Loading and error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (users.length === 0) return <div>No employee data available</div>;

  return (
    <div>
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="main-content">
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <DataTable
            columns={columns}
            data={employees} // users are the fetched data
            pagination
            paginationServer
            paginationTotalRows={totalRecords} // Set total records count from the API response
            onChangePage={handlePageChange} // Handle page change
            onChangeRowsPerPage={handlePerRowsChange} // Handle rows per page change
            loading={loading} // Show loading indicator if needed
          />
          {/* Modal for editing employee */}
          {selectedEmployee && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              contentLabel="Edit Employee"
              className="modal-content"
              overlayClassName="modal-overlay"
            >
              <form onSubmit={handleUpdate}>
                <h2>Edit Employee Details</h2>
                {/* Modal form for editing employee data */}
                <div className="form-fields">
                  <input type="text" name="empname" value={updateInfo.empname} onChange={handleChange} />
                  <input type="text" name="fname" value={updateInfo.fname} onChange={handleChange} />
                  <input type="text" name="mname" value={updateInfo.mname} onChange={handleChange} />
                  <input type="text" name="mobile" value={updateInfo.mobile} onChange={handleChange} />
                  <input type="date" name="dob" value={updateInfo.dob} onChange={handleChange} />
                  <input type="text" name="sex" value={updateInfo.sex} onChange={handleChange} />
                  <input type="text" name="state" value={updateInfo.state} onChange={handleChange} />
                  <input type="text" name="city" value={updateInfo.city} onChange={handleChange} />
                </div>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setModalIsOpen(false)}>Close</button>
              </form>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employee;
