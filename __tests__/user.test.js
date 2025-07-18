const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Authentication Tests', () => {
  const userData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123'
  };

  it('deve criar um novo usuário', async () => { 
    const response = await request(app)
      .post('/api/users/register')
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).toHaveProperty('_id');

    const dbUser = await User.findOne({ email: userData.email });
    expect(dbUser).not.toBeNull();
    expect(dbUser.name).toBe(userData.name);
  });

  it('deve falhar ao registrar usuário com email já existente', async () => {
    await User.create(userData);

    const response = await request(app)
      .post('/api/users/register')
      .send(userData);

    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toBe("Usuário já existe");
  });

  it('deve fazer login com credenciais válidas', async () => {
    await registerUserInDb(userData);

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: userData.email, password: userData.password });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('deve falhar ao fazer login com email inválido', async () => {
    await registerUserInDb(userData);

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: userData.email, password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.error.message).toBe("Credenciais inválidas");
  });

  it('deve falhar ao fazer login com email não registrado', async () => {
    await registerUserInDb(userData);

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'unknown@example.com', password: 'password123' });

    expect(response.statusCode).toBe(401);
    expect(response.body.error.message).toBe("Credenciais inválidas");
  });
});

const registerUserInDb = async (userData) => {
    const hashedPassword = await require('bcryptjs').hash(userData.password, 10);
    await User.create({ ...userData, password: hashedPassword });
};