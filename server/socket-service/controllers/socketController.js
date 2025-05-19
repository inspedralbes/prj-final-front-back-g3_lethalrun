
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

