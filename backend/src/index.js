import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import agendaRoutes from "./routes/agendaRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/agendamentos", agendaRoutes);

app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});