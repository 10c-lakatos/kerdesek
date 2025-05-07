let kerdesek = []
document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  const roleid = localStorage.getItem('roleid');
  if (!token) {
    Swal.fire({ title: "", text: 'Előszőr kérlek jelentkezz be a kérdések listázásához!', icon: "error" }).then(() => {
      window.location.href = "./index.html"
    })
    return
  }
  if (roleid != 2 && roleid != 1) {
    Swal.fire({ title: "", text: 'Nincs jogod ehhez!', icon: "error" }).then(() => {
      window.location.href = "./index.html"
    })
  }
  fetch('http://localhost:3000/api/kerdeseklista')
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
      data.forEach(kerdes => {
        let temakorneve = ""
        if (kerdes.temakor_id == 1) {
          temakorneve = "HTML"
        } else if (kerdes.temakor_id == 2) {
          temakorneve = "CSS"
        } else if (kerdes.temakor_id == 3) {
          temakorneve = "Bootstrap"
        } else if (kerdes.temakor_id == 4) {
          temakorneve = "Flexbox"
        } else if (kerdes.temakor_id == 5) {
          temakorneve = "Grid"
        }
        kerdesek.push({
          "id": kerdes.id,
          "Témakör": temakorneve,
          "Sorszám": kerdes.sorszam,
          "Cím": kerdes.cim,
          "Leírás": kerdes.leiras,
          "Elvárás": kerdes.elvaras
        })

      });
      const rendezettTomb = Object.entries(kerdesek)
        .sort(([, a], [, b]) => a.Sorszám - b.Sorszám);
      console.log(rendezettTomb)
      rendezettTomb.forEach(kerdes => {
        const trow = document.createElement('tr')
        trow.innerHTML = `<td>${kerdes[1].Sorszám}</td>
                <td>${kerdes[1].Témakör}</td>
                <td>${kerdes[1].id}</td>
                <td>${kerdes[1].Cím}</td>
                <td>${kerdes[1].Leírás}</td>
                <td>${kerdes[1].Elvárás}</td>
                <td><button class="btn btn-outline-success" onclick="changeertekmodal(String(${kerdes[1].id}))">Módosítás</button></td>
                <td><button class="btn btn-outline-danger" onclick="torlesertekmodal(String(${kerdes[1].id}))">Törlés</button></td>`
        document.getElementById('adatok').appendChild(trow)
      })
    }).catch(err => console.log(err));
})

async function torlesertekmodal(id) {
  const myModal = new bootstrap.Modal(document.getElementById('sureModal'))
  document.getElementById('modositas2').outerHTML = `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="modositas2" onclick="torlesertek(${id})">Törlés</button>`
  myModal.show()
}

async function torlesertek(id) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/torles', {
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
  const kerdes = kerdesek.find(k => k.id === Number(id));
  if (kerdes) {
    document.getElementById('modalcim').innerHTML = id + " ID-jű feladat módosítása"
    document.getElementById('temakorneve').value = kerdes["Témakör"]
    document.getElementById('sorszam').value = String(kerdes["Sorszám"])
    document.getElementById('kerdescime').value = kerdes["Cím"]
    document.getElementById('kerdesleirasa').value = kerdes["Leírás"]
    document.getElementById('kerdeselvarasai').value = kerdes["Elvárás"]
    document.getElementById('modositas').outerHTML = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="modositas" onclick="ertekmodositas(${id})">Módosítás</button>`
    myModal.show()
  } else {
    console.log(kerdes)
  }

}

async function ertekmodositas(id) {
  const temakornev = document.getElementById('temakorneve').value
  const felsorszam = document.getElementById('sorszam').value
  const felcim = document.getElementById('kerdescime').value
  const felleiras = document.getElementById('kerdesleirasa').value
  const felelvaras = document.getElementById('kerdeselvarasai').value
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/modositas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      id, temakornev, felsorszam, felcim, felleiras, felelvaras
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