document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('message');
        if (data.success) {
            messageDiv.textContent = 'Recipe uploaded successfully!';
        } else {
            messageDiv.textContent = 'Upload failed: ' + data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

