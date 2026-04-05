const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 1. Cấu hình CORS (FIX lỗi Network Error)
app.use(cors({
  origin: 'http://localhost:3001', // ✅ frontend React
  credentials: true
}));

// 2. Middlewares (parse dữ liệu)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Test API
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// 4. Routes
app.use('/api/admin', require('./api/admin'));
app.use('/api/customer', require('./api/customer'));

// 5. Handle lỗi 404 (API không tồn tại)
app.use((req, res) => {
  res.status(404).json({ message: 'API not found' });
});

// 6. Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});