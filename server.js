const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoint to schedule check-in
app.post('/api/schedule-checkin', (req, res) => {
  const { confirmationNumber, firstName, lastName } = req.body;
  
  // Validate input
  if (!confirmationNumber || !firstName || !lastName) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  // Add detailed logging
  console.log('Received check-in request:');
  console.log('Confirmation Number:', confirmationNumber);
  console.log('First Name:', firstName);
  console.log('Last Name:', lastName);
  console.log('Current directory:', __dirname);
  
  // Build the command - using quotes around names to handle spaces
  const command = `cd ../auto-southwest-check-in && python3 southwest.py ${confirmationNumber} "${firstName}" "${lastName}"`;
  
  console.log(`Executing command: ${command}`);
  
  // Execute the Python script
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ success: false, message: error.message });
    }
    
    console.log(`Stdout: ${stdout}`);
    
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    
    // Check if the script was successful
    if (stdout.includes('Successfully scheduled')) {
      // Extract the flight information from stdout
      const flightInfo = stdout.split('Successfully scheduled the following flights')[1] || '';
      
      return res.status(200).json({ 
        success: true, 
        message: 'Check-in scheduled successfully', 
        data: {
          output: stdout,
          flightInfo: flightInfo.trim()
        } 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to schedule check-in', 
        data: { output: stdout } 
      });
    }
  });
});

// Default route to serve the HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 