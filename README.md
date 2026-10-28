# Suvo Dev — Portfolio (Python + Flask)

Sci-fi / HUD style personal portfolio for **Suvo Dev**, Full Stack Web Developer from Sylhet, Bangladesh.
Content is taken from [github.com/devsuvo](https://github.com/devsuvo).

## Run

```bash
pip install -r requirements.txt
python app.py
```

Browser e open korun: http://127.0.0.1:5000  (`?noboot` dile intro animation skip hobe)

## Customize

| Ki change korben | Kothay |
|---|---|
| Naam, role, about, stats, services, skills, projects, experience, testimonials, contact | `data.py` |
| Hero portrait | `static/img/profile.png` (transparent PNG best) |
| Project screenshot | `static/img/projects/<slug>.webp` (1200×750). Na thakle auto mock-up dekhabe |
| Tech / social icon | `static/img/icons/<name>.svg` ([simpleicons.org](https://simpleicons.org)) |
| CV download | `static/files/Suvo_Dev_CV.pdf` rakhle "Download CV" button dekhabe (na thakle "Hire me on Fiverr") |
| Color / design | `static/css/style.css` er upore `:root` variables |

## Contact form

- Proti message `instance/messages.json` e save hoy.
- Email e pete chaile environment variable set korun (Gmail er jonno [App Password](https://myaccount.google.com/apppasswords) lagbe):

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sddev960@gmail.com
SMTP_PASSWORD=<16-digit app password>
MAIL_TO=sddev960@gmail.com
```

- Spam protection: honeypot field + IP proti 10 minute e max 5 ta message.

## Features

- Boot screen, custom cursor, HUD (section, mouse X/Y, Sylhet time)
- Lenis smooth scrolling — ekta single animation loop shob scroll effect chalay
- Word-by-word heading reveal, hero intro, parallax portrait with circuit "x-ray" hover
- Scroll-driven tech-stack orbit
- Filterable projects with real screenshots + project dossier modal (← → keys)
- Experience timeline (keyboard + swipe), client testimonials
- Contact form with service / budget chips, WhatsApp button
- SEO: meta + Open Graph, JSON-LD Person schema, `/sitemap.xml`, `/robots.txt`
- Cache-busted static files, security headers, reduced-motion support, mobile friendly

## Structure

```
app.py              Flask routes (/, /cv, /api/contact, /project/<slug>, /sitemap.xml, /robots.txt)
data.py             All website content
templates/          index.html, 404.html
static/css/         style.css
static/js/          main.js
static/vendor/      lenis (smooth scroll)
static/img/         logo.svg, profile.png, icons/, projects/
static/files/       CV pdf
```

## Deploy

PythonAnywhere ba Render e `pip install gunicorn` kore `gunicorn app:app` diye run korun.
