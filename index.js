const express = require("express");
const uuid = require("uuid"); // biblioteca para tratar Id

const port = 3000;
const app = express(); // para não precisar ficar chamando a função express()
app.use(express.json()); // serve para informar que toda aplicação usa json

const users = [];

const checkUserId = (req, res, next) => {
  const { id } = req.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "User not found" });
  }

  req.userIndex = index;
  req.userId = id;

  next();
}; // Middleware => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição

app.get("/users", (req, res) => {
  return res.json(users);
}); // visualiza dados do servidor

app.post("/users", (req, res) => {
  const { name, age } = req.body;

  const user = { id: uuid.v4(), name, age };

  users.push(user);

  return res.status(201).json(user);
}); // envia dados ao servidor

app.put("/users/:id", checkUserId, (req, res) => {
  const { name, age } = req.body;
  // const id = req.user.id;
  const index = req.userIndex;

  const updateUser = { id: req.userId, name, age };

  users[index] = updateUser;

  return res.json(updateUser);
}); // atualiza dados do servidor, usando middleware para verificar se o id existe

app.delete("/users/:id", checkUserId, (req, res) => {
  const index = req.userIndex;

  users.splice(index, 1);

  return res.status(204).json();
}); // deleta dados do servidor, usando middleware para verificar se o id existe

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
}); // habilita o servidor na porta port
