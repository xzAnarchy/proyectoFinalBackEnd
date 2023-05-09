import { json } from 'express'

let productosDao
let carritosDao
let usuariosDao
let mensajesDao

switch ('mongodb') {
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js')
        const { default: CarritosDaoArchivo } = await import('./carritos/CarritosDaoArchivo.js')

        productosDao = new ProductosDaoArchivo()
        carritosDao = new CarritosDaoArchivo()
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
        const { default: CarritosDaoFirebase } = await import('./carritos/CarritosDaoFirebase.js')

        productosDao = new ProductosDaoFirebase()
        carritosDao = new CarritosDaoFirebase()
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js')
        const { default: CarritosDaoMongoDb } = await import('./carritos/CarritosDaoMongoDb.js')
        const { default: UsuariosDaoMongoDb } = await import('./usuarios/UsuariosDaoMongoDb.js')
        const { default: MensajesDaoMongoDb } = await import('./mensajes/MensajesDaoMongoDb.js')

        productosDao = new ProductosDaoMongoDb()
        carritosDao = new CarritosDaoMongoDb()
        usuariosDao = new UsuariosDaoMongoDb()
        mensajesDao = new MensajesDaoMongoDb()
        break
    case 'sqlite3':
        const { default: ProductosDaoSQLite3 } = await import('./productos/ProductosDaoSQLite3.js')
        const { default: CarritosDaoSQLite3 } = await import('./carritos/CarritosDaoSQLite3.js')

        productosDao = new ProductosDaoSQLite3()
        carritosDao = new CarritosDaoSQLite3()
        break
}

export { productosDao, carritosDao, usuariosDao, mensajesDao }