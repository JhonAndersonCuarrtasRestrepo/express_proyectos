const express = require("express");

const app = express();
const listEditRouter = require("./list-edit-router.js");
const listViewRouter = require("./list-view-router.js");

app.use(express.json());

let tasks = [];
let taskIdCounter = 1;

app.use("/view", listViewRouter(tasks));
app.use("/edit", listEditRouter(tasks, taskIdCounter));

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
