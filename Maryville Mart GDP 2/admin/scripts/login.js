const $form = document.getElementById('form');

$form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    console.log(formDataObject);

    try {
        const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login successful:', data);
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            console.error('Login failed:', data.error);
            alert(data.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }

})