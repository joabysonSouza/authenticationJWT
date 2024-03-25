import { Request, Response,  } from "express";
import jwt, { Secret } from 'jsonwebtoken';

export const checkToken =(req:Request , res:Response ,next:()=> void)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(!token){
        return res.status(401).json({message : "Acesso negado!"})
    }
    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret as Secret)

        next()

    }catch(erro){
        console.log(erro)
        return res.status(400).json({message: "token Invalido!"})

    }

}
