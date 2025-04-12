const url = new URLSearchParams(window.location.search);
const token = url.get("token");
if(!token){
    window.location.href = "login.html"
}

const $form = document.getElementById('form');

$form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });
  console.log(formDataObject);
  const { password, confirmPassword } = formDataObject;

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }

  try {

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  newPassword : password, token }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Signup successful:', data);
      alert('Password reset successful! You can now log in.');
      window.location.href = '/login.html';
    } else {
      console.error('Signup failed:', data.error);
      alert(data.error || 'Password reset failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during Password reset:', error);
    alert('An error occurred. Please try again.');
  }
});