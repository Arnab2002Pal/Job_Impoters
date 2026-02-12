## Job_Impoters_Setup

# Architecture Walkthrough
1. A cron job runs inside the server.
2. The server fetches job data from external job feeds.
3. The server transforms and normalizes the raw data.
4. The normalized data is pushed into a Redis queue.
5. Workers pick jobs from the Redis queue.
6. Workers perform database operations (insert/update in MongoDB).
7. Import logs are upserted in MongoDB.

The admin UI displays import history.

Important:
1. Server handles fetching and normalization.
2. Workers only handle database insert/update operations.

Technologies Used
Backend:
Node.js
TypeScript
Express
MongoDB
Redis
BullMQ
Docker

Frontend:
Next.js 14 (App Router)
TypeScript
TailwindCSS

Infrastructure:
Docker
Docker Compose

Data Flow (Simple)

Cron
→ Server fetches jobs
→ Server normalizes data
→ Push to Redis queue
→ Worker picks job
→ Worker writes to MongoDB
→ Import log updated
→ SSE sends update to frontend
→ Admin panel updates

# Setup Instructions
1. Clone the repo
git clone <repo-url>
cd Job_Importers

2. Run client and server in separate terminals
Open two terminals.

3. Start the server first
cd server

4. Create a new .env file
Use .env.example as reference.
Make sure you configure:
Mongo URI
Redis host
Port
JobSource

5. Run Docker
docker compose up --build

This command will:
Build the API container
Start MongoDB
Start Redis
Start the server

Note:
This single command spins up the application and also starts Redis.

Wait until you see the server running on port.

6. Move to client
Open second terminal:
cd client

7. Setup client .env
Follow .env.example

Set:
NEXT_PUBLIC_API_URL=http://localhost:4000/api
(or use your actual server URL)

8. Install and run client
npm install
npm run build
npm start


Open:
http://localhost:3000


# Why This Architecture?
Instead of directly inserting data into MongoDB from the API call, I designed the system as:
Server → Queue → Worker → Database

# Reason:
Large job feeds should not block the main server.
Database operations can be heavy.
Background processing improves scalability.
This design can evolve into microservices later.
Workers can scale horizontally.
Queue allows retry, concurrency control, and failure handling.
This architecture is scalable, modular, and production-ready.

# Implementation:
Integrated multiple job feeds from:
XML response converted to JSON
Cron job runs every 1 hour
Separate MongoDB collection for job

# Queue-Based Background Processing:
Redis used as queue store
BullMQ used for job queue
Worker system with configurable concurrency
Insert/Update logic implemented
Failure logging (DB errors, invalid data)
Import logs updated with failure reasons

# What Is The Queue Doing?
The queue (Redis + BullMQ) acts as a middle layer between the server and the database.
Instead of directly inserting thousands of jobs into MongoDB during API fetch, the server pushes normalized job data into the queue.
The queue is responsible for:
- Holding job payloads temporarily.
- Managing background processing.
- Controlling concurrency (how many jobs run at the same time).
- Preventing server blocking.
- Allowing retries.

# If we directly inserted jobs:
- The API request might take too long.
- The server could become blocked.
- Large feeds would overload the system.
- It would be harder to scale.
- DB operations might get compromised.

# Bonus Features Implemented:
Docker setup
Docker Compose (API + Redis)
Concurrency control in workers
Configurable environment variables
Clean import history UI
Uses MongoDB Atlas URL
Exponential retry backoff