// backend/routes.js
const express = require('express');
const router = express.Router();
const supabase = require('./supabaseClient');

// GET all users
router.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(400).json({ error });
  res.json(data);
});
// POST /signin - user login
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    message: 'Signed in successfully',
    user: data.user,
    session: data.session, // contains access_token
  });
});

// Sign up
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({
    message: 'User created successfully',
    user: data.user,
  });
});

// GET jobs with optional status filter
router.get("/jobs", async (req, res) => {
  const { user_id, status } = req.query;

  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  try {
    let query = supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("application_status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






// POST /jobs
router.post("/jobs", async (req, res) => {
  const { company_name, job_title, application_status, application_date, notes, user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: "Missing user_id" });

  try {
    const { data, error } = await supabase
      .from("jobs")
      .insert([{ company_name, job_title, application_status, application_date, notes, user_id }]);

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /jobs/:id
router.put("/jobs/:id", async (req, res) => {
  const jobId = req.params.id;
  const { company_name, job_title, application_status, notes, application_date } = req.body;

  try {
    const { data, error } = await supabase
      .from("jobs")
      .update({ company_name, job_title, application_status, notes, application_date })
      .eq("id", jobId)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// GET job by id
router.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single(); // .single() gets just one row

    if (error) return res.status(500).json({ error: error.message });

    if (!data) return res.status(404).json({ error: "Job not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// DELETE job by id
router.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(204).send(); // success, no content
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});





module.exports = router;
