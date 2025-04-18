document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
      window.location.href = '../bejelentkezes/login.html';
    } else {
      alert(data.error || 'Hiba történt.');
    }
});