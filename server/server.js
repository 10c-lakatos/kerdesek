const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kerdesek',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0 
});

app.get('/api/kerdeseklista', async (req, res) => {
  try {
    const [kerdesek] = await (db.query(
      'SELECT * FROM feladat'
    ))
    if (kerdesek.length === 0) {
      return res.status(400).json({ err: 'Nincsenek a kérdésekről adatok!' });
    }
    for (let i = 0; i < kerdesek.length; i++) {
      const temakor_id = kerdesek[i].temakor_id;
      const [temakorSor] = await db.query('SELECT nev FROM temakor WHERE id = ?', [temakor_id]);
      kerdesek[i].temakor = temakorSor[0]?.nev || 'Ismeretlen';
    }

    res.json(kerdesek);
  } catch (error) {
    console.error('Hiba:', error);
    res.status(500).json({ err: 'Szerverhiba történt, próbáld újra később!' });
  }

})

app.post('/api/feladat', async (req, res) => {
  try {
    const temakor_nev = req.body["temakornev"]
    const sorszam = Number(req.body["felsorszam"])
    const cim = req.body["felcim"]
    const leiras = req.body["felleiras"]
    const elvaras = req.body["elvarasok"]
    if (!temakor_nev || !sorszam || !cim || !leiras || !elvaras) {
      return res.status(400).json({ message: 'Minden mezőt ki kell tölteni!' });
    }
    const [temakorRows] = await db.query(
      'SELECT id FROM temakor WHERE nev = ?',
      [temakor_nev]
    );
    if (temakorRows.length === 0) {
      return res.status(400).json({ message: `Nem létezik ilyen témakör: ${temakor_nev}` });
    }

    const temakor_id = temakorRows[0].id;
    await db.query(
      'INSERT INTO feladat (temakor_id, sorszam, cim, leiras, elvaras) VALUES (?, ?, ?, ?, ?)',
      [temakor_id, sorszam, cim, leiras, elvaras]
    )
    res.status(201).json({ message: 'Kérdés sikeresen közzétéve!' })
  } catch (error) {
    console.error('Hiba:', error)
    res.status(500).json({ message: 'Szerverhiba történt, próbáld újra később!' })
  }
});

app.listen(3000, () => {
  console.log('A backend szerver fut a http://localhost:3000 címen');
});
