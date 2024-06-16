const express = require('express);
const sql = require('sql');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const db = new sql.Database('./recipes.db');
app.use(bodyParser.json());
app.use(express.static(path.join(_dirname,'public')));
app.get('/search',(req, res) => {
  const query = req.query.q;
  const sql = `SELECT * FROM recipes WHERE name LIKE ? OR ingredients LIKE ?`;
  db.all(sql, [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ recipes: rows });
    });
});

app.get('/recipe/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM recipes WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ recipe: row });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
