function addElvaras() {
    const container = document.getElementById('elvarasok-container');

    const inputgroup = document.createElement('div');
    inputgroup.className = 'input-group mb-2';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.placeholder = 'Elvárás';
    input.value = "";

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-danger';
    button.innerText = 'Törlés';
    button.onclick = () => inputgroup.remove();

    const buttonWrapper = document.createElement('span');
    buttonWrapper.className = 'input-group-text p-0';
    buttonWrapper.appendChild(button);
    inputgroup.appendChild(input);
    inputgroup.appendChild(buttonWrapper);
    container.appendChild(inputgroup);
}

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
    let isthere = -1
    let questions = {}
    fetch('http://localhost:3000/api/kerdeseklista')
    .then(a => a.json())
    .then(data => {
        try {
            if (data.err == "Nincsenek a kérdésekről adatok!") {
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
          questions[kerdes.sorszam] = {"Témakör": temakorneve,
              "ID": kerdes.id,
              "Cím": kerdes.cim,
              "Leírás": kerdes.leiras,
              "Elvárás": kerdes.elvaras}
            if (kerdes.sorszam == felsorszam) {
              isthere = kerdes.sorszam
            }
        });
      }).catch(err => console.log(err));
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
    if (isthere != -1) {
      const response2 = await fetch('http://localhost:3000/api/modositas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id, temakornev, felsorszam, felcim, felleiras, felelvaras
        })
      });
      const responseData2 = await response2.json();
      if (response2.ok) {
      Swal.fire({title: "", text: responseData2.message, icon: "success"}).then(() => {
        location.reload();
      });
      } else {
        Swal.fire({title: "", text: responseData2.error, icon: "error"});
      }
      }

})