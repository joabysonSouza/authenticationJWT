import dotEnv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "redis";
import connectBase from "./DataBase/connect";
import app from "./app";

dotEnv.config();
connectBase();

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
