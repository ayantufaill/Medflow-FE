const axios = require('axios');

async function test() {
  try {
    const getRes = await axios.get('http://localhost:5000/api/practice-info/current');
    const id = getRes.data.data.practiceInfo._id;
    console.log('Current practice ID:', id);

    const formData = new FormData();
    formData.append('practiceName', 'Test Practice');
    formData.append('phone', '1234567890');
    formData.append('email', 'test@test.com');
    formData.append('timezone', 'America/New_York');
    formData.append('address', JSON.stringify({
      line1: '999 New Address',
      city: 'Gotham',
      state: 'NJ',
      postalCode: '00000',
      country: 'United States'
    }));

    const updateRes = await axios.put(`http://localhost:5000/api/practice-info/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer 1' }
    });
    console.log('Update response address:', updateRes.data.data.practiceInfo.address);
    console.log('Update response timezone:', updateRes.data.data.practiceInfo.timezone);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
