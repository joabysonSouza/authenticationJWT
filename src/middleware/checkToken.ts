import { NextFunction, Request, Response,  } from "express";
import jwt, { Secret, VerifyErrors } from 'jsonwebtoken';


declare global {
    namespace Express {
        interface Request {
            user?: any; // Ou substitua 'any' pelo tipo apropriado do seu usuário
        }
    }
}


export const checkToken =(req:Request , res:Response ,next:()=> void)=>{
    const authHeader = req.headers['authorization']
    const refresToken = authHeader && authHeader.split(" ")[1]
    if(!refresToken){
        return res.status(401).json({message : "Acesso negado!"})
    }
    try{
        const secret = process.env.SECRET
        jwt.verify(refresToken, secret as Secret)

        next()

    }catch(erro){
        console.log(erro)
        return res.status(400).json({message: "token Invalido!"})

    }

}






 export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const {refresToken} = req.body;

    const refreshSecret = process.env.REFRESH_TOKEN;
    if (refresToken == null) {
        return console.log("error token não definido")
        
     }

    jwt.verify(refresToken,refreshSecret!, (err: any, user: any) => {
        if (err) {
            console.error(err); // Apenas para depuração
            return res.sendStatus(403); // Retorna 403 Forbidden se houver erro na verificação do token
        }
        req.user = user;
        next(); // Chama next() apenas se a verificação do token for bem-sucedida
    });
};






    

