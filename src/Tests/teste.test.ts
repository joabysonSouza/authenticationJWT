import request from 'supertest';
import app from "../../src/app"
import { User } from '../Models/User';
import jwt from 'jsonwebtoken';
import { checkToken } from '../middleware/checkToken';
import { NextFunction, Request, Response } from "express";


jest.mock('./app', () => {
  
  return {
    ...jest.requireActual('../../src/app'),
    checkToken: (req:Request, res:Response, next:NextFunction) => {
      // Simplesmente chama next() para passar para a próxima etapa
      next();
    }
  };
});

describe('GET /user/:id', () => {
  test('Deve retornar status 200 e o usuário se ele existir', async () => {
    // Suponha que você tenha um usuário com ID 123 no seu banco de dados
    const userId = '123';
    
    // Faça a chamada para a rota
    const response = await request(app).get(`/user/${userId}`);

    // Verifique se o status da resposta é 200
    expect(response.status).toBe(200);

    // Verifique se a resposta contém o usuário
    expect(response.body).toHaveProperty('user');
  });
})