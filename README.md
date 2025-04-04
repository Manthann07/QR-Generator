# QR Code Generator & Scanner

A full-stack application for generating, scanning, and managing QR codes built with the MERN stack.

## Features

- Generate QR codes for URLs or text
- Scan QR codes using device camera
- View history of generated and scanned QR codes
- User authentication (signup/login)
- Download QR codes as images
- Copy QR code URLs to clipboard
- Share QR codes via email
- Filter QR codes by date range
- Paginated QR code history

## Tech Stack

- Frontend: React (Vite) + Material-UI
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT
- QR Code Generation: qrcode
- QR Code Scanning: react-qr-reader
- Email: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd qr-code-generator
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create environment variables:
```bash
# In the server directory, create a .env file based on .env.example
cp .env.example .env
```

4. Update the .env file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-generator
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
SERVER_URL=http://localhost:5000
```

## Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user

### QR Codes
- POST /api/qrcodes - Generate a new QR code
- GET /api/qrcodes - Get all QR codes (with pagination & filters)
- DELETE /api/qrcodes/:id - Delete a specific QR code
- POST /api/qrcodes/share - Share QR code via email

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 