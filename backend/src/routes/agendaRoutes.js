import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.*,
        ucli.user_nome AS cliente_nome,
        ufunc.user_nome AS funcionario_nome,
        s.serv_nome
      FROM agendamento a
      LEFT JOIN cliente c ON a.agen_cli_id = c.cli_id
      LEFT JOIN usuario ucli ON c.cli_user_id = ucli.user_id
      LEFT JOIN funcionario f ON a.agen_func_id = f.func_id
      LEFT JOIN usuario ufunc ON f.func_user_id = ufunc.user_id
      LEFT JOIN servico s ON a.agen_serv_id = s.serv_id
    `);

    res.json(rows);

  } catch (error) {
    console.error("ERRO NO GET ❌:", error);
    res.status(500).json({ erro: error.message });
  }
});



router.post("/", async (req, res) => {
  const {
    agen_data,
    agen_hora,
    cliente_nome,
    funcionario_nome,
    serv_nome,
    agen_status,
    agen_observacoes
  } = req.body;

  console.log("DADOS RECEBIDOS:", req.body);

  try {

    // 🔎 BUSCAR CLIENTE
    const [cliente] = await pool.query(`
      SELECT c.cli_id 
      FROM cliente c
      JOIN usuario u ON c.cli_user_id = u.user_id
      WHERE u.user_nome = ?
    `, [cliente_nome]);

    // 🔎 BUSCAR FUNCIONARIO
    const [funcionario] = await pool.query(`
      SELECT f.func_id 
      FROM funcionario f
      JOIN usuario u ON f.func_user_id = u.user_id
      WHERE u.user_nome = ?
    `, [funcionario_nome]);

    // 🔎 BUSCAR SERVICO
    const [servico] = await pool.query(`
      SELECT serv_id 
      FROM servico
      WHERE serv_nome = ?
    `, [serv_nome]);


    // ⚠️ VALIDAÇÃO
    if (!cliente.length || !funcionario.length || !servico.length) {
      return res.status(400).json({
        erro: "Cliente, funcionário ou serviço não encontrado"
      });
    }

    // 💾 INSERT CORRETO
    await pool.query(`
      INSERT INTO agendamento
      (agen_data, agen_hora, agen_status, agen_observacoes, agen_cli_id, agen_func_id, agen_serv_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      agen_data,
      agen_hora,
      agen_status,
      agen_observacoes,
      cliente[0].cli_id,
      funcionario[0].func_id,
      servico[0].serv_id
    ]);

    console.log("SALVOU NO BANCO ✅");

    res.status(201).json({ mensagem: "Agendamento criado com sucesso" });

  } catch (error) {
    console.error("ERRO REAL ❌:", error);
    res.status(500).json({ erro: error.message });
  }
});


router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try{ 
        const [result] = await pool.query("DELETE FROM agendamento WHERE agen_id = ?", [id]);


        if(result.affectedRows === 0) {
            return res.status(404).json({erro: "Agendamento não encontrado!"});
        }

        console.log(`Agendamento ${id} Deletado!`);
        res.json({mensagem: "Agendamento removido com sucesso"});
    } catch (error) {
        console.error("Erro no DELETE: ", error);
        res.status(500).json({erro: error.message});
    }
});

export default router;