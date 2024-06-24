document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const backButton = document.getElementById('back-button');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        // Gather form data
        const formData = {
            username: document.getElementById('username').value,
            password: password
        };

        // Send form data to the server
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(data => {
            if (data.status === 400) {
                alert(data.body.message);
            } else {
                alert('You have registered successfully!');
                window.location.href = 'login.html'; 
            }
        })
        .catch(error => {
            console.error('Registration error:', error);
            alert('Failed to register user. Please try again later.');
        });
    });

    // Back to login button event listener
    backButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'login.html'; // Adjust URL if login.html is in a different directory
    });
});
