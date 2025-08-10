# Minsoto - A Social Productivity Platform

**Tired of social media that's built for distraction? Minsoto is a new social network designed for focus and growth.** Instead of a single noisy feed, you join specific "Circles" for your hobbies, skills, and goals. It's the first social platform where your community actively helps you achieve your goals, turning passive scrolling into productive action.

---

## Table of Contents

1.  [Project Vision & Philosophy](#project-vision--philosophy)
2.  [Core MVP Features](#core-mvp-features)
3.  [Technical Architecture](#technical-architecture)
4.  [Database Schema Overview](#database-schema-overview)
5.  [Getting Started (Local Setup)](#getting-started-local-setup)
6.  [Core API Endpoints (MVP)](#core-api-endpoints-mvp)
7.  [Future Roadmap](#future-roadmap)

---

## Project Vision & Philosophy

Minsoto is founded on three core principles:

* **Intention:** Every action, from joining a circle to making a connection, is a deliberate choice. We aim to replace mindless scrolling with mindful engagement.
* **Focus:** The UI is designed to minimize distraction. The "Focused Feed" allows users to immerse themselves in a single topic, while "Project Circles" provide a dedicated space for deep work and collaboration.
* **Ownership:** A user's profile is their personal, productive space. The tiling widget system turns it from a static resume into a living dashboard of their ambitions and progress.

The name **Minsoto** is inspired by the concepts of **"Mindfulness"** and the Japanese **"Soto"** school of Zen, reflecting our mission to create a calm, organized, and intentional online space.

---

## Core MVP Features

The Minimum Viable Product (MVP) is built around these five pillars:

#### 1. Personal Connections (Two-Tier System)
A unique social graph that separates casual and intimate relationships.
* **Connection:** A user can send a "Connection Request" to another user *within a specific shared Interest*. If accepted, they can see each other's posts *only* from that common interest. This allows for low-stakes, topic-focused following.
* **Friend:** A mutual, intimate relationship. After a "Friend Request" is accepted, both users can see the entirety of each other's profiles and all their posts, regardless of the circle.

#### 2. Global & Interest-Based Feeds
Content consumption is designed for both broad discovery and deep focus.
* **Global Feed:** The default home page aggregates posts from all of a user's joined circles and all posts from their friends.
* **Focused Feed:** By clicking on a specific circle, the user can filter the feed to show content exclusively from that community.

#### 3. Customizable Tiling Profile
The user's profile is a dynamic, grid-based canvas that functions like a "productivity desktop" with a tiling window manager.
* **Tiling System:** Users "open" widgets which automatically tile and resize to fill the space. They can create horizontal/vertical splits and resize panes, similar to tools like i3, Komorebi, or tmux.
* **Dynamic Widgets:** Users can add widgets for habit streaks, highlighted posts, their circles, project progress, and more.
* **Theming:** Users can change the color palette and banner image of their profile.

#### 4. Collaboration & Habit Tracking
Minsoto is a platform for *doing*, not just discussing.
* **Project Circles:** Special groups for working on projects, building habits, or accountability. They feature unique tools not available in standard "Interest Circles."
* **Habit Tracking & Streaks:** Users can define a habit and "check in" daily to build a streak, which can be displayed as a widget on their profile (inspired by the GitHub contribution graph).
* **Shared Accountability:** Users can partner with friends within a Project Circle to share progress and hold each other accountable.

#### 5. Community Extension Store
Empowering the community to build the tools they need.
* **Client-Side Extensions:** The store will feature widgets and tools built by the community. These extensions run entirely on the user's browser.
* **Secure, Scoped API Access:** The Minsoto backend provides data to these extensions via a secure API. Extensions must request specific permissions (e.g., `read:streaks`, `read:posts`), and the user must explicitly grant consent before the extension can access any data.

---

## Technical Architecture

Minsoto is built on a modern, decoupled architecture.

* **Frontend:** **Next.js** (React Framework)
    * **Styling:** Tailwind CSS for utility-first styling.
    * **State Management:** Zustand for simple, lightweight global state management (authentication, user profile).
    * **UI Components:** Radix UI or Shadcn/UI for accessible, unstyled component primitives.
    * **Profile Grid:** `react-mosaic` or a similar library for the tiling window manager functionality.
* **Backend:** **Django** & **Django REST Framework** (Python)
    * **Authentication:** JWT (JSON Web Tokens) for stateless, secure API authentication.
    * **Database:** PostgreSQL for its robustness and ability to handle complex relational data.
* **Deployment:**
    * **Frontend:** Vercel
    * **Backend:** DigitalOcean App Platform
    * **Database:** DigitalOcean Managed PostgreSQL
    * **File Storage:** DigitalOcean Spaces (for user-uploaded media)

---

## Database Schema Overview

The core data structure is designed to be relational and scalable.

```plaintext
- CustomUser (extends auth.User)
  - id (PK)
  - username, email, password
  - bio, profile_picture_url, banner_image_url, theme
  - profile_layout (JSONField)

- Interest
  - id (PK)
  - name (unique)

- Circle
  - id (PK)
  - name (unique)
  - description
  - type ('INTEREST' or 'PROJECT')
  - owner (FK to CustomUser)

- CircleMembership
  - user (FK to CustomUser)
  - circle (FK to Circle)

- Post
  - id (PK)
  - author (FK to CustomUser)
  - circle (FK to Circle)
  - content
  - is_pinned (BooleanField)
  - created_at

- Connection
  - requester (FK to CustomUser)
  - receiver (FK to CustomUser)
  - interest (FK to Interest)
  - status ('pending', 'accepted')

- Friendship
  - requester (FK to CustomUser)
  - receiver (FK to CustomUser)
  - status ('pending', 'accepted')

- Habit
  - id (PK)
  - user (FK to CustomUser)
  - circle (FK to Circle)
  - name

- Streak
  - habit (FK to Habit, OneToOne)
  - current_streak
  - last_checkin_date
```
## Getting Started (Local Setup)

Follow these steps to set up and run the Minsoto project on your local machine.

### Backend (Django)

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/minsoto.git](https://github.com/your-username/minsoto.git)
    cd minsoto/backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Mac/Linux
    .\venv\Scripts\activate    # On Windows
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up the database:**
    ```bash
    python manage.py migrate
    ```
5.  **Create a superuser:**
    ```bash
    python manage.py createsuperuser
    ```
6.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be available at `http://127.0.0.1:8000`.

### Frontend (Next.js)

1.  **Navigate to the frontend directory:**
    ```bash
    # From the root project folder
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

---

## Core API Endpoints (MVP)

* `POST /api/auth/register/` - User Registration
* `POST /api/auth/token/` - User Login (Get JWT)
* `GET /api/circles/` - List all Circles
* `POST /api/circles/{id}/join/` - Join/Leave a Circle
* `GET /api/feed/global/` - Get the main aggregated feed
* `GET /api/users/{username}/` - Get a user's profile (with visibility logic)
* `POST /api/connections/` - Send a Connection request
* `POST /api/friendships/` - Send a Friend request
* `POST /api/habits/{id}/checkin/` - Check in for a habit to update a streak

---

## Future Roadmap

* **Phase 2:** Implement the full tiling grid widget system and launch the Community Extension Store with a secure OAuth 2.0 provider.
* **Phase 3:** Integrate a Machine Learning layer for advanced content/user recommendations and intelligent feed ranking.
* **Phase 4:** Develop native mobile applications for iOS and Android.
