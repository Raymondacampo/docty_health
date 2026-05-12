<div align="center">
    <img width="280" height="280" alt="dclogo" src="https://github.com/user-attachments/assets/83a6631b-93d7-482f-a979-ae800998f3f4" />
    <h1>DoctyHealth</h1>
    <p>A web application designed to simplify the process of finding and booking medical specialists from the comfort of your home.</p>
</div>

<div>

🔍 Advanced Search: Search engine to find doctors by specialty.

📅 Appointment Management: Integrated booking system for appointments.

⭐ Reviews & Favorites: Doctor rating system and favorites list.

🔐 Secure Auth: Google Login and session management with JWT.

</div>

## 🛠️ Tech Stack
- **Frontend:** Next.js (SSR), Tailwind CSS.
- **Backend:** Django / DRF.
- **Database:** PostgreSQL.
- **Auth:** Google OAuth + JWT.
- **Deploy:** Vercel / Render.

## ✨ Key Features
  - SSR con Next.js para SEO.
  - Backend en Django con PostgreSQL.
  - Diseño de base de datos relacional.
  - Middlewares personalizados para validación de JWT.
  - Autenticación Híbrida con GooleOAuth.

## 🚀 Getting Started
Sigue estos pasos para configurar el proyecto localmente.

📋 Prerrequisitos

    Node.js (v18 o superior)

    Python (3.10 o superior)

    PostgreSQL (en ejecución local)

🔧 Instalación
1. Clonar el repositorio

        git clone https://github.com/Raymondacampo/docty_health.git


2. Configuración del Backend (Django)

        cd backend

        python -m venv venv

        source venv/bin/activate 

        pip install -r requirements.txt

3. Configuración del Frontend (Next.js)

        cd ../frontend

        npm install

**⚙️ Variables de Entorno**

Crea un archivo .env tanto en la carpeta backend/ como en frontend/ basándote en los archivos .env.example. Asegúrate de configurar:
<div>

**Backend:**
<details>

    GOOGLE_CLIENT_ID

    GOOGLE_CLIENT_SECRET

    SECRET_KEY

    YOUR_API_KEY

    DEBUG

    PROD_SSL

    DB_NAME

    DB_USER

    DB_PASSWORD
</details>
</div>
<br>

**Frontend:**
<details>

    NEXT_PUBLIC_GOOGLE_CLIENT_ID

    YOUR_API_KEY

    NEXT_PUBLIC_API_URL

    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

</details>
<br>

**🏃 Ejecución**

Para ver la aplicación funcionando, inicia ambos servidores:

Backend: 
    
    python manage.py migrate

    python manage.py runserver

Frontend: 

    npm run dev

## 📁 Proyect structure

**Backend**
```
├── doctors/
├── users/
├── search/
├── reviews/
├── appointments/          # App Module (Appointments logic)
│   ├── admin.py           # Registration for the Django Admin interface
│   ├── models.py          # Database schema definitions (ORM)
│   ├── views.py           # Request handling and Business Logic
│   ├── urls.py            # App-level routing (Endpoint definitions)
│   └── serializers.py     # Data validation and JSON transformation (DRF)
├── config/                # Project Management folder
│   ├── settings.py        # Global configuration, middleware, and DB settings
│   ├── asgi.py            # Entry-point for ASGI-compatible web servers (for Async/WebSockets)
│   └── wsgi.py            # Entry-point for WSGI-compatible web servers (Standard deployment)│              
│   └── urls.py            # Root URL configuration (Includes app URLs)
└── manage.py              # Command-line utility for administrative tasks
```

**API LINKS**

    users/
    appointments/
    search/
    doctors/
    reviews/

**Frontend**
```
├── src/
│   ├── components/  # Shared UI components
│   ├── app/         # Next.js App Router (Pages & Layouts)
│   ├── assets/      # Project images
│   ├── context/     # React Context providers for stateManagement
│   ├── utils/       # Helper functions and formatting logic
│   └── lib/         # Third-party configurations and DB clients
└── public/          # Static assets (favicons, robots.txt)
```

## 🛠️ Technical Challenges & Engineering Solutions

**1. Legacy Database Migration & Refactoring**

The Challenge: Transitioning from a monolithic structure to a modular multi-app architecture without data loss. This required decoupling the api_user, doctors, and appointments modules while maintaining a shared PostgreSQL backbone.
The Solution: Executed a high-precision migration strategy using "Fake Migrations" and manual state manipulation. By strategically commenting out model fields and managing the django_migrations table, I successfully re-mapped existing data into a modular schema while preserving referential integrity.

**2. Complex Scheduling Logic & Temporal Integrity**

**🚧 The Challenge:**

- Healthcare availability is non-linear. A doctor might have repeating schedules, specific weekly overrides, and varied locations.

**🎯 The Solution:**

- Engineered a multi-layered relational system:

- Schedule: Defines the base behavioral patterns (time/location templates).

- WeekAvailability: Manages unique weekly instances to prevent scheduling collisions.

- WeekDay: A granular bridge model connecting specific dates and locations to available time slots.

- Appointment: Finalizes the handshake between patient and provider, validated against the available WeekDay slots to ensure zero double-booking.

**3. Hybrid Full-Stack Architecture (Next.js + Django)**

**🚧 The Challenge:**

Leveraging the speed of a modern React framework while maintaining the robust security and ORM capabilities of a mature backend.

**🎯 The Solution:**

Frontend: Utilized Next.js on Vercel for its superior DX, native Tailwind CSS support, and efficient client-side rendering.

Backend: Chose Django (deployed on Render) for its intuitive handling of relational databases and its powerful Django REST Framework (DRF) serializers. This allowed for granular control over Google Auth integration and complex data transformations.

**4. Data Validation & Cross-Model Integrity**

**🚧 The Challenge:**

Ensuring that patient sensitive data and doctor time-slots cannot be created in isolation or bypass business logic.

**🎯 The Solution:**

Implemented a Strict-Validation Middleware at the API level. Every endpoint enforces cross-model checks; for instance, an Appointment cannot be instantiated without a verified WeekDay match and a valid Patient profile, ensuring the database remains a "Single Source of Truth."