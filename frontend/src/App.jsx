import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import JobForm from "./pages/JobForm";
import JobEditForm from "./pages/JobEditForm";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (token && userId) {
      setUser({ id: userId }); // You can expand this with more info
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobForm" element={<JobForm />} />
        <Route path="/jobs/:id/edit" element={<JobEditForm />} />
      </Routes>
    </Router>
  );
}

export default App;
