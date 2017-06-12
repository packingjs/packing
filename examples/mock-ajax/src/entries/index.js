import axios from 'axios';

axios.get('/api/getTimestamp').then((res) => {
  const { now } = res.data;
  document.getElementById('now').innerHTML = now;
}, (error) => {
  console.log(error);
});
