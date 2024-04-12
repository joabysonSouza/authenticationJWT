import express from "express";
import { Request, Response } from "express";
import { User } from "./Models/User";
import jwt from "jsonwebtoken";
import { limiter } from "./middleware/rateLimiter";
import { checkToken, verifyRefreshToken } from "./middleware/checkToken";
import * as argon2 from "argon2";
import { registerSchema, loginSchema } from "./Schemas/authSchemas";

const app = express();

app.use(express.json());
app.use(limiter);

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({ messagen: "tudo certo" });
});

//rotas
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  //checando se o usuário existe

  const user = await User.findById(id, "-Password");
  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }

  return res.status(200).json({ user });
});

app.post("/register", async (req: Request, res: Response) => {
  const { Name, Email, Password, confirmPassword } = registerSchema.parse(
    req.body
  );

  try {
    //validação de senhas
    if (Password !== confirmPassword) {
      return res.json({ message: "as senhas não são iguais" });
    }

    //validando Emails iguais
    const userExist = await User.findOne({ Email: Email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Por favor utilize outro email!" });
    }

    // criando hash da senha

    const passwordHash = await argon2.hash(Password);

    // criando um novo usuario e salvando no banco
    const Newuser = new User({
      Name,
      Email,
      Password: passwordHash,
    });

    await Newuser.save();
    return res.status(201).json({ message: "Usuario cadastrado com sucesso" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "houve algum error ao validar os campos" });
  }
});

//autenticando usuario

app.post("/login", async (req: Request, res: Response) => {
  const { Email, Password } = loginSchema.parse(req.body);
  const user = await User.findOne({ Email: Email });
  const comaparePassword = await argon2.verify(user!.Password!, Password);

  if (!user || !comaparePassword) {
    return res.status(400).json({ message: "Usuário e/ou senha incorretos!!" });
  }

  try {
    const secret = process.env.SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN;

    const refresToken = jwt.sign({ id: user._id }, refreshSecret!, {
      expiresIn: "1800s",
    });

    const token = jwt.sign({ refresToken }, secret!, { expiresIn: "1800s" });

    res
      .status(200)
      .json({ message: "Autenticado com sucesso!", refresToken, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Houve algum erro no servidor" });
  }
});

// rota para refresh token
app.post("/refresh", verifyRefreshToken, (req: Request, res: Response) => {
  const { refresToken } = req.body;
  const secret = process.env.SECRET;
  const token = jwt.sign({ refresToken }, secret!, {
    expiresIn: "1800s",
  });

  return res.json({ token });
});

export default app;
