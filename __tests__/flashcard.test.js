const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Deck = require('../src/models/Deck');
const Flashcard = require('../src/models/Flashcard');

let mongoServer;
let authToken;
let userId;
let deckId;

const testUser = {
  name: 'Flashcard Tester',
  email: 'flashcardtester@example.com',
  password: 'password123',
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Deck.deleteMany({});
  await Flashcard.deleteMany({});
  
  const userResponse = await request(app)
    .post('/api/users/register')
    .send(testUser);
  userId = userResponse.body._id;
  
  const loginResponse = await request(app)
    .post('/api/users/login')
    .send({
    email: testUser.email,
    password: testUser.password,
    });
  
  authToken = loginResponse.body.token;
  
  const deckResponse = await request(app)
    .post('/api/decks')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ name: 'Test Deck', description: 'esse é um deck de teste' });

  deckId = deckResponse.body._id;
  });

  describe('Flashcard Tests', () => {
    const cardData = {
      question: 'Qual a capital do Brasil?',
      answer: 'Brasília',
      deck: deckId,
    };

    it('deve criar um novo flashcard em um deck existente', async () => {
      const response = await request(app)
        .post(`/api/decks/${deckId}/cards`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(cardData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.question).toBe(cardData.question);
      expect(response.body.answer).toBe(cardData.answer);
      expect(response.body.deck.toString()).toBe(deckId.toString());
      
      const flashcard = await Flashcard.findById(response.body._id);
      expect(flashcard).not.toBeNull();
    });

    it('não deve criar um flashcard com dados inválidos', async () => {
      const response = await request(app)
        .post(`/api/decks/${deckId}/cards`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          answer: 'Só a resposta',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('deve obter todos os flashcards de um deck', async () => {
      await Flashcard.create({ ...cardData, deck: deckId, owner: userId });
      await Flashcard.create({ question: 'Qual a capital da França?', answer: 'Paris', deck: deckId, owner: userId });

      const response = await request(app)
        .get(`/api/decks/${deckId}/cards`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.length).toBe(2);
      expect(response.body[0].question).toBe(cardData.question);
    });

    it('deve atualizar um flashcard se o usuário for o proprietário', async () => {
      const flashcard = await Flashcard.create({ ...cardData, deck: deckId, owner: userId });

      const updatedData = {
        question: 'Qual é a capital do Brasil?',
        answer: 'Rio de Janeiro',
      };

      const response = await request(app)
        .patch(`/api/decks/${deckId}/cards/${flashcard._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body.question).toBe(updatedData.question);
      expect(response.body.answer).toBe(updatedData.answer);
    });

    it('deve deletar um flashcard se o usuário for o proprietário', async () => {
      const flashcard = await Flashcard.create({ ...cardData, deck: deckId, owner: userId });

      const response = await request(app)
        .delete(`/api/decks/${deckId}/cards/${flashcard._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(204);

      const deletedFlashcard = await Flashcard.findById(flashcard._id);
      expect(deletedFlashcard).toBeNull();
    });
});