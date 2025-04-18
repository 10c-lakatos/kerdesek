let kerdesek = []
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/kerdeseklista')
    .then(a => a.json())
    .then(data => {
        try {
            if (data.err == "Nincsenek a kérdésekről adatok!") {
                alert("Nincsenek a kérdésekről adatok!")
                return;
            }
            if (data.err == "Szerverhiba történt, próbáld újra később!") {
                alert("Szerverhiba történt, próbáld újra később!")
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
            let aktualis = {
                "ID": kerdes.id,
                "Témakör": temakorneve,
                "Sorszám": kerdes.sorszam,
                "Cím": kerdes.cim,
                "Leírás": kerdes.leiras,
                "Elvárás": kerdes.elvaras
            }
            kerdesek.push(aktualis)
            const trow = document.createElement('tr')
            trow.innerHTML = `<td>${kerdes.id}</td>
                    <td>${temakorneve}</td>
                    <td>${kerdes.sorszam}</td>
                    <td>${kerdes.cim}</td>
                    <td>${kerdes.leiras}</td>
                    <td>${kerdes.elvaras}</td>
                    <td><button class="btn btn-outline-success" onclick="changeertekmodal(String(${kerdes.id}))">Módosítás</button></td>
                    <td><button class="btn btn-outline-danger" onclick="torlesertekmodal(String(${kerdes.id}))">Törlés</button></td>`
            document.getElementById('adatok').appendChild(trow)
        });
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
    alert(responseData.message);
    location.reload();
}

async function changeertekmodal(id) {
    const myModal = new bootstrap.Modal(document.getElementById('modifyModal'))
    document.getElementById('modalcim').innerHTML = id+" ID-jű feladat módosítása"
    document.getElementById('temakorneve').value = kerdesek[id-1]["Témakör"]
    document.getElementById('sorszam').value = String(kerdesek[id-1]["Sorszám"])
    document.getElementById('kerdescime').value = kerdesek[id-1]["Cím"]
    document.getElementById('kerdesleirasa').value = kerdesek[id-1]["Leírás"]
    document.getElementById('kerdeselvarasai').value = kerdesek[id-1]["Elvárás"]
    document.getElementById('modositas').outerHTML = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="modositas" onclick="ertekmodositas(${id})">Módosítás</button>`
    myModal.show()
    
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
    alert(responseData.message);
    location.reload();
}