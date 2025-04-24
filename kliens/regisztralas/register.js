document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const first_name = document.getElementById('firstname').value;
    const last_name = document.getElementById('lastname').value;
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, first_name, last_name, email, avatar: "" })
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire({
        title: "",
        text: "Sikeres regisztrálás! Mostmár beléphetsz!",
        icon: "success"
      }).then((data) => {
        window.location.href = "../bejelentkezes/login.html"
      })
    } else {
      Swal.fire({
        title: "",
        text: data.error || 'Hiba',
        icon: "error"
      });
    }
});