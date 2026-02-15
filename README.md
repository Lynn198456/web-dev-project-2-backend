# Web Dev Project 2 Backend (Express + MongoDB)

## Setup

```bash
npm install
cp .env.example .env
```

Set `MONGODB_URI` in `.env`.
For appointment/auth database, set:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/AppointmentData?appName=Cluster0
```

For pet database (`pet_data`), set:

```env
PETS_MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/pet_data?appName=Cluster0
```

## Run

```bash
npm run dev
```

Base URL: `http://localhost:5001`

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:appointmentId`
- `GET /api/pets`
- `POST /api/pets`
- `DELETE /api/pets/:petId`
- `GET /api/users/:userId/profile`
- `PUT /api/users/:userId/profile`
- `POST /api/consultations`
