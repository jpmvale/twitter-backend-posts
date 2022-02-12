const app = require('./server');
require("dotenv").config()
const port = process.env.PORT || 3058

app.listen(port, () => console.log("Server is running!"));