import mongoose from "mongoose";


// conectando ao Banco de Dados

const connectDataBase = async () => {
 
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSOWORD}@authtoken.pawamq9.mongodb.net/?retryWrites=true&w=majority&appName=authToken`
    );

    console.log("conexão ao banco bem sucedida");
  } catch (error) {
    console.log("houve algum error ao se conectar!!", error);
  }
};

export default connectDataBase
