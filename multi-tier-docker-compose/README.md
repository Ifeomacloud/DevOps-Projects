## Overview
This project demonstrates a **three-tier application** deployed using **Docker Compose**.  
The stack consists of:

- **Database:** MongoDB
- **Backend API:** Node.js + Express
- **Frontend UI:** React served via Nginx

The application is started using **a single Docker Compose command**, with proper service dependencies, isolated networks, and persistent storage.

---

## Prerequisites

Before running this project, ensure the following are installed:

- **Docker** 
- **Docker Compose** 
- **Git** (to clone the repository)
- **Node.js & npm** (only required if modifying backend or frontend code locally)
- A system with **internet access** to pull Docker images

If running on a remote server or cloud VM (e.g., AWS EC2), ensure required ports are allowed in the firewall/security group. (Ports 22,80 ,3000, 8080)

---

## Architecture

### Services
- **database** – MongoDB container with persistent storage
- **backend** – Node.js/Express API that connects to MongoDB
- **frontend** – React UI served through Nginx that calls the backend API

### Networks
- **backend_net**  
  Used for communication between the database and backend API.
- **frontend_net**  
  Used for communication between the backend API and frontend UI.

The frontend **cannot directly access the database**, improving security and isolation.

### Volume
- **db_data**  
  A named Docker volume used to persist MongoDB data across container restarts.

---

## Project Structure

```bash
multi-tier-app/
├── database/
│ └── (optional init scripts)
├── backend/
│ ├── Dockerfile
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── Dockerfile
│ ├── package.json
│ └── src/
│ ├── index.js
│ └── App.js
└── docker-compose.yml
```


## How to Run the Application

1. **Start the entire stack**
```bash
   docker compose up -d
```


2. **Check container status**
```bash
docker ps
```

All services should be running, and the MongoDB container should show (healthy).

3. **Access the frontend**
 - Local machine:
```bash
   http://localhost:8080
```
   
 - Remote server (example public IP):
 ```bash
    http://<PUBLIC-IP>:8080
 ```

4. **Test the backend API health**
```bash
   docker exec -it ui_frontend curl http://backend:3000/health
```

```bash
   docker logs api_backend
```

**Data Persistence Test**
1. Create data using the API (POST /items).
2. Stop the stack without removing volumes:

```bash
docker compose down
```

3. Start the stack again:

```bash
docker compose up -d
```

4. Previously created data remains available, proving volume persistence.

**Teardown Modes**
```bash
docker compose down
```
Removes containers and networks but keeps the database volume.

```bash
docker compose down -v
```
Removes containers, networks, and volumes.

**Why Docker Compose**
- One command to run multiple dependent services

- Built-in service discovery using DNS

- Easy network isolation

- Persistent volumes for stateful services

- Clear dependency management using depends_on and healthchecks