document.getElementById("submitbtn").addEventListener("click", async function(event){
    event.preventDefault()
    const first_name = document.getElementById('firstname').value
    const last_name = document.getElementById('lastname').value
    const email = document.getElementById('email').value
    const newpassword = document.getElementById('password').value
    if (!first_name || !last_name || !email) {
        Swal.fire({ title: "", text: "Minden mezőt tölts ki!", icon: "error" })
        return;
    }
    const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await fetch('http://localhost:3000/api/ownprofilechange', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username, first_name, last_name, email
            })
        });
        const responseData = await response.json();
        if (response.ok) {
            Swal.fire({ title: "", text: responseData.message, icon: "success" }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({ title: "", text: responseData.error, icon: "error" });
        }
  });

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const roleid = localStorage.getItem('roleid');
    if (!token) {
        Swal.fire({ title: "", text: 'Előszőr kérlek jelentkezz be a saját profil szerkesztéséhez!', icon: "error" }).then(() => {
            window.location.href = "./index.html"
        })
        return
    }
    if (roleid != 2 && roleid != 1) {
        Swal.fire({ title: "", text: 'Nincs jogod ehhez!', icon: "error" }).then(() => {
            window.location.href = "./index.html"
        })
    }
})
