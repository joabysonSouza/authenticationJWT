import request from 'supertest';
import app from '../app';
import { User } from '../Models/User';
import jwt from 'jsonwebtoken';

describe.only('GET /user/:id', () => {
    it('should return status 200 and user data if user is found', async () => {
        // Supondo que você tenha uma função `User.findById` mockada para retornar um usuário válido
        const user = { _id: '123', name: 'John Doe', email: 'john@example.com' };
        jest.spyOn(User, 'findById').mockResolvedValueOnce(null);

    
        const response = await request(app).get('/user/123');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ user });
      });
})
