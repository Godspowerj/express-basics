import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateTOKEN from "./middleware/auth.js";

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory array to store todos
// let todos = [
//   { id: 1, title: "Learn JavaScript", completed: false },
//   { id: 2, title: "Learn Node.js", completed: false },
//   { id: 3, title: "Build a REST API", completed: false },
// ];

//in memory array to store users
let users = [];
// CRUD operations for todos
// app.get("/todos", (req, res) => {
//   res.json(todos);
// });
// app.post("/todos", (req, res) => {
//   const newTodo = {
//     id: todos.length + 1,
//     title: req.body.title,
//     completed: false,
//   };
//   todos.push(newTodo);
//   res.status(201).json(newTodo);
// });
// app.put("/todos/:id", (req, res) => {
//   const todoID = parseInt(req.params.id);
//   const todoindex = todos.find((todo) => todo.id === todoID);
//   if (!todoindex) {
//     return res.status(404).json({ message: "Todo not found" });
//   }else{
//     todoindex.title = req.body.title;
//     todoindex.completed = req.body.completed;
//     res.json(todoindex);
//   }
// });
// app.delete("/todos/:id", (req, res) => {
//   const todoID = parseInt(req.params.id);
//   const tododelete = todos.find((todo) => todo.id === todoID);
//   if (!tododelete) {
//     return res.status(404).json({ message: "Todo not found" });
//   } else {
//    const todos = todos.filter((todo) => todo.id !== todoID);
//     res.json({ message: "Todo deleted successfully" });
//   }
// });

export const secretkey = "your_secret_key";

// CRUD operations for users
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  users.push({ username, password: hashedPassword });
  console.log(users);

  const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });

  res.status(201).json({ message: "User registered successfully" , token });
});

//login route
app.get('/protected', authenticateTOKEN, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, welcome to the protected route!` });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
