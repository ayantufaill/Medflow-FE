import axios from 'axios';
axios.get('http://localhost:5000/api/v1/rooms?page=1&limit=100').then(res => {
  console.log(res.data.data.rooms);
}).catch(e => console.error(e.message));
