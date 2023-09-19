const express = require("express");

const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const listViewRouter = require("./list-view-router.js");

const listEditRouter = require("./list-edit-router.js");
const users = [
  { username: "Anderson", password: "2698543" },
  { username: "Santiago", password: "3242345" },
  { username: "Mauricio", password: "5467891" }
];

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

app.post("/login", (req, res) => {
  const { username, password } = req.body;


  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET);

  res.json({ token });
});

app.get("/ruta-protegida", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }

    res.json({ message: "Acceso permitido a la ruta protegida" });
  });
});

app.use("/edit", listEditRouter(tasks, taskIdCounter));

app.use("/view", listViewRouter(tasks));

app.get("/tasks", (req, res) => {
  res.json(tasks);
});


app.listen(3000, () => {
  console.log("Servidor en funcionamiento en el puerto 3000.");
});

