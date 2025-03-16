const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for the Next.js front-end
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://boardingbliss.vercel.app' 
    : 'http://localhost:3000'
}));

app.use(express.json());

// API endpoint to schedule check-in
app.post('/api/schedule-checkin', (req, res) => {
  const { confirmationNumber, firstName, lastName } = req.body;
  
  // Validate input
  if (!confirmationNumber || !firstName || !lastName) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  // Path to the Python script
  const pythonScriptPath = path.join(__dirname, '../auto-southwest-check-in/southwest.py');
  
  // Build the command - using quotes around names to handle spaces
  const command = `cd ../auto-southwest-check-in && python3 southwest.py ${confirmationNumber} "${firstName}" "${lastName}"`;
  
  console.log(`Executing command: ${command}`);
  
  // Execute the Python script
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ success: false, message: error.message });
    }
    
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      // Not returning an error as stderr might contain warnings
    }
    
    console.log(`Stdout: ${stdout}`);
    
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

// API endpoint to check status
app.get('/api/status', (req, res) => {
  // Execute ps command to check if the Python script is running
  exec('ps aux | grep southwest.py | grep -v grep', (error, stdout, stderr) => {
    const isRunning = stdout.trim().length > 0;
    
    res.status(200).json({
      success: true,
      isRunning,
      processes: stdout.split('\n').filter(line => line.trim().length > 0).map(line => {
        const parts = line.trim().split(/\s+/);
        // Extract relevant information from ps output
        return {
          pid: parts[1],
          command: parts.slice(10).join(' ')
        };
      })
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 