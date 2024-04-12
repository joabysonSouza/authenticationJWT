import  request  from "supertest";
import app from "../app";
import jwt from 'jsonwebtoken';
import { User } from "../Models/User";
import dotEnv from "dotenv";

dotEnv.config();

describe('Testando rota /user/:id', () => {
  it('Deve retornar status 401 se nenhum token for fornecido', async () => {
    const response = await request(app)
      .get('/user/qualquer-id');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Acesso negado!' });
  });

  it('Deve retornar status 400 se o token fornecido for inválido', async () => {
    // Simula um token inválido
    const token = jwt.sign({ userId: 'qualquer-id' }, 'chave-incorreta');

    const response = await request(app)
      .get('/user/qualquer-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Token inválido!' });
  });

  it('Deve retornar o usuário se o token for válido e o usuário existir', async () => {
    // Simula um usuário existente no banco de dados
    const user = { _id: 'id-existente', name: 'Nome do Usuário', email: 'usuariotestando@example.com' };

    // Simula um token válido
    const token = jwt.sign({ userId: 'id-existente' }, process.env.SECRET!);

    // Substitua esta parte pela lógica real de busca de usuário pelo ID
    jest.spyOn(User, 'findById').mockResolvedValueOnce(user._id);

    const response = await request(app)
      .get('/user/id-existente')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: "id-existente"});
  });
});


