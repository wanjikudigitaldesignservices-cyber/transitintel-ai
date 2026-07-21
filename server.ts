import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { z } from 'zod';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Zod schema for GPS updates — validates data shape before broadcasting
const gpsUpdateSchema = z.object({
  vehicleId: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed: z.number().min(0).max(300).optional(),
  heading: z.number().min(0).max(360).optional(),
  timestamp: z.string().optional(),
});

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    // Only allow connections from same origin in production
    cors: dev
      ? { origin: '*' }
      : {
          origin: process.env.NEXTAUTH_URL || `http://localhost:${port}`,
          credentials: true,
        },
  });

  // Socket.IO authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token && !dev) {
      // In production, require authentication
      return next(new Error('Authentication required'));
    }

    // In development, allow unauthenticated connections for testing.
    // In production, you would verify the JWT here:
    // try {
    //   const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    //   socket.data.user = decoded;
    // } catch (err) {
    //   return next(new Error('Invalid token'));
    // }

    next();
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('gps_update', (data) => {
      // Validate GPS data shape before broadcasting
      const result = gpsUpdateSchema.safeParse(data);
      if (!result.success) {
        socket.emit('error', { message: 'Invalid GPS data format' });
        return;
      }

      // Broadcast validated data only
      socket.broadcast.emit('gps_update', result.data);

      // TODO: Save to database using Prisma in the background
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
