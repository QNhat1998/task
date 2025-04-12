# Task Manager Application

## Setup Development Environment

1. Clone repository:

```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Create environment files:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Start development servers:

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## Production Deployment

1. Install Docker and Docker Compose:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. Create environment files:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. Update environment variables:

- Update `backend/.env` with your database credentials and JWT secret
- Update `frontend/.env` with your API URL

4. Build and run containers:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

5. Check logs:

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

## Project Structure

```
task-manager/
├── backend/           # Backend API
├── frontend/          # Frontend application
├── docker-compose.yml # Development environment
└── docker-compose.prod.yml # Production environment
```
