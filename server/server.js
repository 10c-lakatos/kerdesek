
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

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
      return res.status(400).json({ error: 'Nincsenek a kérdésekről adatok!' });
    }
    for (let i = 0; i < kerdesek.length; i++) {
      const temakor_id = kerdesek[i].temakor_id;
      const [temakorSor] = await db.query('SELECT nev FROM temakor WHERE id = ?', [temakor_id]);
      kerdesek[i].temakor = temakorSor[0]?.nev || 'Ismeretlen';
    }

    res.json(kerdesek);
  } catch (error) {
    console.error('Hiba:', error);
    res.status(500).json({ error: 'Szerverhiba történt, próbáld újra később!' });
  }

})

app.get('/api/userslist', async (req, res) => {
  try {
    const [kerdesek] = await (db.query(
      'SELECT * FROM users'
    ))
    if (kerdesek.length === 0) {
      return res.status(400).json({ error: 'Nincsenek a kérdésekről adatok!' });
    }
    for (let i = 0; i < kerdesek.length; i++) {
      const user_role_id = kerdesek[i].role_id;
      const [role_sor] = await db.query('SELECT name FROM role WHERE id = ?', [user_role_id]);
      kerdesek[i].role = role_sor[0]?.name || 'Ismeretlen';
    }

    res.json(kerdesek);
  } catch (error) {
    console.error('Hiba:', error);
    res.status(500).json({ error: 'Szerverhiba történt, próbáld újra később!' });
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
      return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }
    const [temakorRows] = await db.query(
      'SELECT id FROM temakor WHERE nev = ?',
      [temakor_nev]
    );
    if (temakorRows.length === 0) {
      return res.status(400).json({ error: `Nem létezik ilyen témakör: ${temakor_nev}` });
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
app.post('/api/userchange', authenticateToken, async (req, res) => {
  try {
    const {username, first_name, last_name, email, disabled, role, id} = req.body;
    if (!username || !first_name || !last_name || !email || !disabled || !role) {
      return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }
    const [roleRows] = await db.query(
      'SELECT id FROM role WHERE name = ?',
      [role]
    );
    if (roleRows.length === 0) {
      return res.status(400).json({ error: `Nem létezik ilyen rang: ${role}` });
    }
    const role_id = roleRows[0].id;
    await db.query(
      'UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ?, disabled = ?, role_id = ? WHERE id = ?;',
      [username, first_name, last_name, email, disabled, role_id, id]
    )
    res.json({ message: 'Sikeresen módosítva!' })
  } catch (err) {
    console.log(err)
  }
})
app.post('/api/ownprofilechange', authenticateToken, async (req, res) => {
  try {
    const {username, first_name, last_name, email} = req.body;
    if (!username || !first_name || !last_name || !email) {
      return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }
    await db.query(
      'UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ? WHERE id = ?;',
      [username, first_name, last_name, email]
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
      res.status(400).json({error: "Nincsen SQL-id!"})
      return;
    }
    await db.query(
      'DELETE FROM feladat WHERE id = ?;', [sqlid]
    )
    res.status(200).json({message: "Sikeres törlés!"})
  } catch (err) {
    res.status(400).json({error: "Szerverhiba történt, próbáld újra később!"})
  }
})

app.post('/api/userdelete', authenticateToken, async (req, res) => {
  try {
    const sqlid = req.body["id"]
    if (!sqlid) {
      res.status(400).json({error: "Nincsen SQL-id!"})
      return;
    }
    await db.query(
      'DELETE FROM users WHERE id = ?;', [sqlid]
    )
    res.status(200).json({message: "Sikeres törlés!"})
  } catch (err) {
    res.status(400).json({error: "Szerverhiba történt, próbáld újra később!"})
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
      return res.status(500).json({ error: 'Minden mezőt ki kell tölteni!' });
    }
    const [temakorRows] = await db.query(
      'SELECT id FROM temakor WHERE nev = ?',
      [temakor_nev]
    );
    if (temakorRows.length === 0) {
      return res.status(500).json({ error: `Nem létezik ilyen témakör: ${temakor_nev}` });
    }

    const temakor_id = temakorRows[0].id;
    await db.query(
      'INSERT INTO feladat (temakor_id, sorszam, cim, leiras, elvaras) VALUES (?, ?, ?, ?, ?)',
      [temakor_id, sorszam, cim, leiras, elvaras]
    )
    res.status(201).json({ message: 'Kérdés sikeresen közzétéve!' })
  } catch (error) {
    console.error('Hiba:', error)
    res.status(500).json({ error: 'Szerverhiba történt, próbáld újra később!' })
  }
});

// Bej+Reg

app.post('/register', async (req, res) => {
  const { username, password, first_name, last_name, email, avatar } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password, first_name, last_name, email, avatar, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, hashed, first_name, last_name, email, avatar, 3]);
    res.json({ message: 'Sikeres regisztráció' });
  } catch (err) {
    if (err.errno == 1062) {
      res.status(500).json({ error: 'A felhasználónév már létezik!' });
    } else {
      res.status(500).json({ error: 'Hiba a regisztrációnál!' });
    }
    console.log(err)
  }
});

app.post('/pwdchange', async (req, res) => {
  const {username, oldpassword, newpassword} = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows) {res.status(500).json({ error: 'Adatbázis hiba' }); return;};
    if (rows.length === 0) return res.status(400).json({ error: 'Hibás felhasználónév!' });
    const user = rows[0];
    const match = await bcrypt.compare(oldpassword, user.password);
    if (match) {
      const hashednewpassword = bcrypt.hash(newpassword, 10);
      const [searchingRows] = await db.query(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );
      if (searchingRows.length === 0) {
        return res.status(400).json({ error: "Nem létezik ilyen id-jú felhasználó" });
      }
      const id = searchingRows[0].id;
      await db.query(
        'UPDATE users SET password = ? WHERE id = ?;',
        [hashednewpassword, id]
      )
      res.status(201).json({ message: 'Sikeres jelszómódosítás!' })
    } else {
      res.status(400).json({ error: 'Hibás régi jelszó!' });
      return;
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({error: "Jelszómódosítási hiba"})
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows) {res.status(500).json({ error: 'Adatbázis hiba' }); return;};
    if (rows.length === 0) return res.status(400).json({ error: 'Hibás felhasználónév!' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Hibás jelszó!' });
    const token = jwt.sign({ id: user.id, username: user.username }, 'ed2d60efa09b793925b26bb76c1624cdb1cbfaca7cb47d98851a6f52130e6d342a3182798b23b90065abe7a8364b944e2b03e29bb48c41a1ac05c68fd9807c2e', {
      expiresIn: '1h',
    });

    res.json({ token, roleid: user.role_id, username: user.username });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bejelentkezési hiba' });
  }
});

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, 'ed2d60efa09b793925b26bb76c1624cdb1cbfaca7cb47d98851a6f52130e6d342a3182798b23b90065abe7a8364b944e2b03e29bb48c41a1ac05c68fd9807c2e');

    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ? AND deleted = 0 AND disabled = 0',
      [decoded.id]
    );
    if (users.length == 0) {
      return res.status(403).json({ error: 'A felhasználó nem létezik vagy tiltva van.' });
    }

    req.user = users[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Érvénytelen vagy lejárt token.' });
  }
}

app.listen(3000, () => {
  console.log('A backend szerver fut a http://localhost:3000 címen');
});
