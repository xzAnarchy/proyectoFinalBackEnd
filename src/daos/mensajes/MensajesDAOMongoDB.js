import ContenedorMongoDb from '../../container/ContenedorMongoDb.js';

class MessagesDAOMongoDB extends ContenedorMongoDb {
  constructor() {
    super('mensajes', {
      email: { type: String, required: true },
      messages: { type: Array},
    });
  }
}

export default MessagesDAOMongoDB;
