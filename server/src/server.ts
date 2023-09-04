import {connectToDB} from './database';

//* LIBRARIES *//
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import admin from 'firebase-admin'
import WebSocket from 'ws';
import http from 'http';
import cron from 'node-cron';


//* ROUTES *//
import {tasksRouter} from './API/tasks.routes';
import {commentsRouter} from './API/comments.routes';
import {usersRouter} from './API/users.routes';
import {projectsRouter} from './API/projects.routes';
import { departmentsRouter } from './API/departments.routes';
import { positionsRouter } from './API/positions.routes';
import { labelsRouter } from './API/labels.routes';
import {calendarEventsRouter} from './API/calendarEvents.routes'
import { customersRouter } from './API/customers.routes';
import { notificationsRouter } from './API/notifications.routes';

import { IComment } from './types/task';


dotenv.config();

//* FIREBASE *//
const private_key = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');
const serviceAccount: any = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: private_key,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_UR,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
}

admin.initializeApp(({
    credential: admin.credential.cert(serviceAccount)
}))

//* SERVER *//
export const db = connectToDB();
export const app = express();
const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors());


// Web socket
wss.on('connection', (ws) => {
    console.log("New WebSocket connection");

    ws.on('message', (message: any) => {
        console.log(`Received message: ${message}`)
    })

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error: any) => {
        console.error(error)
    })
});

export const broadCastComments = (comment: IComment) => {
    wss.clients?.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(comment));
        }
    })
}

app.use('/', tasksRouter);
app.use('/', commentsRouter);
app.use('/', usersRouter);
app.use('/', projectsRouter);
app.use('/', positionsRouter);
app.use('/', departmentsRouter);
app.use('/', labelsRouter);
app.use('/', calendarEventsRouter);
app.use('/', customersRouter);
app.use('/', notificationsRouter);

// Delete notifications after 30 days
cron.schedule('0 0 * * *', () => {
    db.query('DELETE FROM notifications WHERE notificationExpireDate < NOW()', (err, data) => {
        if (err) {
        console.error('Error deleting expired notifications: ', err);
        } else {
            console.log(`${data}`);
        }
    });
});

server.listen(8081, () => {
    console.log("Server running on port 8081")
})


