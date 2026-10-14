require('dotenv').config();
const { app, prisma } = require('./app');
const port = process.env.PORT || 4002;
const server = app.listen(port, () => console.log(`Order service listening on ${port}`));
process.on('SIGINT', async () => { await prisma.$disconnect(); server.close(() => process.exit(0)); });
