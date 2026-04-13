import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

// --- LISTAR AGENDAMENTOS ---
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

// --- CRIAR AGENDAMENTO ---
router.post("/", async (req, res) => {
  const { agen_data, agen_hora, cliente_nome, funcionario_nome, serv_nome, agen_status, agen_observacoes } = req.body;

  try {
    // 🔎 BUSCAR IDs
    const [cliente] = await pool.query("SELECT c.cli_id FROM cliente c JOIN usuario u ON c.cli_user_id = u.user_id WHERE u.user_nome = ?", [cliente_nome]);
    const [funcionario] = await pool.query("SELECT f.func_id FROM funcionario f JOIN usuario u ON f.func_user_id = u.user_id WHERE u.user_nome = ?", [funcionario_nome]);
    const [servico] = await pool.query("SELECT serv_id FROM servico WHERE serv_nome = ?", [serv_nome]);

    if (!cliente.length || !funcionario.length || !servico.length) {
      return res.status(400).json({ erro: "Cliente, funcionário ou serviço não encontrado." });
    }

    const func_id = funcionario[0].func_id;
    const novaDataHora = `${agen_data} ${agen_hora}`;

    // 🔎 VERIFICAR CONFLITO (Mínimo 45 minutos de diferença)
    const [conflito] = await pool.query(`
      SELECT *, ABS(TIMESTAMPDIFF(MINUTE, TIMESTAMP(CONCAT(agen_data, ' ', agen_hora)), ?)) as diferenca
      FROM agendamento
      WHERE agen_data = ? AND agen_func_id = ?
      HAVING diferenca < 45
    `, [novaDataHora, agen_data, func_id]);

    if (conflito.length > 0) {
      return res.status(400).json({ 
        erro: `Horário ocupado. O funcionário já tem um cliente às ${conflito[0].agen_hora.substring(0,5)}. Escolha um horário com 45min de diferença.` 
      });
    }

    // 💾 INSERT
    await pool.query(`
      INSERT INTO agendamento (agen_data, agen_hora, agen_status, agen_observacoes, agen_cli_id, agen_func_id, agen_serv_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [agen_data, agen_hora, agen_status, agen_observacoes, cliente[0].cli_id, func_id, servico[0].serv_id]);

    res.status(201).json({ mensagem: "Agendamento criado com sucesso ✅" });
  } catch (error) {
    console.error("ERRO NO POST ❌:", error);
    res.status(500).json({ erro: error.message });
  }
});

// --- EDITAR AGENDAMENTO ---
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { agen_data, agen_hora, cliente_nome, funcionario_nome, serv_nome, agen_status, agen_observacoes } = req.body;

  try {
    const [cli] = await pool.query("SELECT c.cli_id FROM cliente c JOIN usuario u ON c.cli_user_id = u.user_id WHERE u.user_nome = ?", [cliente_nome]);
    const [func] = await pool.query("SELECT f.func_id FROM funcionario f JOIN usuario u ON f.func_user_id = u.user_id WHERE u.user_nome = ?", [funcionario_nome]);
    const [serv] = await pool.query("SELECT serv_id FROM servico WHERE serv_nome = ?", [serv_nome]);

    if (!cli.length || !func.length || !serv.length) {
      return res.status(400).json({ erro: "Dados não encontrados para atualização." });
    }

    const func_id = func[0].func_id;
    const novaDataHora = `${agen_data} ${agen_hora}`;

    // 🔎 VERIFICAR CONFLITO (Ignorando o próprio agendamento)
    const [conflito] = await pool.query(`
      SELECT *, ABS(TIMESTAMPDIFF(MINUTE, TIMESTAMP(CONCAT(agen_data, ' ', agen_hora)), ?)) as diferenca
      FROM agendamento
      WHERE agen_data = ? AND agen_func_id = ? AND agen_id <> ?
      HAVING diferenca < 45
    `, [novaDataHora, agen_data, func_id, id]);

    if (conflito.length > 0) {
      return res.status(400).json({ erro: "Este horário conflita com outro agendamento (intervalo de 45min)." });
    }

    // 💾 UPDATE
    await pool.query(`
      UPDATE agendamento 
      SET agen_data=?, agen_hora=?, agen_status=?, agen_observacoes=?, agen_cli_id=?, agen_func_id=?, agen_serv_id=?
      WHERE agen_id = ?
    `, [agen_data, agen_hora, agen_status, agen_observacoes, cli[0].cli_id, func_id, serv[0].serv_id, id]);

    res.json({ mensagem: "Agendamento atualizado! ✅" });
  } catch (error) {
    console.error("ERRO NO PUT ❌:", error);
    res.status(500).json({ erro: error.message });
  }
});

// --- DELETAR AGENDAMENTO ---
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM agendamento WHERE agen_id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Não encontrado" });
    res.json({ mensagem: "Removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
