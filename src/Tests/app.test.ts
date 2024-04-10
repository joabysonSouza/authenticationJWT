import request from "supertest";
import app from "../app";
import { User } from "../Models/User";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";

describe("test my app server", () => {
  it("should get main router", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ messagen: "tudo certo" });
  });

  it("deve retorna um erro se as senhas não forem iguais", async () => {
    const userData = {
      Name: "John",
      Email: "john@example.com",
      Password: "password",
      confirmPassword: "passworX", // Senhas diferentes propositalmente
    };

    const response = await request(app).post("/register").send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "as senhas não são iguais" });
  });
});

describe("Validação de email", () => {
  it("Deve retorna usuário uma menssagem de erro se o email já estiver sendo usado", async () => {
    //crinando um usuario
    const user = {
      Email: "usuario@example.com",
      Password: "12345678",
    };

    User.findOne = jest.fn().mockReturnValue(user);

    const response = await request(app)
      .post("/register")
      .send({
        Name: "Usuário",
        Email: "usuario@example.com",
        Password: "12345678",
        confirmPassword: "12345678",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Por favor utilize outro email!",
    });
  });
  it("deve criar um usuário com sucesso se não houver nenhum outro usuário com o mesmo email", async () => {
    // Mock da função User.findOne()
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    // Dados do usuário para o teste
    const registerUser = {
      Name: "Usuário",
      Email: "usuario0@example.com",
      Password: "Password",
      confirmPassword: "Password",
    };

    // Mock da função User.prototype.save()
    jest.spyOn(User.prototype, "save").mockResolvedValue(registerUser);

    // Enviar uma solicitação POST para o endpoint '/register' com dados de usuário
    const response = await request(app).post("/register").send(registerUser);

    // Verificar se a resposta possui a mensagem esperada
    expect(User.prototype.save).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Usuario cadastrado com sucesso",
    });
  });
});

describe("Teste de login", () => {
  it("deve retornar uma mensagem de erro se o usuário ou a senha estiverem incorretos", async () => {
    const req = {
      body: {
        Email: "teste@gmail.com", // usuario errado de propósito
        Password: "Password_incorret", // senha errada de propósito
      },
    };

    // Dados do usuário para o teste
    const mockUser = {
      Email: "usuarioErrado@gmail.com",
      Password: await argon2.hash("Password"),
    };

    // Mock da função User.findOne()
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    // Enviar uma solicitação POST para a rota '/login'
    const response = await request(app).post("/login").send(req.body);

    // Verificar se a resposta possui o status de erro esperado
    expect(response.status).toBe(400);

    // Verificar se a resposta possui a mensagem de erro esperada
    expect(response.body).toEqual({
      message: "Usuário e/ou senha incorretos!!",
    });
  });

  it("Se os dados estiverem corretos deve logar normalmente e retorna o token e eo refresToken", async () => {
    // Dados do usuário para o teste
    const mockUser = {
      Email: "test@example.com",
      Password: await argon2.hash("Password"),
    };

    // Mock da função User.findOne()
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    // Mock da função Jwt.sign()
    jest.spyOn(jwt, "sign").mockReturnValue();

    //Mock para impletação do token de acesso
    jest.spyOn(jwt, "sign").mockImplementation(() => "dummyToken");

    // Enviar uma solicitação POST para a rota '/login'
    const response = await request(app)
      .post("/login")
      .send({ Email: "test@example.com", Password: "Password" });

    // Verificar se possui resposta  a esperada
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Autenticado com sucesso!",
      refresToken: "dummyToken",
      token: "dummyToken",
    });
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refresToken");
  });
  it("deve retorna um status code 500 se houver algum error no servidor", async () => {
    // Mock do User.findOne
    const mockUser = {
      Email: "test@example.com",
      Password: await argon2.hash("password"),
    };
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    // Mock do jwt.sign implementando um erro
    jest.spyOn(jwt, "sign").mockImplementation(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .post("/login")
      .send({ Email: "test@example.com", Password: "password" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Houve algum erro no servidor");
    expect(response.body).not.toHaveProperty("token");
  });
});
