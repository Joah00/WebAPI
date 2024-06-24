document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerButton = document.getElementById('register-button');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const contentType = response.headers.get('content-type');
            if (!(contentType && contentType.includes('application/json'))) {
                console.error('Expected JSON response, got:', contentType);
                const text = await response.text();
                console.error('Response text:', text);
                alert('An error occurred while logging in. Please try again later.');
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
            } else {
                localStorage.setItem('userId', data.userId); 
                window.location.href = 'homepage.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
    });

    registerButton.addEventListener('click', function() {
        window.location.href = 'register.html';
    });
});
