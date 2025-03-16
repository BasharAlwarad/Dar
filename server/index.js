import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { errorHandler } from './utils/errorHandler.js';
import usersRouter from './routers/userRoutes.js';
import listingsRouter from './routers/listingRoutes.js';

import { PORT, CLIENT_URL } from './config/config.js';

const app = express();

if (!PORT || !CLIENT_URL) {
  console.error(
    '❌ Missing required environment variables: PORT and CLIENT_URL'
  );
  process.exit(1);
}

const jsonOptions = { limit: '50mb' };

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Only 5 login attempts per minute
  message: { message: 'Too many login attempts, try again later.' },
});

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(
  helmet(),
  morgan('combined'),
  json(jsonOptions),
  cors(corsOptions),
  cookieParser(),
  limiter
);

// Limit authentication attempts
// app.use('/api/v1/user/signin', authLimiter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: '✅ Server is running!' });
});

// API routes
app.use(`/api/v1/user`, usersRouter);
app.use(`/api/v1/listing`, listingsRouter);

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({ message: '❌ Page not found!' });
});

// Global error handling
app.use(errorHandler);

// Server startup
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT} ✅`
  );
});

// Graceful shutdown handling
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('🛑 Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection:', reason);
});

// import express, { json } from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import morgan from 'morgan';

// import { errorHandler } from './utils/errorHandler.js';
// import usersRouter from './routers/userRoutes.js';
// import listingsRouter from './routers/listingRoutes.js';

// import { PORT, CLIENT_URL } from './config/config.js';

// const app = express();

// if (!PORT || !CLIENT_URL) {
//   console.error(
//     '❌ Missing required environment variables: PORT and CLIENT_URL'
//   );
//   process.exit(1);
// }

// app.use(morgan('combined'));

// const jsonOptions = { limit: '50mb' };
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { message: 'Too many requests, please try again later.' },
// });
// const corsOptions = {
//   origin: CLIENT_URL,
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// };

// //  Limit sign-in attempts to 5 per minute:
// // const authLimiter = rateLimit({
// //   windowMs: 1 * 60 * 1000, // 1 minute
// //   max: 5, // Only 5 attempts per minute
// //   message: { message: 'Too many login attempts, try again later.' },
// // });

// // app.use('/api/v1/user/signin', authLimiter);
// app.use(limiter);

// app.use(
//   helmet(),
//   morgan('combined'),
//   json(jsonOptions),
//   cors(corsOptions),
//   cookieParser()
// );

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({ message: '✅ Server is running!' });
// });

// // API routes
// app.use(`/api/v1/user`, usersRouter);
// app.use(`/api/v1/listing`, listingsRouter);

// // Handle 404 errors
// app.use('*', (req, res) => {
//   res.status(404).json({ message: '❌ Page not found!' });
// });

// // Global error handling
// app.use(errorHandler);

// // Server startup
// const server = app.listen(PORT, () => {
//   console.log(
//     `Server is running in ${process.env.NODE_ENV} mode on port ${PORT} ✅`
//   );
// });

// // Graceful shutdown handling
// const shutdown = (signal) => {
//   console.log(`\n${signal} received. Shutting down gracefully...`);
//   server.close(() => {
//     console.log('🛑 Server closed.');
//     process.exit(0);
//   });
// };

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);
// process.on('uncaughtException', (err) => {
//   console.error('🔥 Uncaught Exception:', err);
//   process.exit(1);
// });
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('⚠️ Unhandled Promise Rejection:', reason);
// });
