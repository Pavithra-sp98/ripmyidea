module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Basic email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: [2],
        updateEnabled: false
      })
    });

    if (response.status === 201) {
      return res.status(201).json({ success: true });
    } else if (response.status === 204) {
      return res.status(204).json({ success: true });
    } else {
      const data = await response.json();
      if (data.code === 'duplicate_parameter') {
        return res.status(400).json({ code: 'duplicate_parameter' });
      }
      return res.status(500).json({ error: 'Failed to add contact' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Network error' });
  }
}
