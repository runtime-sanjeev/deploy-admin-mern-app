import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Registration from "./pages/Registration";
import Employee from "./pages/Employee";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import RefreshHandler from "./RefreshHandler";

function App() {
  const[isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({element}) => {
    return isAuthenticated ? element : <Navigate to={'/login'} />
  }
  return (
    <div className="app">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated}></RefreshHandler>
      <Routes>
        <Route path="/" element = {<Navigate to ='/login'/>}></Route>
       <Route path="/login" element={<Login />}></Route>
       <Route path="/signup" element={<Signup />}></Route>
       <Route path="/registration" element={<Registration />}></Route>
       <Route path="/employee" element={<Employee />}></Route>
       <Route path="/dashboard" element ={<PrivateRoute element={<Dashboard />} />}></Route>

      </Routes>
    </div>
  );
}

export default App;
