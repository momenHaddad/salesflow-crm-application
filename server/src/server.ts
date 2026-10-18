import 'dotenv/config'
import app from './app.ts';

const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(' PORT must be a valid number.')
}

app.listen(port, () => {
    console.log(`SalesFlow API running at http://localhost:${port}`)
})