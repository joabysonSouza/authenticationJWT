import express from "express";
import { Request, Response } from "express";
import { string, z } from "zod";
import { User } from "./Models/User";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken"
import { limiter } from "./middleware/rateLimiter";
import {checkToken} from './middleware/checkToken'

const app = express();

app.use(express.json());
app.use(limiter);



app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({ messagen: "tudo certo" });
});

//validacões de campos usando zod
const authSchema = z.object({
  Name: z.string().min(4),
  Email: z.string().email(),
  Password: z.string().min(8).max(16),
  confirmPassword: z.string().min(8),
});

const loginSchema = z.object({
  Email: z.string().email(),
  Password: z.string().min(8).max(8),
});

//rotas
app.get("/user/:id" ,checkToken, async(req , res)=>{

  const id = req.params.id

  //checando se o usuário existe 

  const user = await User.findById(id, "-Password")
  if(!user){
    return res.status(400).json({message: "Usuário não encontrado"})
  }

  return res.status(200).json({user})

})

app.post("/auth", async (req: Request, res: Response) => {
  const { Name, Email, Password, confirmPassword } = authSchema.parse(req.body);

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
        .json({ message: "Por favor utilize outro email! " });
    }

    // criando hash da senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(Password, salt);

    // criando um novo usuario e salvando no banco
    const Newuser = new User({
      Name,
      Email,
      Password: passwordHash,
    });

    await Newuser.save();
    return res.status(201).json({ message: "Usuario cadastrado com sucesso" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "houve algum error ao validar os campos" });
  }
});

//autenticando usuario

app.post("/login", async (req: Request, res: Response) => {
  const { Email, Password } = loginSchema.parse(req.body);
  const user = await User.findOne({ Email:Email })
  const comaparePassword = await bcrypt.compare(Password, user!.Password!);

  if (!user || !comaparePassword) {
    return res.status(400).json({ message: "Usuário e/ou senha errados!!"  });
  }

  try{
    const secret = process.env.SECRET 
    const token = jwt.sign({
      id :user._id
    }, secret!)
  res.status(200).json({message: "Autenticado com sucesso!" , token})

  }catch(error){
    console.log(error)
    return res.status(500).json({message: "Houve algum erro no servidor"})
  }


 

 
});

export default app;


