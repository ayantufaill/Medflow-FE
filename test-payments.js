const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://localhost:3000/payments/patient/1?limit=100');
    const payments = res.data.data.payments;
    payments.forEach(p => {
      console.log(`PayNum: ${p.receiptNumber}, paidAt: ${p.paidAt}`);
    });
  } catch (e) { console.error(e.message); }
}
test();
