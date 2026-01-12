const express = require('express');
const cors = require('cors');

const { init } = require('./db/database');
const authRoutes = require('./routes/authRoutes');
const roomsRoutes = require('./routes/roomsRoutes');
const employeesRoutes = require('./routes/employeesRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const reservationsRoutes = require('./routes/reservationsRoutes');
const invoicesRoutes = require('./routes/invoicesRoutes');
const statsRoutes = require('./routes/statsRoutes');
const clientsRoutes = require('./routes/clientsRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Gestion Hotel' });
});

app.use('/auth', authRoutes);
app.use('/rooms', roomsRoutes);
app.use('/employees', employeesRoutes);
app.use('/services', servicesRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/invoices', invoicesRoutes);
app.use('/stats', statsRoutes);
app.use('/clients', clientsRoutes);

init()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to init database', error);
  });
