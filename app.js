const express = require("express");

const app = express();

const listViewRouter = require("./list-view-router.js");

const listEditRouter = require("./list-edit-router.js");

app.use(express.json());


const validateMethodMiddleware = (req, res, next) => {
  const validMethods = ["GET", "POST", "PUT", "DELETE"];

  if (!validMethods.includes(req.method)) {
    return res.status(405).json({ error: "Método HTTP no permitido." });
  }

  next();
};

app.use(validateMethodMiddleware);

let tasks = [];
let taskIdCounter = 1;


app.use("/edit", listEditRouter(tasks, taskIdCounter));

app.use("/view", listViewRouter(tasks));

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.listen(3006, () => {
  console.log("Servidor en funcionamiento en el puerto 3002.");
});

