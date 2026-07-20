const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

const vehicles = [
  { id: 'v1', plate: 'KBX 234R', lat: -1.2921, lng: 36.8219 },
  { id: 'v2', plate: 'KCA 891J', lat: -1.2800, lng: 36.8100 },
  { id: 'v3', plate: 'KDA 102K', lat: -1.3000, lng: 36.8300 },
];

socket.on('connect', () => {
  console.log('Simulator connected to Socket.io server.');
  
  setInterval(() => {
    vehicles.forEach(v => {
      // Move vehicle slightly
      v.lat += (Math.random() - 0.5) * 0.002;
      v.lng += (Math.random() - 0.5) * 0.002;
      
      console.log(`Sending GPS update for ${v.plate}: ${v.lat.toFixed(5)}, ${v.lng.toFixed(5)}`);
      socket.emit('gps_update', v);
    });
  }, 2000); // update every 2 seconds
});

socket.on('disconnect', () => {
  console.log('Simulator disconnected.');
});
