require('dotenv').config()
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

app.get('/api/kerdeseklista', authenticateToken, async (req, res) => {
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

app.post('/api/modositas', authenticateToken, async (req, res) => {
  try {
    const sqlid = req.body["id"]
    const temakor_nev = req.body["temakornev"]
    const sorszam = Number(req.body["felsorszam"])
    const cim = req.body["felcim"]
    const leiras = req.body["felleiras"]
    const elvaras = req.body["felelvaras"]
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
      'UPDATE feladat SET temakor_id = ?, sorszam = ?, cim = ?, leiras = ?, elvaras = ? WHERE id = ?;',
      [temakor_id, sorszam, cim, leiras, elvaras, sqlid]
    )
    res.json({ message: 'Sikeresen módosítva!' })
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/torles', authenticateToken, async (req, res) => {
  try {
    const sqlid = req.body["id"]
    if (!sqlid) {
      res.status(400).json({message: "Nincsen SQL-id!"})
      return;
    }
    await db.query(
      'DELETE FROM feladat WHERE id = ?;', [sqlid]
    )
    res.status(200).json({message: "Sikeres törlés!"})
  } catch (err) {
    res.status(400).json({message: "Szerverhiba történt, próbáld újra később!"})
  }
})


app.post('/api/feladat', authenticateToken, async (req, res) => {
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

// Bej+Reg

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
    res.json({ message: 'Sikeres regisztráció' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'A felhasználónév már létezik, vagy hiba a regisztrációnál!' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(400).json({ error: 'Hibás felhasználónév' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Hibás jelszó' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bejelentkezési hiba' });
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Hiányzó token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Érvénytelen token' });
    req.user = user;
    next();
  });
};

app.listen(3000, () => {
  console.log('A backend szerver fut a http://localhost:3000 címen');
});
