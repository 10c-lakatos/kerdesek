let highestSorszam = 1;


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

document.addEventListener('DOMContentLoaded', async function () {
    const kerdesResponse = await fetch('http://localhost:3000/api/kerdeseklista');
    const kerdesek = await kerdesResponse.json();
    let containsquestions = true;
    try {
        if (kerdesek.error == "Nincsenek a kérdésekről adatok!") {
            Swal.fire({ title: "", text: 'Nincsenek a kérdésekről adatok, nem tudsz hozzáadni!', icon: "error" });
            containsquestions = false;
        }
        if (kerdesek.error == "Szerverhiba történt, próbáld újra később!") {
            Swal.fire({ title: "", text: 'Szerverhiba történt, próbáld újra később!', icon: "error" });
        }
    } catch (err) {
        console.log(err)
    }
    if (containsquestions) {
        const modositando = kerdesek
            .sort((a, b) => b.sorszam - a.sorszam);
            document.getElementById('feladat-sorszama').value = modositando[0].sorszam+1
            highestSorszam = Number(modositando[0].sorszam+1)
    } else {
        document.getElementById('feladat-sorszama').value = 1;
    }
})


document.getElementById('submit').addEventListener('click', async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire({ title: "", text: 'Először kérlek jelentkezz be ehhez a művelethez!', icon: "error" });
        return;
    }

    const felcim = document.getElementById('feladat-cime').value.trim();
    const temakornev = String(document.getElementById('temakor-valasztas').value);
    const felsorszam = Number(document.getElementById('feladat-sorszama').value);
    const felleiras = document.getElementById('feladat-leirasa').value.trim();
    const elvarasokinput = document.querySelectorAll('#elvarasok-container input');

    if (!felcim || !felleiras || !felsorszam) {
        Swal.fire({ title: "", text: 'Minden mezőt ki kell tölteni!', icon: "error" });
        return;
    }
    if (felsorszam > highestSorszam) {
        Swal.fire({ title: "", text: 'Túl magas sorszámot adtál meg!', icon: "error" });
        return;
    }
    const elvarasok = Array.from(elvarasokinput).map(input => input.value.trim()).filter(Boolean);
    if (elvarasok.length === 0) {
        Swal.fire({ title: "", text: 'Legalább egy elvárást adj meg!', icon: "error" });
        return;
    }

    const kerdesResponse = await fetch('http://localhost:3000/api/kerdeseklista');
    const kerdesek = await kerdesResponse.json();
    let containsquestions = true;
    try {
        if (kerdesek.error == "Nincsenek a kérdésekről adatok!") {
            Swal.fire({ title: "", text: 'Nincsenek a kérdésekről adatok, nem tudsz hozzáadni!', icon: "error" });
            containsquestions = false;
        }
        if (kerdesek.error == "Szerverhiba történt, próbáld újra később!") {
            Swal.fire({ title: "", text: 'Szerverhiba történt, próbáld újra később!', icon: "error" });
        }
    } catch (err) {
        console.log(err)
    }
    if (containsquestions) {
        const modositando = kerdesek
            .filter(k => k.sorszam >= felsorszam)
            .sort((a, b) => b.sorszam - a.sorszam);
        console.log(modositando)
        for (const kerdes of modositando) {
            await fetch('http://localhost:3000/api/modositas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: kerdes.id,
                    temakornev: temakornev,
                    felsorszam: kerdes.sorszam + 1,
                    felcim: kerdes.cim,
                    felleiras: kerdes.leiras,
                    felelvaras: kerdes.elvaras
                })
            });
        }
    }
    const response = await fetch('http://localhost:3000/api/feladat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            temakornev,
            felsorszam,
            felcim,
            felleiras,
            elvarasok: elvarasok.join('; ')
        })
    });

    const responseData = await response.json();
    if (response.ok) {
        Swal.fire({ title: "", text: responseData.message, icon: "success" }).then(() => location.reload());
    } else {
        Swal.fire({ title: "", text: responseData.error, icon: "error" });
    }
});