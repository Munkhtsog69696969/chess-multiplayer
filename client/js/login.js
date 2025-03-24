async function checkAuth() {
    try {
        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include' 
        });

        if (response.ok) {
            window.location.href = '/home';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth(); 

    const loginForm = document.getElementById('login-form');

    if (loginForm) { 
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }), 
                    credentials: 'include'
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
