import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobForm({ onJobAdded }) {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("applied");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!user_id || !token) {
      setError("You must be signed in to add a job.");
      return;
    }

    const job = {
      company_name: company,
      job_title: title,
      application_status: status,
      application_date: date,
      notes,
      user_id,
    };

    try {
      const res = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add job.");
        return;
      }

      // Clear form
      setCompany("");
      setTitle("");
      setStatus("applied");
      setDate("");
      setNotes("");
      setError(null);
      setSuccess("Job added!");
      setLoading(true);

      // Optionally update job list
      onJobAdded && onJobAdded(data[0]); // Supabase insert returns array
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Job</h2>

      <input
        type="text"
        name="company_name"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
        required
      />

      <input
        type="text"
        name="job_title"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
        required
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
      >
        <option value="applied">Applied</option>
        <option value="interviewing">Interviewing</option>
        <option value="offered">Offered</option>
        <option value="rejected">Rejected</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
        required
      />

      <textarea
        placeholder="Notes"
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Job
      </button>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="ml-2 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
      >
        Cancel
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </form>
  );
}
