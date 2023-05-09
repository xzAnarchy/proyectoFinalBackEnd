import express from 'express'
import { Server as HttpServer } from 'http'
import session from 'express-session'
import { mongoSession } from './session/mongoSession.js'
import passport from 'passport'
import { port } from './config/config.js'
import { login } from './routes/login.js'
import { register } from './routes/register.js'
import { error } from './routes/error.js'
import { home } from './routes/home.js'
import { cart } from './routes/cart.js'
import { logout } from './routes/logout.js'
import { profile } from './routes/profile.js'
import { chat } from './routes/chat.js'
import {adminWebRouter} from './routes/admin.js'
import { apiProducts } from './api/products.js'
import yargs from 'yargs'
import cluster from 'cluster'
import { cpus } from 'os'
import { logger } from './utils/logger.js'
import chatWs from "./routes/ws/chat.js";
import productsWs from "./routes/ws/home.js";
import cartWs from "./routes/ws/cart.js";
import adminHomeWs from "./routes/ws/admin-home.js";
import adminChatWs from "./routes/ws/admin-chat.js";




const app = express()
const httpServer = new HttpServer(app)

//------------------ Configuracion de Socket.io ------------------//
import { Server as Socket } from 'socket.io'
const io = new Socket(httpServer)

io.on("connection", async (socket) => {
    chatWs(socket);
    productsWs(socket);
    cartWs(socket);
    adminHomeWs(socket);
    adminChatWs(socket);
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


//------------------Configuracion EJS--------------------//
app.set('views', './views')
app.set('view engine', 'ejs')


//-----------------Session-------------------------------//
app.use(session(mongoSession))

//-----------------Passport------------------------------//
app.use(passport.initialize())
app.use(passport.session())

//------------------------------RUTAS---------------------//
app.use('/login', login)
app.use('/logout', logout)
app.use('/register', register)
app.use('/error', error)
app.use('/home', home)
app.use('/cart', cart)
app.use('/profile', profile)
app.use('/chat', chat)
app.use('/api/products', apiProducts)
app.use('/admin', adminWebRouter)

app.get('*', (req, res) => {
    res.redirect('/login')
})

//------------------MINIMIST---------------------------------//

const { mode } = yargs(process.argv.slice(2))
    .alias({
        m: 'mode'
    })
    .default({
        mode: 'fork'
    })
    .argv

//--------------------------Modo CLUSTER------------------------//

const numCPUs = cpus().length;

if (mode === 'cluster') {
    if (cluster.isPrimary) {
        logger.info(`Primary ${process.pid} is running`);

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            logger.info(`worker ${worker.process.pid} died`);
            cluster.fork();
            logger.info(`worker ${worker.process.pid} is running`);
        });

    } else {
        //------------------Configuracion Server---------------------------------//

        const server = httpServer.listen(port, () => {
            logger.info(`Servidor escuchando en el puerto ${server.address().port}`, `numero de cpus ${numCPUs}`)
        })
        server.on(`error`, error => logger.fatal(`Error en servidor: ${error}`))
    }

} else {

    //------------------Configuracion Server---------------------------------//

    const server = httpServer.listen(port, () => {
        try {
            logger.info(`Servidor escuchando en el puerto ${server.address().port}`, `numero de cpus ${numCPUs}`)
        } catch (error) {
            logger.fatal('Error en servidor', error)
        }
    })
    server.on(`error`, error => logger.fatal(`Error en servidor: ${error}`))

}