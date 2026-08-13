const { Client } = require('pg');
const client = new Client('postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require');
client.connect().then(() => client.query('SELECT h.name, k.tier, k.images FROM kit k JOIN holiday h ON k."holidayId" = h.id WHERE h.name IN (\'Eid\', \'Halloween\')')).then(res => console.log(JSON.stringify(res.rows, null, 2))).then(() => client.end());
