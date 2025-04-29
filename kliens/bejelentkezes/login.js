document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('roleid', data.roleid);
      localStorage.setItem('username', data.username);
      Swal.fire({
        title: "",
        text: "Sikeres bejelentkezés!",
        icon: "success"
      }).then((data) => {
        window.location.href = "../index.html"
      })
      
    } else {
      Swal.fire({
        title: "",
        text: data.error || 'Hiba',
        icon: "error"
      });
    }
  });