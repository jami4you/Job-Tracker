// pages/JobEditForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JobEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`http://localhost:5000/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setJob(data);
      } else {
        setError(data.error);
      }
    };
    fetchJob();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(job),
    });

    const data = await res.json();
    if (res.ok) {
      navigate("/dashboard");
    } else {
      setError(data.error);
    }
  };

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  if (!job) return <p>Loading...</p>;

  return (
    <form onSubmit={handleUpdate} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Job</h2>
      <input name="company_name" value={job.company_name} onChange={handleChange} placeholder="Company" className="w-full mb-2 p-2 border" />
      <input name="job_title" value={job.job_title} onChange={handleChange} placeholder="Title" className="w-full mb-2 p-2 border" />
      <select 
        name="application_status" 
        value={job.application_status} 
        onChange={handleChange} 
        placeholder="Status" 
        className="w-full mb-2 p-2 border">
        <option value="applied">Applied</option>
        <option value="interviewing">Interviewing</option>
        <option value="offered">Offered</option>
        <option value="rejected">Rejected</option>
        </select>
      <textarea name="notes" value={job.notes} onChange={handleChange} placeholder="Notes" className="w-full mb-2 p-2 border" />
      <input type="date" name="application_date" value={job.application_date || ""} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Update</button>
      <button
  type="button"
  onClick={() => navigate("/dashboard")}
  className="ml-2 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
>
  Cancel
</button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
