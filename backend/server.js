// server.js
require('dotenv').config()
const app = require("./src/app");

if (require.main === module) {
    // Si se ejecuta directamente con "node server.js", levanta
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Si se requiere desde otro archivo (ej: electron-main.js), 
// simplemente exporta el app y no hace listen()
module.exports = app;