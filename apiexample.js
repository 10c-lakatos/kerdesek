// Módosítás
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
    Swal.fire({title: "", text: responseData.message, icon: "success"}).then(() => {
    location.reload();
    });
} else {
    Swal.fire({title: "", text: responseData.error, icon: "error"});
}

// Feladathoz kérdés postolása
const respons = await fetch('http://localhost:3000/api/feladat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      temakornev, felsorszam, felcim, felleiras, elvarasok
    })
  });
const responsData = await response.json();
if (respons.ok) {
  Swal.fire({title: "", text: responsData.message, icon: "success"}).then(() => {
    location.reload();
  });
} else {
  Swal.fire({title: "", text: responsData.error, icon: "error"});
}

// Kérdések listázása
fetch('http://localhost:3000/api/kerdeseklista')
    .then(a => a.json())
    .then(data => {
        try {
            if (data.err == "Nincsenek a kérdésekről adatok!") {
                Swal.fire({title: "", text: 'Nincsenek a kérdésekről adatok!', icon: "error"});
                return;
            }
            if (data.err == "Szerverhiba történt, próbáld újra később!") {
                Swal.fire({title: "", text: 'Szerverhiba történt, próbáld újra később!', icon: "error"});
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
})

document.getElementById('submit').addEventListener('click', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({title: "", text: 'Előszőr kérlek jelentkezz be ehhez a művelethez!', icon: "error"})
      return;
    }
    const felcim = document.getElementById('feladat-cime').value
    if (felcim == "") {Swal.fire({title: "", text: 'Kérlek adj meg egy feladatcímet!', icon: "error"}); return;};
    const temakornev = String(document.getElementById('temakor-valasztas').value)
    const felsorszam = Number(document.getElementById('feladat-sorszama').value);
    if (!felsorszam) {
      Swal.fire({title: "", text: 'Nem szám az érték vagy nem írtál semmit!', icon: "error"})
      return;
    }
    const felleiras = document.getElementById('feladat-leirasa').value
    if (felleiras == "") return Swal.fire({title: "", text: 'Kérlek add meg a feladat leírását!', icon: "error"});
    const elvarasokinput = document.querySelectorAll('#elvarasok-container input');
    let elvarasok = "";
    if (elvarasokinput.length === 0) {
      Swal.fire({title: "", text: 'Legalább egy elvárást adj meg!', icon: "error"});
        return;
    }
    const ertekek = Array.from(elvarasokinput).map(input => input.value.trim());
    const hasEmpty = ertekek.some(val => val.length === 0);
    if (hasEmpty) {
        Swal.fire({title: "", text: 'Kérlek, töltsd ki az összes elvárás mezőt, vagy töröld az üreseket.', icon: "error"});
        return;
    }
    elvarasok = ertekek.join('; ');
    const response = await fetch('http://localhost:3000/api/feladat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          temakornev, felsorszam, felcim, felleiras, elvarasok
        })
      });
    const responseData = await response.json();
    if (response.ok) {
      Swal.fire({title: "", text: responseData.message, icon: "success"}).then(() => {
        location.reload();
      });
    } else {
      Swal.fire({title: "", text: responseData.error, icon: "error"});
    }
})