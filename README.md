# 🔗 URL Shortening Service

Een eenvoudige URL-shortener gebouwd met Node.js, Express en PostgreSQL. Maak korte codes aan voor lange URLs, bekijk statistieken en redirect bezoekers met gemak.

🌍 Projectpagina: [https://roadmap.sh/projects/url-shortening-service](https://roadmap.sh/projects/url-shortening-service)

---

## 📦 Functionaliteiten

- ✅ Shorten van lange URLs
- ✅ Redirecten via een korte code
- ✅ Updaten of verwijderen van shortcodes
- ✅ Statistieken bekijken per shortcode (inclusief access count)

---

## 🚀 Installatie en starten

### 1. Clone de repo
```bash
git clone https://github.com/jouwgebruikersnaam/url-shortening-service.git
cd url-shortening-service
```

### 2. Installeer dependencies
```bash
npm install
```

### 3. Zet je PostgreSQL database op
```sql
CREATE DATABASE shorturl;

CREATE TABLE short_urls (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  access_count INTEGER DEFAULT 0
);
```

### 4. Start de server
```bash
node index.js
```

Server draait op [http://localhost:3000](http://localhost:3000)

---

## 📬 API Endpoints

| Methode | Endpoint               | Beschrijving                               |
|---------|------------------------|--------------------------------------------|
| POST    | `/shorten`             | Nieuwe short URL aanmaken                  |
| GET     | `/:id`                 | Redirect naar originele URL                |
| GET     | `/shorten/:id`         | Details van short URL ophalen              |
| PUT     | `/shorten/:id`         | Update de lange URL van een shortcode      |
| DELETE  | `/shorten/:id`         | Verwijder een shortcode                    |
| GET     | `/shorten/:id/stats`   | Bekijk statistieken van een shortcode      |

---

## 🧠 Geïnspireerd door

📚 [roadmap.sh - URL Shortening Service Project](https://roadmap.sh/projects/url-shortening-service)

---

## 📄 Licentie

MIT-licentie – gebruik het zoals je wil!

