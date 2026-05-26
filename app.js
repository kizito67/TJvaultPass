const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const app = express();

const connectDb = require('./src/config/db');
const userRoutes = require('./src/routes/user.routes');


app.use(morgan('dev'));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Welcome to VaultPass');
});

app.use('/api/users', userRoutes);
app.use('/api/moderator', require('./src/routes/moderator.routes'));
app.use('/api/public', require('./src/routes/public.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));



app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on port ${PORT}`);
});

