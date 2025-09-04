import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        navigate('/signin'); // redirect after successful signup
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
    <form onSubmit={handleSignUp} className="bg-white p-8 rounded shadow-md w-full max-w-sm mx-auto mt-20">
    <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
    <p className="mt-4 text-sm mb-6">
          Do you have an account?{" "}
          <button 
          onClick={() => navigate("/Signin")}
          className="text-blue-600 hover:underline">
            Sign in
          </button>
        </p>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
      required
      className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
      required
      className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      Sign Up
    </button>
  
    {error && <p className="text-red-500 mt-4 text-sm text-center">{error}</p>}
  </form>
  </div>
  );
}