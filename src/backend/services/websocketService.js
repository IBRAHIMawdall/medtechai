const { Server } = require('socket.io');

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
    this.consultationRooms = new Map(); // consultationId -> Set of socketIds
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log('New WebSocket connection:', socket.id);

      // Handle user authentication
      socket.on('authenticate', (data) => {
        if (data.userId) {
          this.connectedUsers.set(data.userId, socket.id);
          socket.userId = data.userId;
          console.log(`User ${data.userId} connected via socket ${socket.id}`);
        }
      });

      // Handle joining consultation room
      socket.on('join-consultation', (data) => {
        const { consultationId } = data;
        socket.join(`consultation-${consultationId}`);
        
        if (!this.consultationRooms.has(consultationId)) {
          this.consultationRooms.set(consultationId, new Set());
        }
        this.consultationRooms.get(consultationId).add(socket.id);

        socket.to(`consultation-${consultationId}`).emit('user-joined', {
          consultationId,
          userId: socket.userId
        });

        console.log(`Socket ${socket.id} joined consultation ${consultationId}`);
      });

      // Handle leaving consultation room
      socket.on('leave-consultation', (data) => {
        const { consultationId } = data;
        socket.leave(`consultation-${consultationId}`);
        
        if (this.consultationRooms.has(consultationId)) {
          this.consultationRooms.get(consultationId).delete(socket.id);
        }

        console.log(`Socket ${socket.id} left consultation ${consultationId}`);
      });

      // Handle consultation messages
      socket.on('consultation-message', (data) => {
        const { consultationId, message, senderId, senderName } = data;
        
        this.io.to(`consultation-${consultationId}`).emit('new-message', {
          consultationId,
          message,
          senderId,
          senderName,
          timestamp: new Date().toISOString()
        });

        console.log(`Message sent in consultation ${consultationId} from ${senderName}`);
      });

      // Handle pharmacy queue updates
      socket.on('pharmacy-queue', (data) => {
        const { action, patientId, prescriptionId } = data;
        
        // Broadcast to all pharmacy staff
        this.io.emit('queue-update', {
          action, // 'added', 'removed', 'updated'
          patientId,
          prescriptionId,
          timestamp: new Date().toISOString()
        });

        console.log(`Pharmacy queue ${action}: prescription ${prescriptionId}`);
      });

      // Handle inventory alerts
      socket.on('inventory-alert', (data) => {
        const { medicationId, medicationName, alertType } = data;
        
        // Broadcast to all authorized users
        this.io.emit('inventory-notification', {
          medicationId,
          medicationName,
          alertType, // 'low-stock', 'expiring', 'out-of-stock'
          timestamp: new Date().toISOString()
        });

        console.log(`Inventory alert: ${alertType} for ${medicationName}`);
      });

      // Handle prescription status updates
      socket.on('prescription-status', (data) => {
        const { prescriptionId, status, patientId } = data;
        
        // Notify specific patient
        const patientSocketId = this.connectedUsers.get(patientId);
        if (patientSocketId) {
          this.io.to(patientSocketId).emit('prescription-update', {
            prescriptionId,
            status,
            timestamp: new Date().toISOString()
          });
        }

        console.log(`Prescription ${prescriptionId} status updated to ${status}`);
      });

      // Handle typing indicators
      socket.on('typing-start', (data) => {
        const { consultationId, userId } = data;
        socket.to(`consultation-${consultationId}`).emit('user-typing', {
          userId,
          isTyping: true
        });
      });

      socket.on('typing-stop', (data) => {
        const { consultationId, userId } = data;
        socket.to(`consultation-${consultationId}`).emit('user-typing', {
          userId,
          isTyping: false
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          console.log(`User ${socket.userId} disconnected`);
        }
      });

      // Handle connection errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    console.log('WebSocket service initialized');
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get online users
  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // Send notification to specific user
  sendNotificationToUser(userId, notification) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
      return true;
    }
    return false;
  }

  // Broadcast message to all users
  broadcastMessage(message) {
    this.io.emit('broadcast', {
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Send system alert
  sendSystemAlert(alert) {
    this.io.emit('system-alert', {
      ...alert,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new WebSocketService();

