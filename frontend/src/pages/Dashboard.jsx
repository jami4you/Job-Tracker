import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Required

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id"); // ✅ Retrieve user_id
  const navigate = useNavigate(); // ✅ Add this
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      let url = `http://localhost:5000/jobs?user_id=${userId}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
    
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      const data = await res.json();
      if (res.ok) {
        setJobs(data);
      } else {
        console.error(data.error);
      }
    };
    

    if (userId && token) {
      fetchJobs();
    } else {
      navigate("/signin");
    }
  }, [userId, token, navigate, statusFilter]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/signin");
  };

  const goToJobForm = () => {
    navigate("/jobform");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    const res = await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } else {
      alert("Failed to delete job");
    }
  };
  

  return (
    <div className="p-20">
      <h1 className="text-2xl font-bold mb-4">Your Job Applications</h1>

      <button
        onClick={handleSignOut}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
      <button
        onClick={goToJobForm}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add New Job
      </button>
     {/* Filter Dropdown */}
     <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">All Statuses</option>
        <option value="applied">Applied</option>
        <option value="interviewing">Interviewing</option>
        <option value="offered">Offered</option>
        <option value="rejected">Rejected</option>
      </select>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded bg-white shadow">
              <p><strong>Company:</strong> {job.company_name}</p>
              <p><strong>Title:</strong> {job.job_title}</p>
              <p><strong>Status:</strong> {job.application_status}</p>
              <p><strong>Application Date:</strong> {job.application_date}</p>
              <p><strong>Notes:</strong> {job.notes}</p>
              <Link to={`/jobs/${job.id}/edit`} className="text-blue-600 underline ml-2">
                Edit
              </Link>
              <Link
        className="text-blue-600 underline ml-2"
        onClick={() => handleDelete(job.id)}
      >
                Delete
        </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
