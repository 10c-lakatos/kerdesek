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
            const trow = document.createElement('tr')
            trow.innerHTML = `<td>${kerdes.id}</td>
                    <td>${temakorneve}</td>
                    <td>${kerdes.sorszam}</td>
                    <td>${kerdes.cim}</td>
                    <td>${kerdes.leiras}</td>
                    <td>${kerdes.elvaras}</td>`
            document.getElementById('adatok').appendChild(trow)
        });
    }).catch(err => console.log(err));
})