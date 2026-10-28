"""
Suvo Dev - Portfolio website (Flask)

Run:
    pip install -r requirements.txt
    python app.py
Then open http://127.0.0.1:5000

Optional - get every contact-form message in your inbox by setting:
    SMTP_HOST=smtp.gmail.com  SMTP_PORT=587
    SMTP_USER=you@gmail.com   SMTP_PASSWORD=<gmail app password>
    MAIL_TO=sddev960@gmail.com
"""

import json
import os
import re
import smtplib
import threading
import time
from collections import defaultdict, deque
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path

from flask import Flask, Response, abort, jsonify, redirect, render_template, request, send_from_directory, url_for

from data import (
    EXPERIENCE, FORM_BUDGETS, FORM_SERVICES, MARQUEE, NAV, PROJECT_FILTERS, PROJECTS,
    SERVICES, SITE, SKILLS, SOCIALS, STATS, TESTIMONIALS,
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
MESSAGES_FILE = BASE_DIR / "instance" / "messages.json"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
RATE_LIMIT = (5, 600)  # max 5 messages per IP per 10 minutes

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 60 * 60 * 24 * 30  # assets are cache-busted below
_messages_lock = threading.Lock()
_recent_posts = defaultdict(deque)


# ---------- helpers ----------
def asset(filename):
    """Static URL with a version query so browsers re-download only changed files."""
    path = STATIC_DIR / filename
    version = int(path.stat().st_mtime) if path.exists() else 0
    return url_for("static", filename=filename, v=version)


def find_profile_photo():
    """static/img/profile.(png|jpg|jpeg|webp) thakle hero-te seta dekhabe."""
    for ext in ("png", "webp", "jpg", "jpeg"):
        if (STATIC_DIR / "img" / f"profile.{ext}").exists():
            return f"img/profile.{ext}"
    return None


def cv_available():
    return (STATIC_DIR / "files" / SITE["cv_file"]).exists()


def project_image(slug):
    return f"img/projects/{slug}.webp" if (STATIC_DIR / "img" / "projects" / f"{slug}.webp").exists() else None


def rate_limited(ip):
    limit, window = RATE_LIMIT
    now = time.time()
    hits = _recent_posts[ip]
    while hits and now - hits[0] > window:
        hits.popleft()
    if len(hits) >= limit:
        return True
    hits.append(now)
    return False


def send_notification(entry):
    """Email the message to MAIL_TO if SMTP is configured. Runs in a background thread."""
    host, user, password = os.getenv("SMTP_HOST"), os.getenv("SMTP_USER"), os.getenv("SMTP_PASSWORD")
    if not (host and user and password):
        return
    msg = EmailMessage()
    msg["Subject"] = f"New project brief from {entry['name']}"
    msg["From"] = user
    msg["To"] = os.getenv("MAIL_TO", SITE["email"])
    msg["Reply-To"] = entry["email"]
    msg.set_content(
        f"Name: {entry['name']}\nEmail: {entry['email']}\n"
        f"Services: {', '.join(entry['services']) or '-'}\nBudget: {entry['budget'] or '-'}\n\n"
        f"{entry['message']}\n\n-- received {entry['received_at']}"
    )
    try:
        with smtplib.SMTP(host, int(os.getenv("SMTP_PORT", "587")), timeout=20) as smtp:
            smtp.starttls()
            smtp.login(user, password)
            smtp.send_message(msg)
    except Exception as exc:  # never break the form because email failed
        app.logger.warning("Email notification failed: %s", exc)


# ---------- template globals ----------
@app.context_processor
def inject_globals():
    return {"site": SITE, "nav": NAV, "year": datetime.now().year, "asset": asset}


@app.after_request
def security_headers(resp):
    resp.headers.setdefault("X-Content-Type-Options", "nosniff")
    resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    resp.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    return resp


# ---------- pages ----------
@app.route("/")
def index():
    projects = [dict(p, image_path=project_image(p["slug"]) if p.get("image") else None) for p in PROJECTS]
    return render_template(
        "index.html",
        socials=SOCIALS,
        stats=STATS,
        services=SERVICES,
        skills=SKILLS,
        projects=projects,
        project_filters=PROJECT_FILTERS,
        experience=EXPERIENCE,
        testimonials=TESTIMONIALS,
        form_services=FORM_SERVICES,
        form_budgets=FORM_BUDGETS,
        marquee=MARQUEE,
        photo=find_profile_photo(),
        has_cv=cv_available(),
        page_url=request.url_root,
    )


@app.route("/cv")
def download_cv():
    if not cv_available():
        return redirect(url_for("index") + "#contact")
    return send_from_directory(STATIC_DIR / "files", SITE["cv_file"], as_attachment=True)


@app.route("/project/<slug>")
def project_json(slug):
    for project in PROJECTS:
        if project["slug"] == slug:
            return jsonify(project)
    abort(404)


# ---------- contact API ----------
@app.post("/api/contact")
def contact():
    payload = request.get_json(silent=True) or request.form

    # Honeypot field - bots fill it, humans never see it
    if payload.get("website"):
        return jsonify(ok=True, message="Transmission received.")

    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "").split(",")[0].strip()
    if rate_limited(ip):
        return jsonify(ok=False, errors={"form": "Too many messages - please try again in a few minutes."}), 429

    name = str(payload.get("name") or "").strip()
    email = str(payload.get("email") or "").strip()
    message = str(payload.get("message") or "").strip()
    budget = str(payload.get("budget") or "").strip()
    services = payload.get("services") or []
    if isinstance(services, str):
        services = [services]
    services = [s for s in services if s in FORM_SERVICES]
    budget = budget if budget in FORM_BUDGETS else ""

    errors = {}
    if not 2 <= len(name) <= 100:
        errors["name"] = "Please enter your name."
    if not EMAIL_RE.match(email) or len(email) > 200:
        errors["email"] = "Please enter a valid email."
    if not 10 <= len(message) <= 3000:
        errors["message"] = "Tell me a little more (at least 10 characters)."
    if errors:
        return jsonify(ok=False, errors=errors), 400

    entry = {
        "name": name,
        "email": email,
        "services": services,
        "budget": budget,
        "message": message,
        "received_at": datetime.now().isoformat(timespec="seconds"),
    }
    with _messages_lock:
        MESSAGES_FILE.parent.mkdir(exist_ok=True)
        try:
            messages = json.loads(MESSAGES_FILE.read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            messages = []
        messages.append(entry)
        MESSAGES_FILE.write_text(json.dumps(messages, indent=2, ensure_ascii=False), encoding="utf-8")

    threading.Thread(target=send_notification, args=(entry,), daemon=True).start()
    app.logger.info("New message from %s <%s>", name, email)
    return jsonify(ok=True, message="Transmission received - I'll reply within 24 hours.")


# ---------- SEO ----------
@app.route("/robots.txt")
def robots():
    body = f"User-agent: *\nAllow: /\nSitemap: {request.url_root}sitemap.xml\n"
    return Response(body, mimetype="text/plain")


@app.route("/sitemap.xml")
def sitemap():
    today = datetime.now().date().isoformat()
    body = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"  <url><loc>{request.url_root}</loc><lastmod>{today}</lastmod><priority>1.0</priority></url>\n"
        "</urlset>\n"
    )
    return Response(body, mimetype="application/xml")


@app.errorhandler(404)
def not_found(_error):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)
