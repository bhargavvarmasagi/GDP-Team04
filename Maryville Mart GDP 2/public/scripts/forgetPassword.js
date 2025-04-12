const $form = document.getElementById('form');

$form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    const body = {email : email}
    try {
        const response = await fetch('/api/auth/request-reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Reset mail sent : ', data);
            alert("Reset Password link sent to email, Please check");
        } else {
            console.error(' Failed:', data.error);
            alert(data.error || 'Failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during reset password :', error);
        alert('An error occurred. Please try again.');
    }

})