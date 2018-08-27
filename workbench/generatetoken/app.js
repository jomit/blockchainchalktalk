const express = require('express')
const app = express()
var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(port, () => console.log("Server running at http://localhost:%d", port));