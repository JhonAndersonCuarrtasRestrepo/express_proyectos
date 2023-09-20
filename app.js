const express = require("express");

const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
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
const registeredUsers = [];

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Por favor, proporciona un username y un password." });
  }

  const existingUser = registeredUsers.find(
    (user) => user.username === username
  );

  if (existingUser) {
    return res.status(400).json({
      error: "El username ya está registrado. Por favor, elige otro.",
    });
  }

  const newUser = { username, password };
  registeredUsers.push(newUser);

  res.json({ message: "Usuario registrado exitosamente." });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = registeredUsers.find(
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

