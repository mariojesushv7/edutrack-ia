const app = require('./src/app');
const dotenv = require('dotenv');
require('./src/config/database');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});