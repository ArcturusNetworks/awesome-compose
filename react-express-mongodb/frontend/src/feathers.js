import io from 'socket.io-client';
import feathers from '@feathersjs/client';

const socket = io();
const client = feathers();

client.configure(feathers.socketio(socket));

export default client;