


import app from "../app"
import { Request, Response } from 'express';
import  request  from "supertest";
import { limiter } from "../middleware/rateLimiter";

describe("RateLimit funcionando", ()=>{

 
 
  it('should return 429 status when limit exceeded', async () => {
    // Fazendo 4 solicitações para exceder o limite de 3
    app.use(limiter)
    for (let i = 0; i < 20; i++) {
      await request(app).get('/').expect(200)
    }
    ; // Primeira solicitação
    const response = await request(app).get('/'); // Quarta solicitação

    // Verificando se a resposta contém status 429
    expect(response.status).toBe(429);
    // Verificando se a mensagem correta é enviada
    expect(response.body).toEqual({ message: 'Muitas solicitações. Tente novamente mais tarde.' });
  });

})

