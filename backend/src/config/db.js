import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "#Jotama21",
  database: "saloon_save",
  port: 3307
});

// teste de conexão
pool.getConnection()
  .then(() => console.log("Conectado ao banco ✅"))
  .catch((err) => console.log("Erro no banco ❌", err));