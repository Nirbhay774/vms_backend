# Payout Management Backend

Efficient and robust backend for the Payout Management MVP.

## 🚀 Quick Start (Under 5 Minutes)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a cloud URI)

### 2. Setup
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```
Update the `.env` file with your details:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/payout-management
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

### 4. Seed Data (Optional)
Populate the database with initial data (vendors, admins, etc.):
```bash
npm run seed
```

### 5. Run the Application
#### Development Mode (with hot-reload):
```bash
npm run dev
```
#### Production Mode:
```bash
npm run build
npm start
```

## 🛠 Tech Stack
- **Node.js & Express**: Core framework
- **TypeScript**: Type safety and better DX
- **Mongoose**: MongoDB object modeling
- **JWT**: Secure authentication
- **tsx**: Modern TypeScript execution for development

## 📂 Project Structure
- `src/configs`: Environment and DB configurations
- `src/modules`: Feature-based modular structure
- `src/middlewares`: Global and local middlewares
- `src/utils`: Helper functions and constants

## 📡 API Endpoints
Check `src/routes.ts` (or equivalent) for available endpoints. Common ones include:
- `/api/auth`: Login and Registration
- `/api/payouts`: Payout management
- `/api/vendors`: Vendor data
- `/api/audit`: System audit logs
