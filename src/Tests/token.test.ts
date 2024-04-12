import {  Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { checkToken, verifyRefreshToken } from "../middleware/checkToken";
import  request  from "supertest";
import app from "../app";

// Mock express Request e Response
const reqMock = {} as Request;
const resMock = {} as Response;
reqMock.headers = {};
resMock.status = jest.fn().mockReturnValue(resMock);
resMock.json = jest.fn().mockReturnValue(resMock);

// Mock JWT
jest.mock("jsonwebtoken");

describe("checkToken middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve returna 401 se o token não for fornecido", () => {
    checkToken(reqMock, resMock, () => {});
    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.json).toHaveBeenCalledWith({ message: "Acesso negado!" });
  });

  it("returna 400 se o token for invalido", () => {
    reqMock.headers = { authorization: "Bearer invalidToken" };

    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });

    checkToken(reqMock, resMock, () => {});

    expect(resMock.status).toHaveBeenCalledWith(400);
    expect(resMock.json).toHaveBeenCalledWith({ message: "Token inválido!" });
  });

  it("deve chamar a função next se o token for valido", () => {
    reqMock.headers = { authorization: "Bearer validToken" };

    (jwt.verify as jest.Mock).mockReturnValueOnce(true);

    const nextMock = jest.fn();

    checkToken(reqMock, resMock, nextMock);

    expect(nextMock).toHaveBeenCalled();
  });
});

