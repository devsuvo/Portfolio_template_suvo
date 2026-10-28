"""
Website-er shob content ekhane. Edit kore browser refresh korlei site update hoye jabe.
(All site content lives here - sourced from github.com/devsuvo)

Icons: static/img/icons/<name>.svg  (Simple Icons - https://simpleicons.org)
Project images: static/img/projects/<slug>.webp  (na thakle auto mock-up dekhabe)
"""

SITE = {
    "name": "Suvo Dev",
    "first_name": "Suvo",
    "logo": "SD",
    "role": "Full Stack Web Developer",
    # Hero typing animation
    "roles": [
        "Full Stack Web Developer",
        "React & Next.js Developer",
        "WordPress & Shopify Expert",
        "Laravel Developer",
    ],
    "tagline": "You imagine it. I build it.",
    "intro": (
        "I build fast, thoughtful websites and web apps that help brands look sharp "
        "and work even better - from WordPress and Shopify to full stack React, "
        "Next.js and Laravel."
    ),
    "description": (
        "Suvo Dev - Full Stack Web Developer from Sylhet, Bangladesh. React, Next.js, "
        "Laravel, WordPress & Shopify. 110+ projects shipped with 99% client satisfaction."
    ),
    "location": "Sylhet, Bangladesh",
    "timezone": "GMT+6",
    "email": "sddev960@gmail.com",
    "phone": "+880 1601-721703",
    "whatsapp": "8801601721703",
    "availability": "Freelance · Worldwide",
    "response": "Replies within 24 hours",
    "since": 2021,
    "languages": "Bangla · English · Hindi",
    "cv_file": "Suvo_Dev_CV.pdf",          # static/files/ e rakhle "Download CV" button chalu hobe
    "fiverr": "https://www.fiverr.com/wordpressguru41",
    "github": "https://github.com/devsuvo",
    "linkedin": "https://www.linkedin.com/in/devsuvo/",
    "specialties": ["React", "Next.js", "TypeScript", "Laravel", "WordPress", "Shopify"],
    "about": [
        "I'm Suvo, a full stack web developer based in Sylhet, Bangladesh, building "
        "fast, thoughtful websites and web apps that help brands look sharp and work "
        "even better.",
        "My expertise spans React, Next.js, TypeScript, PHP and Laravel, along with "
        "custom WordPress development tailored to each client. A solid grounding in "
        "UI/UX design and SEO means what I build doesn't just look great - it performs "
        "across every platform.",
        "For the past 5+ years I've worked with clients across the US, Europe and "
        "Bangladesh - shipping everything from WordPress marketing sites and Shopify "
        "stores to full stack React applications.",
    ],
    "now": [
        "Building the official website for Hexa's Zindabazar, Sylhet",
        "Exploring advanced Next.js - App Router, Server Components, performance",
        "Deepening JavaScript fundamentals and practising DSA",
    ],
}

SOCIALS = [
    {"label": "Email", "value": SITE["email"], "url": f"mailto:{SITE['email']}", "icon": "mail", "color": "#ea4335"},
    {"label": "WhatsApp", "value": SITE["phone"], "url": f"https://wa.me/{SITE['whatsapp']}", "icon": "whatsapp", "color": "#25d366"},
    {"label": "LinkedIn", "value": "in/devsuvo", "url": SITE["linkedin"], "icon": "linkedin", "color": "#0a66c2"},
    {"label": "Fiverr", "value": "wordpressguru41", "url": SITE["fiverr"], "icon": "fiverr", "color": "#1dbf73"},
    {"label": "GitHub", "value": "github.com/devsuvo", "url": SITE["github"], "icon": "github", "color": "#ffffff"},
]

STATS = [
    {"value": 5, "suffix": "+", "label": "Years experience"},
    {"value": 110, "suffix": "+", "label": "Projects shipped"},
    {"value": 99, "suffix": "%", "label": "Client satisfaction"},
    {"value": 20, "suffix": "+", "label": "Technologies"},
]

SERVICES = [
    {"title": "Web Applications", "text": "React, Next.js and Laravel builds - scalable back-ends, clean APIs, easy to maintain.", "icon": "nextdotjs"},
    {"title": "WordPress & CMS", "text": "Custom themes and Elementor builds that clients can actually edit themselves.", "icon": "wordpress"},
    {"title": "E-commerce", "text": "Shopify stores, WooCommerce shops and Wix-to-Shopify migrations that convert.", "icon": "shopify"},
    {"title": "UI/UX Design", "text": "Interfaces designed in Figma around real users - not trends.", "icon": "figma"},
    {"title": "SEO & Performance", "text": "Technical SEO and speed work that moves rankings, not just scores.", "icon": "seo"},
]

# Stack orbit - icon = static/img/icons/<icon>.svg, color = brand color on dark bg
SKILLS = [
    {"name": "React", "icon": "react", "color": "#61dafb", "group": "Frontend",
     "role": "Component-driven interfaces, dashboards and interactive product UIs."},
    {"name": "Next.js", "icon": "nextdotjs", "color": "#ffffff", "group": "Frontend",
     "role": "App Router, Server Components and SEO-friendly, fast production sites."},
    {"name": "TypeScript", "icon": "typescript", "color": "#3178c6", "group": "Language",
     "role": "Type-safe codebases that stay maintainable as products grow."},
    {"name": "Tailwind CSS", "icon": "tailwindcss", "color": "#06b6d4", "group": "Styling",
     "role": "Pixel-precise, responsive design systems built at speed."},
    {"name": "Laravel", "icon": "laravel", "color": "#ff2d20", "group": "Backend",
     "role": "Robust PHP back-ends, REST APIs, auth and admin panels."},
    {"name": "PHP", "icon": "php", "color": "#8892bf", "group": "Backend",
     "role": "Custom server-side logic, plugins and integrations."},
    {"name": "WordPress", "icon": "wordpress", "color": "#3fa2d9", "group": "CMS",
     "role": "Custom themes, plugins and editable marketing sites."},
    {"name": "Elementor", "icon": "elementor", "color": "#e2457a", "group": "CMS",
     "role": "Custom layouts clients can manage - tuned for performance."},
    {"name": "Shopify", "icon": "shopify", "color": "#7ab55c", "group": "E-commerce",
     "role": "Storefront design, catalog setup and payment integration."},
    {"name": "Figma", "icon": "figma", "color": "#f24e1e", "group": "Design",
     "role": "Wireframes, UI design and clickable prototypes before a line of code."},
]

# Projects - filter: "web-app" | "website" | "ecommerce" | "tool"
# image: static/img/projects/<slug>.webp thakle screenshot, na thakle mock-up
PROJECTS = [
    {
        "slug": "hexas-zindabazar", "title": "Hexa's Zindabazar", "category": "Client Website",
        "filter": "website", "year": "2026", "image": True,
        "summary": "Official website for one of Sylhet's leading IELTS & Spoken English institutes.",
        "description": "Building and maintaining the official website for Hexa's Zindabazar - an IELTS & Spoken English coaching centre in Sylhet. The site handles course discovery, exam registration and showcases student success, backed by ongoing performance and SEO work.",
        "features": ["Course pages & upcoming batches", "Exam registration flow", "Student success showcase", "Blog & study materials", "Ongoing performance & SEO improvements"],
        "tags": ["WordPress", "Elementor", "SEO"],
        "c1": "#ff3b5c", "c2": "#2a1a6e", "live": "https://hexaszindabazar.com", "source": "",
    },
    {
        "slug": "campusflow-erp", "title": "CampusFlow ERP", "category": "Higher-Education ERP",
        "filter": "web-app", "year": "2026", "image": False,
        "summary": "College ERP with dedicated dashboards for every role on campus.",
        "description": "A complete college ERP and higher-education management platform. Every stakeholder - from the principal to parents - gets a dedicated dashboard, while modules cover the full academic and administrative lifecycle.",
        "features": ["15 role dashboards - Super Admin, Principal, HOD, Faculty, Student, Parent", "Admissions, examinations & transcripts", "Finance, HR, library, hostel, transport & placement", "QR attendance & digital student ID cards", "AI advisor and command palette"],
        "tags": ["Next.js", "TypeScript", "Tailwind", "Recharts", "Gemini AI"],
        "c1": "#38d6ff", "c2": "#123a6b", "live": "", "source": "https://github.com/devsuvo/CampusFlow-ERP",
    },
    {
        "slug": "ielts-management", "title": "IELTS Platform", "category": "EdTech Platform",
        "filter": "web-app", "year": "2026", "image": False,
        "summary": "IELTS institute platform - course sales, mock tests and band analytics.",
        "description": "An end-to-end platform for IELTS institutes: students discover and buy courses, sit mock tests and track their band score, while counselors, teachers and accounts each manage their part of the journey.",
        "features": ["Course catalog & online admission", "Mock test engine & band analytics", "Band score predictor & vocab builder", "Student, teacher, counselor & accounts dashboards", "AI IELTS assistant"],
        "tags": ["Next.js", "TypeScript", "Recharts", "Gemini AI"],
        "c1": "#ff6b9a", "c2": "#5a1a3c", "live": "", "source": "https://github.com/devsuvo/IELTS-Management",
    },
    {
        "slug": "suvo-grocery", "title": "Suvo Grocery", "category": "E-commerce Store",
        "filter": "ecommerce", "year": "2026", "image": True,
        "summary": "Fresh-grocery store with express delivery, order tracking and admin.",
        "description": "A full grocery e-commerce experience - fresh produce, daily essentials and bakery delivered same-day. Customers browse, filter and check out; admins manage products and orders.",
        "features": ["Shop, categories & offers", "Cart, checkout & order tracking", "Customer accounts & dashboard", "Admin dashboard", "Dark mode & wishlist"],
        "tags": ["Next.js", "TypeScript", "Tailwind"],
        "c1": "#22c55e", "c2": "#0f4d2a", "live": "https://suvo-black.vercel.app", "source": "https://github.com/devsuvo/Suvo",
    },
    {
        "slug": "challengehub", "title": "ChallengeHub", "category": "Gamified Web App",
        "filter": "web-app", "year": "2026", "image": True,
        "summary": "Structured 30-day challenges to build consistency and master new skills.",
        "description": "A gamified habit platform where users join structured challenges, complete daily tasks, earn points and climb the leaderboard alongside a community.",
        "features": ["Challenges with daily tasks", "Points, streaks & achievements", "Leaderboard & community", "Profile, pricing & admin panel"],
        "tags": ["Next.js", "TypeScript", "Recharts"],
        "c1": "#7c5cff", "c2": "#2b1d6b", "live": "https://challangehub-dun.vercel.app", "source": "https://github.com/devsuvo/Challangehub",
    },
    {
        "slug": "track-attendance", "title": "Track Attendance", "category": "Attendance SaaS",
        "filter": "web-app", "year": "2026", "image": False,
        "summary": "Multi-campus attendance system with QR scanning and role dashboards.",
        "description": "Supports multi-campus, multi-branch, multi-class and multi-department institutions with dedicated dashboards for Super Admin, Institution Admin, Teachers, Students, Parents, HR and Attendance Officers.",
        "features": ["QR-code scanning & kiosk hardware hub", "Super Admin, Admin, Teacher, Student & Parent portals", "Notification centre & data export", "Multi-campus / branch / department structure"],
        "tags": ["Next.js", "TypeScript", "QR", "Recharts"],
        "c1": "#ffb547", "c2": "#5a3a0a", "live": "", "source": "https://github.com/devsuvo/Track-Attendance",
    },
    {
        "slug": "eduflow-lms", "title": "EduFlow LMS", "category": "Learning Platform",
        "filter": "web-app", "year": "2026", "image": False,
        "summary": "Learning management system with course marketplace and video player.",
        "description": "A learning management system with a public course marketplace, an in-app course player and separate dashboards for students, instructors and admins.",
        "features": ["Course search, details & cart", "Course player", "Student, instructor & admin dashboards", "Pricing, blog & success stories", "AI assistant widget"],
        "tags": ["Next.js", "TypeScript", "Tailwind", "Motion"],
        "c1": "#00ffa3", "c2": "#0b5a43", "live": "", "source": "https://github.com/devsuvo/EduFlow-LMS",
    },
    {
        "slug": "evergreen-academy", "title": "Evergreen Academy", "category": "School Website",
        "filter": "website", "year": "2026", "image": True,
        "summary": "Modern school website with admissions, events, gallery and blog.",
        "description": "A premium school website that presents academics, admissions and campus life - with dynamic events and blog pages and a light/dark theme.",
        "features": ["Academics & admission pages", "Teachers, events & gallery", "Blog with detail pages", "Light / dark theme"],
        "tags": ["Next.js", "TypeScript", "Tailwind"],
        "c1": "#3b82f6", "c2": "#14306b", "live": "https://school-website-ten-fawn.vercel.app", "source": "https://github.com/devsuvo/school-website",
    },
    {
        "slug": "flow-saas-suite", "title": "Flow SaaS Suite", "category": "SaaS Product Sites",
        "filter": "website", "year": "2026", "image": False,
        "summary": "Five SaaS product sites - CRM, invoicing, email, social and AI writing.",
        "description": "A series of conversion-focused SaaS websites, each with a full marketing funnel: features, integrations, pricing, security, testimonials, FAQ and interactive product demos.",
        "features": ["NexusCRM - customer relationship management", "InvoiceFlow - live invoice generator & ROI calculator", "MailFlow - email marketing automation", "SocialFlow - social media scheduling", "WriteFlow AI - AI writing assistant"],
        "tags": ["Next.js", "TypeScript", "Tailwind", "Motion"],
        "c1": "#a78bfa", "c2": "#3b1f6e", "live": "", "source": "https://github.com/devsuvo?tab=repositories",
    },
    {
        "slug": "dev-stack-builder", "title": "Dev Stack Builder", "category": "Interactive Tool",
        "filter": "tool", "year": "2026", "image": True,
        "summary": "Explore modern technologies and build your own dev stack.",
        "description": "A React app where developers explore a curated library of frontend, backend, database and DevOps tools, then assemble a personal stack from an interactive sidebar.",
        "features": ["Technology catalog loaded from JSON", "Stack builder with duplicate protection", "Toast feedback & loading states", "Responsive gradient UI"],
        "tags": ["React", "Vite", "Tailwind", "DaisyUI"],
        "c1": "#f472b6", "c2": "#5b1d4a", "live": "https://dev-stack-builder-five.vercel.app", "source": "https://github.com/devsuvo/dev-stack-builder",
    },
    {
        "slug": "motion-store", "title": "Motion Store", "category": "Desktop App · Python",
        "filter": "tool", "year": "2026", "image": False,
        "summary": "Motion-graphics template editor with live preview and video export.",
        "description": "A Python desktop app for creating motion graphics: pick a template, edit text, colours, fonts and speed, preview it live and export to video - including IELTS reels for social media.",
        "features": ["15 built-in animated templates", "Full editing - text, fonts, colours, backgrounds", "Live preview with timeline scrub & undo/redo", "Export MP4, transparent MOV, GIF & PNG sequence", "Presets for 1080p, 4K and 9:16 Reels"],
        "tags": ["Python", "PySide6"],
        "c1": "#facc15", "c2": "#4d3a06", "live": "", "source": "https://github.com/devsuvo/motion-template",
    },
]

PROJECT_FILTERS = [
    ("all", "All"),
    ("web-app", "Web Apps"),
    ("website", "Websites"),
    ("ecommerce", "E-commerce"),
    ("tool", "Tools"),
]

EXPERIENCE = [
    {"role": "Web Developer", "company": "Hexa's Zindabazar", "place": "Sylhet, Bangladesh",
     "period": "Jan 2026 - Present", "short": "Hexa's",
     "text": "Building and maintaining the official Hexa's Zindabazar website - course pages, exam registration, student success showcases and blog.",
     "points": ["Owns the site end-to-end, from content structure to deployment", "Ongoing performance & SEO improvements"],
     "tags": ["WordPress", "Elementor", "SEO"]},
    {"role": "Freelance Web Developer", "company": "Fiverr", "place": "Remote · Worldwide",
     "period": "2021 - Present", "short": "Fiverr",
     "text": "Running my own practice - web design, WordPress and full stack builds for clients across the US, Europe and Bangladesh.",
     "points": ["110+ projects shipped", "Consistent five-star reviews · 99% client satisfaction"],
     "tags": ["WordPress", "Shopify", "React", "Next.js"]},
    {"role": "Website Admin & Developer", "company": "GreatestDeals LLC", "place": "Playa Del Rey, CA",
     "period": "Jan 2023 - Dec 2023", "short": "GreatestDeals",
     "text": "Managed and developed company websites, handling administration, updates and ongoing site maintenance.",
     "points": ["Website administration & content updates", "Ongoing maintenance and improvements"],
     "tags": ["WordPress", "Web Admin"]},
    {"role": "WordPress Developer", "company": "MetaTechDesk", "place": "New York · Remote",
     "period": "2 years", "short": "MetaTechDesk",
     "text": "Built and maintained client sites with Elementor - custom layouts, performance tuning and ongoing site management.",
     "points": ["Custom Elementor layouts for client brands", "Performance tuning & site management"],
     "tags": ["WordPress", "Elementor"]},
]

TESTIMONIALS = [
    {"quote": "Delivered exactly what we needed - fast, clean, and better than the design we gave him.",
     "name": "Michael R.", "role": "Startup Founder", "country": "United States"},
    {"quote": "Our WordPress site went from slow and dated to modern and lightning fast.",
     "name": "Elena K.", "role": "Marketing Lead", "country": "Germany"},
    {"quote": "Professional, patient, and honest about timelines. Best freelancer we've worked with on Fiverr.",
     "name": "Sarah T.", "role": "Agency Director", "country": "United Kingdom"},
]

# Contact form er "What do you need?" chips
FORM_SERVICES = ["Web App", "WordPress", "Shopify / E-commerce", "UI/UX Design", "SEO & Speed", "Something else"]
FORM_BUDGETS = ["< $500", "$500 - $1.5k", "$1.5k - $5k", "$5k+", "Not sure yet"]

# Scrolling logo rows (name, icon)
MARQUEE = [
    ("React", "react"), ("Next.js", "nextdotjs"), ("TypeScript", "typescript"), ("JavaScript", "javascript"),
    ("Tailwind CSS", "tailwindcss"), ("Laravel", "laravel"), ("PHP", "php"), ("MySQL", "mysql"),
    ("WordPress", "wordpress"), ("Elementor", "elementor"), ("Shopify", "shopify"), ("WooCommerce", "woocommerce"),
    ("Wix", "wix"), ("Webflow", "webflow"), ("Figma", "figma"), ("Firebase", "firebase"),
    ("Bootstrap", "bootstrap"), ("HTML5", "html5"), ("CSS", "css"), ("Git", "git"),
    ("GitHub", "github"), ("Vercel", "vercel"), ("Python", "python"),
]

NAV = [
    ("01", "Home", "home"),
    ("02", "Profile", "profile"),
    ("03", "Stack", "stack"),
    ("04", "Work", "work"),
    ("05", "Journey", "journey"),
    ("06", "Contact", "contact"),
]
