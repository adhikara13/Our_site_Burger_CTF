const express = require('express');
const path = require('path');
const markdownIt = require('markdown-it');
const sanitizeHTML = require('sanitize-html');
const fs = require('fs');

const md = new markdownIt();
const app = express();
const PORT = 3000;
// const adminToken = ''; // Set your desired admin token here

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the MIME type for JavaScript files
app.use(function(req, res, next) {
  if (req.url.endsWith('.js')) {
    res.type('text/javascript');
  }
  next();
});

// Route for admin.html
app.get('/admin.html', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API route for creating new pages
app.post('/api/new-page', function(req, res) {
  const filename = req.body.filename || 'new-page'; // Default filename if not provided
  const sanitizedFilename = sanitizeHTML(filename.replace(/\s+/g, '-')); // Sanitize and replace spaces with hyphens
  const html = md.render(req.body.markdown);
  const sanitizedHTML = sanitizeHTML(html); // Sanitize the HTML

  const adminTokenProvided = req.body.token; // Admin token provided in the request

  if (adminTokenProvided === adminToken) {
    fs.writeFile(`public/pages/${sanitizedFilename}.html`, sanitizedHTML, function(err) {
      if (err) throw err;
      const newPageURL = `/pages/${sanitizedFilename}.html`; // Generate the URL for the new page
      res.send(newPageURL);
    });
  } else {
    res.status(401).send('Unauthorized'); // Send 401 Unauthorized status if token is incorrect
  }
});

// Start the server
app.listen(PORT, function() {
  console.log(`Server is running on http://localhost:${PORT}`);
});
