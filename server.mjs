import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { welcome } from './welcome/index.mjs';

var privateKey  = fs.readFileSync('./certs/tls.key');
var certificate = fs.readFileSync('./certs/tls.crt');
var credentials = { key: privateKey, cert: certificate };

const app = express();

app.get('/', (req, res) => res.send(welcome));

var httpsServer = https.createServer(credentials, app)
const port = 5000;

// app.listen(port, () => console.log(`App listening on port ${port}`));
httpsServer.listen(port, () => console.log(`App listening on port ${port}`));
