

import { rateLimit } from 'express-rate-limit'
import {Request , Response} from "express"

 export const limiter = rateLimit({
	windowMs: 30 * 1000, // 30 segundos
	limit: 3, // Limite de requisicões
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
  message: (req:Request , res:Response)=>{
    res.status(429).json({message:'Muitas solicitações. Tente novamente mais tarde.'})

  }
})

