import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: process.env.PORT
});
  db.connect()

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("test werkt")
})



app.post("/shorten", async (req, res) => {
    const longURL = req.body.url;
    const randomshortCode = shortCodeGen();
    try {
        const result = await db.query(
          'INSERT INTO short_urls (url, short_code) VALUES ($1, $2) RETURNING *',
          [longURL, randomshortCode]
        );
    
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Fout bij opslaan van URL');
      }

})

function shortCodeGen(length = 6) {
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

app.get("/shorten/:id", async (req, res) => {
    const shortCode = req.params.id;
    try {
        const response = await db.query("select * from short_urls where short_code = $1", [shortCode])
        if (response.rows.length === 0) {
            res.status(404).send("Kan shortcode niet vinden");
        } else {
            res.send(response.rows);
        }
    } catch (err) {
        res.send("error namelijk" + err);
    }
})

app.put("/shorten/:id", async (req, res) => {
    const shortCode = req.params.id;
    const newUrl = req.body.url;
    try {
        const response = await db.query("update short_urls SET url = $1 WHERE short_code = $2 RETURNING *", [newUrl, shortCode]);
        if (response.rowCount === 0) {
            res.status(404).send("Shortcode niet gevonden");
        } else {
            res.status(200).json(response.rows[0]);
        }
    }
        catch (err) {
        res.send("error namelijk" + err);
    }
});

app.delete("/shorten/:id", async (req, res) => {
    const shortCode = req.params.id;
    try {
        const response = await db.query("DELETE FROM short_urls WHERE short_code = $1 RETURNING *", [shortCode]);
        if (response.rowCount === 0) {
            res.status(404).send("Shortcode niet gevonden");
        } else {
            res.status(200).send(`Shortcode '${shortCode}' succesvol verwijderd`);
        }

    }catch (err) {
        res.send("error namelijk" + err);
    }
})

app.get("/:id", async (req, res) => {
    const shortCode = req.params.id;
    try {
        const redirectURL = await db.query("SELECT url FROM short_urls WHERE short_code = $1", [shortCode])
        const result = await db.query(
            "UPDATE short_urls SET access_count = access_count + 1 WHERE short_code = $1 RETURNING url",
            [shortCode]
        );
        if (result.rowCount === 0) {
            return res.status(404).send("Shortcode niet gevonden");
        }

        res.redirect(redirectURL.rows[0].url); 

    } catch (err) {
        res.send("error namelijk" + err);
    }
})

app.get("/shorten/:id/stats", async (req, res) => {
    const shortCode = req.params.id;

    try {
        const result = await db.query(
            "SELECT id, url, short_code, created_at, updated_at, access_count FROM short_urls WHERE short_code = $1",
            [shortCode]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Shortcode niet gevonden");
        }

        const stats = {
            id: result.rows[0].id.toString(),
            url: result.rows[0].url,
            shortCode: result.rows[0].short_code,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at,
            accessCount: result.rows[0].access_count
        };

        res.status(200).json(stats);
    } catch (err) {
        res.status(500).send("Fout bij ophalen van statistieken: " + err.message);
    }
});


app.listen(port, () => {
    console.log(`server gestart op ${port}`)
})