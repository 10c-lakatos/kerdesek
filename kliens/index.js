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
    const felcim = document.getElementById('feladat-cime').value
    if (felcim == "") return alert("Kérlek adj meg egy feladatcímet!");
    const temakornev = String(document.getElementById('temakor-valasztas').value)
    const felsorszam = Number(document.getElementById('feladat-sorszama').value) || alert("Nem szám az érték vagy nem írtál semmit!");
    const felleiras = document.getElementById('feladat-leirasa').value
    if (felleiras == "") return alert("Kérlek add meg a feladat leírását!");
    const elvarasokinput = document.querySelectorAll('#elvarasok-container input');
    let elvarasok = "";
    if (elvarasokinput.length === 0) {
        alert("Legalább egy elvárást adj hozzá!");
        return;
    }
    const ertekek = Array.from(elvarasokinput).map(input => input.value.trim());
    const hasEmpty = ertekek.some(val => val.length === 0);
    if (hasEmpty) {
        alert("Kérlek, töltsd ki az összes elvárás mezőt, vagy töröld az üreseket.");
        return;
    }
    elvarasok = ertekek.join('; ');
    const response = await fetch('http://localhost:3000/api/feladat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          temakornev, felsorszam, felcim, felleiras, elvarasok
        })
      });
    const responseData = await response.json();

    alert(responseData.message);
    location.reload();
})