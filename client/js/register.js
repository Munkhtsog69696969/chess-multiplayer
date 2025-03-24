document.addEventListener('DOMContentLoaded', async (e) => {
    
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) { 
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }), 
                });

                if (response.ok) {
                    window.location.href = '/home';
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});