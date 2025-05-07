let userek = {}
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  const roleid = localStorage.getItem('roleid');
  if (!token) {
    Swal.fire({ title: "", text: 'Előszőr kérlek jelentkezz be a felhasználók menedzseléséhez, már ha egyáltalán van hozzá jogod! :)', icon: "error" }).then(() => {
      window.location.href = "./index.html"
    })
    return
  }
  if (roleid != 1) {
    Swal.fire({ title: "", text: 'Nincs jogod ehhez!', icon: "error" }).then(() => {
      window.location.href = "./index.html"
    })
  }
  fetch('http://localhost:3000/api/userslist')
    .then(a => a.json())
    .then(data => {
      try {
        if (data.err == "Nincsenek a kérdésekről adatok!") {
          Swal.fire({ title: "", text: 'Nincsenek a kérdésekről adatok!', icon: "error" });
          return;
        }
        if (data.err == "Szerverhiba történt, próbáld újra később!") {
          Swal.fire({ title: "", text: 'Szerverhiba történt, próbáld újra később!', icon: "error" });
        }
      } catch (err) {

      }
      data.forEach(user => {
        userek[user.id] = {
          "Felhasználónév": user.username,
          "Keresztnév": user.first_name,
          "Vezetéknév": user.last_name,
          "Email": user.email,
          "Rang": user.role,
          "Disabled": user.disabled
        }
        if (user.username != localStorage.getItem('username')) {
          const trow = document.createElement('tr')
          trow.innerHTML = `<td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.first_name}</td>
                    <td>${user.last_name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.disabled}</td>
                    <td><button class="btn btn-outline-success" onclick="changeertekmodal(String(${user.id}))">Módosítás</button></td>
                    <td><button class="btn btn-outline-danger" onclick="torlesertekmodal(String(${user.id}))">Törlés</button></td>`
          document.getElementById('adatok').appendChild(trow)
        }
      });
    }).catch(err => console.log(err));
})
async function torlesertekmodal(id) {
  if (localStorage.getItem('username') != userek[id]["Felhasználónév"]) {
    const myModal = new bootstrap.Modal(document.getElementById('sureModal'))
    document.getElementById('modositas2').outerHTML = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="modositas2" onclick="torlesertek(${id})">Törlés</button>`
    myModal.show()
  } else {
    Swal.fire({ title: "", text: 'Magadat nem törölheted te kis butus!', icon: "error" });
  }

}
async function torlesertek(id) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/userdelete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      id
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
}
async function changeertekmodal(id) {
  const myModal = new bootstrap.Modal(document.getElementById('modifyModal'))
  document.getElementById('modalcim').innerHTML = id + "-jű felhasználó módosítása"
  document.getElementById('felhasznalonev').value = userek[id]["Felhasználónév"]
  document.getElementById('keresztnev').value = userek[id]["Keresztnév"]
  document.getElementById('vezeteknev').value = userek[id]["Vezetéknév"]
  document.getElementById('email').value = userek[id]["Email"]
  document.getElementById('rang').value = userek[id]["Rang"]
  document.getElementById('disabled').value = userek[id]["Disabled"]
  document.getElementById('modositas').outerHTML = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="modositas" onclick="ertekmodositas(${id})">Módosítás</button>`
  myModal.show()


}
async function ertekmodositas(id) {
  const username = document.getElementById('felhasznalonev').value
  const first_name = document.getElementById('keresztnev').value
  const last_name = document.getElementById('vezeteknev').value
  const email = document.getElementById('email').value
  const role = document.getElementById('rang').value
  const disabled = document.getElementById('disabled').value
  if (disabled != 1 && disabled != 0) {
    Swal.fire({ title: "", text: "Nem jó értéket adtál meg! 1 legyen vagy 0.", icon: "error" })
  }
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/userchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      username, first_name, last_name, email, disabled, role, id
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
}