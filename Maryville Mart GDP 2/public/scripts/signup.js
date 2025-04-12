const $form = document.getElementById('form');

$form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });
  console.log(formDataObject);
  const { firstName, lastName, email, password, contact, confirmPassword, address } = formDataObject;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }

  try {

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, address, contact }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Signup successful:', data);
      alert('Signup successful! You can now log in.');
      window.location.href = '/login.html';
    } else {
      console.error('Signup failed:', data.error);
      alert(data.error || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('An error occurred. Please try again.');
  }
});
