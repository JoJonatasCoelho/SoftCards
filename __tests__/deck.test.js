const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Deck = require('../src/models/Deck');
const User = require('../src/models/User');

let mongoServer;
let authToken;
let userId;

const user = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'password123'
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Deck.deleteMany({});

  const userResponse = await request(app)
    .post('/api/users/register')
    .send({name: user.name, email: user.email, password: user.password});
  userId = userResponse.body._id;

  const loginResponse = await request(app)
    .post('/api/users/login')
    .send({
        email: 'testuser@example.com',
        password: 'password123'
    });

  authToken = loginResponse.body.token.accessToken;
});

describe('Deck Tests', () => {
  it('deve criar um novo deck', async () => {
    const deckData = {
      name: 'Test Deck',
      description: 'esse é um deck de teste'
    };

      const response = await request(app)
        .post('/api/decks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: deckData.name, description: deckData.description });

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe(deckData.name);
      expect(response.body.owner.toString()).toBe(userId.toString());
      expect(response.body).toHaveProperty('_id');

      const dbDeck = await Deck.findById(response.body._id);
      expect(dbDeck).not.toBeNull();
  });

  it('deve falhar ao criar um deck com dados inválidos', async () => {
      const response = await request(app)
        .post('/api/decks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe("Dados inválidos");
  });

  it('deve obter todos os decks do usuário', async () => {
    await Deck.create({ name: 'Deck 1', owner: userId });
    await Deck.create({ name: 'Deck 2', owner: userId });

    const response = await request(app)
      .get('/api/decks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.length).toBe(2);
    expect(response.body[0].owner.toString()).toBe(userId.toString());
  });

  it('deve atualizar um deck se o usuário for o proprietário', async () => {
    const deck = await Deck.create({ name: 'Deck pra atualizar', owner: userId });

    const updatedData = {
      name: 'Nome atualizado',
      description: 'Descrição atualizada'
    };

    const response = await request(app)
      .patch(`/api/decks/${deck._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: updatedData.name, description: updatedData.description });

    console.log("error: " + response.body.error);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.description).toBe(updatedData.description);
  });

  it('deve deletar um deck se o usuário for o proprietário', async () => {
    const deck = await Deck.create({ name: 'Deck para deletar', owner: userId });

    const response = await request(app)
      .delete(`/api/decks/${deck._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(204);

    const deletedDeck = await Deck.findById(deck._id);
    expect(deletedDeck).toBeNull();
  });

});
