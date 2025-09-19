import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authenticateTOKEN from "./middleware/auth.js";
import startDB from "./config/db.js";
import usersDetails from "./models/user.js";

const app = express();
dotenv.config();
// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory array to store todos
// let todos = [
//   { id: 1, title: "Learn JavaScript", completed: false },
//   { id: 2, title: "Learn Node.js", completed: false },
//   { id: 3, title: "Build a REST API", completed: false },
// ];

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

startDB();


// CRUD operations for users

app.get("/users", async (req, res) => {
  try {
    const users = await usersDetails.find()
   res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/users/roles", async (req, res) => {
  try {
    const users = await usersDetails.find({role: "admin"})
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
})


//signup route
app.post("/signup", async (req, res) =>  {
  const { username, password, role } = req.body;
  const existingUser = await usersDetails.findOne({ username , password });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  
  await usersDetails.create({ username, password: hashedPassword , role});

  const token = jwt.sign({ username }, process.env.JWT_SECRET , { expiresIn: "1h" });

  res.status(201).json({ message: "User registered successfully" , token });
});

//login route
app.get('/protected', authenticateTOKEN, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, welcome to the protected route!` });
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});
