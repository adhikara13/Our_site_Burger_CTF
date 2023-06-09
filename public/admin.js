document.getElementById('submit').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  var filename = document.getElementById('filename').value;
  var sanitizedFilename = filename.replace(/\s+/g, '-'); // Replace spaces with hyphens
  var markdown = document.getElementById('markdown').value;
  var token = document.getElementById('token').value; // Get the admin token from the form

  fetch('/api/new-page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filename: sanitizedFilename, markdown: markdown, token: token }) // Pass the admin token in the request
  })
  .then(function(response) {
    if (response.ok) {
      return response.text();
    } else if (response.status === 409) {
      throw new Error('Page with the same name already exists');
    }
    else if (response.status === 401) {
      throw new Error('Please provide the real token');
    } 
    else {
      throw new Error('Page creation failed');
    }
  })
  .then(function(data) {
    // Display the new link to the user
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<a href="' + data + '" target="_blank">Open me!</a>';

    // Clear error message if present
    var errorDiv = document.getElementById('error');
    errorDiv.innerHTML = '';
  })
  .catch(function(error) {
    console.log('Error:', error.message);
    // Display error message to the admin
    var errorDiv = document.getElementById('error');
    errorDiv.innerText = error.message;
  });
});
