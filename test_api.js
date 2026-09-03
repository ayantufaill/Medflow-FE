const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5001, // Usually the backend runs on 5001 or 3001, let me check the package.json if it fails. I'll just use curl.
  path: '/admin-finance/invoices?limit=1000&includeItems=true',
  method: 'GET',
  headers: {
    // Need auth headers!
  }
};
