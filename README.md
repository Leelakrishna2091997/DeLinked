# DeLinked

A decentralized career identity platform that combats professional fraud by anchoring user experiences—such as employment history, certifications, and education records—on the blockchain.

## Overview

DeLinked uses blockchain technology to create verifiable professional credentials. The application uses MetaMask wallet for authentication and distinguishes between two user types: Organizers and Candidates. Each user sees a personalized greeting based on their role.

## Features

- MetaMask wallet integration for secure authentication  
- Two user roles: Organizers and Candidates  
- Blockchain-based verification of professional credentials  
- Profile management for both user types  
- Responsive design with Tailwind CSS  
- Full-stack TypeScript implementation  

## Technology Stack

- **Frontend**: Next.js, TypeScript, Redux Toolkit, TailwindCSS  
- **Backend**: Node.js, Express, TypeScript  
- **Database**: MongoDB  
- **Authentication**: MetaMask (Web3)  
- **Containerization**: Docker  

## Getting Started

### Prerequisites

- Node.js (v14+)  
- npm or yarn  
- MongoDB (local or Atlas)  
- MetaMask browser extension  
- Docker (optional, for containerization)  

### Client Setup

```bash
# Create a new Next.js app
npx create-next-app@latest delinked-client --typescript
cd delinked-client

# Install dependencies
npm install ethers@6.7.1 axios web3modal @reduxjs/toolkit react-redux

# Create project structure
mkdir -p src/components src/hooks src/utils src/services src/interfaces

# Set up Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Update your `next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
}

module.exports = nextConfig
```

### Server Setup

```bash
# Create server directory
mkdir delinked-server
cd delinked-server

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose dotenv cors helmet morgan jsonwebtoken ethers@6.7.1 typescript ts-node @types/express @types/node @types/mongoose @types/cors @types/morgan @types/jsonwebtoken

# Initialize TypeScript configuration
npx tsc --init

# Create project structure
mkdir -p src/controllers src/models src/routes src/middleware src/utils src/config

# Install development dependencies
npm install -g ts-node-dev
```

Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/delinked
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
```

### Running the Application

#### Development Mode

Start the client:
```bash
cd delinked-client
npm run dev
```

Start the server:
```bash
cd delinked-server
npm run dev
```

#### Using Docker

To run the entire application stack using Docker:
```bash
docker-compose up
```
This will start:
- Next.js client on [http://localhost:3000](http://localhost:3000)  
- Node.js server on [http://localhost:5000](http://localhost:5000)  
- MongoDB instance  

### Project Structure

#### Client Structure
```
delinked-client/
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.local
├── public/
├── src/
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   ├── dashboard.tsx
│   │   ├── organizer/
│   │   └── candidate/
│   ├── components/
│   │   ├── Layout/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   └── Profile/
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   └── hooks.ts
│   ├── services/
│   ├── utils/
│   └── styles/
```

#### Server Structure
```
delinked-server/
├── package.json
├── tsconfig.json
├── .env
├── src/
│   ├── index.ts
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
```

## Usage

1. Open the application in your browser at [http://localhost:3000](http://localhost:3000)  
2. Connect your MetaMask wallet  
3. Choose your role (Organizer or Candidate)  
4. Complete your profile  
5. Start using DeLinked for verifiable professional credentials  

## MongoDB Connection

For development, you can use a local MongoDB instance or connect to MongoDB Atlas. Make sure to update the `MONGODB_URI` environment variable accordingly.

## Docker Deployment

The application is containerized for easy deployment. The `docker-compose.yml` file includes configurations for the client, server, and MongoDB services.

## Contributing

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built with ❤️ at MIT Hackathon
