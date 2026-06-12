import axios from 'axios';
axios.get('http://localhost:5000/api/v1/appointments?page=1&limit=100').then(res => {
  const appts = res.data.data.appointments || res.data.data;
  appts.slice(0, 3).forEach(a => {
    console.log("ID:", a._id, "Date:", a.appointmentDate, "start:", a.startTime, "end:", a.endTime);
  });
}).catch(e => console.error(e.message));
