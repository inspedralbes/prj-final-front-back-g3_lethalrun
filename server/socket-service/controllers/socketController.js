<<<<<<< HEAD
import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io';

/**
 * Inicializa el servidor de Socket.IO.
 * @param {Object} server - El servidor HTTP o HTTPS al que se debe adjuntar el servidor de WebSocket.
 * @returns {Object} - La instancia del servidor de Socket.IO.
 */
const initializeSocket = (server) => {
    // Configuración de Socket.IO con CORS permitiendo el origen del dominio configurado
    const io = new Server(server, {
        cors: {
            origin: '*', // Permitir cualquier origen si no está configurado
            methods: ['GET', 'POST'] // Métodos HTTP permitidos
        }
    });

    // Manejo de la conexión de un nuevo cliente
    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.id}`); // Imprimir ID del socket de usuario

        // Manejo de un mensaje recibido desde un cliente
        socket.on('message', (data) => {
            console.log(`Mensaje recibido: ${data}`); // Mostrar el mensaje en el servidor
            io.emit('message', data); // Reenviar el mensaje a todos los clientes conectados
        });

        // Manejo de la desconexión de un cliente
        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${socket.id}`); // Imprimir ID del socket cuando se desconecta
        });
    });

    return io; // Retorna la instancia de Socket.IO
};

export default initializeSocket;
=======
  import { Server } from 'socket.io';

  /**
   * Inicializa el servidor de Socket.IO y lo asocia a un servidor HTTP existente.
   *
   * Este controlador configura la instancia de Socket.IO para aceptar conexiones
   * desde cualquier origen (CORS abierto) y habilita los métodos GET y POST.
   * Además, gestiona los eventos de conexión y desconexión de los clientes.
   *
   * @param {import('http').Server} server - Servidor HTTP al que se le adjuntará Socket.IO.
   * @returns {Server} Instancia de Socket.IO lista para usar en otros módulos.
   */
  export const initSocket = (server) => {
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    /**
     * Evento que se dispara cuando un cliente se conecta al servidor de sockets.
     * @event connection
     * @param {import('socket.io').Socket} socket - Instancia del socket conectado.
     */
    io.on('connection', (socket) => {
      // Aquí puedes manejar eventos personalizados, rooms, etc.

      /**
       * Evento que se dispara cuando un cliente se desconecta del servidor de sockets.
       * @event disconnect
       */
      // Puedes agregar lógica de limpieza o notificación aquí si lo necesitas.
    });

    return io;
  };
>>>>>>> origin/dev
