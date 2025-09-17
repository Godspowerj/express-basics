import express from "express";

const app = express();
const PORT = 3000;

let todos = [
  { id: 1, title: "Learn JavaScript", completed: false },
  { id: 2, title: "Learn Node.js", completed: false },
  { id: 3, title: "Build a REST API", completed: false },
];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/todos", (req, res) => {
  res.json(todos);
});
app.post("/todos", (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});
app.put("/todos/:id", (req, res) => {
  const todoID = parseInt(req.params.id);
  const todoindex = todos.find((todo) => todo.id === todoID);
  if (!todoindex) {
    return res.status(404).json({ message: "Todo not found" });
  }else{
    todoindex.title = req.body.title;
    todoindex.completed = req.body.completed;
    res.json(todoindex);
  }
});
app.delete("/todos/:id", (req, res) => {
  const todoID = parseInt(req.params.id);
  const tododelete = todos.find((todo) => todo.id === todoID);
  if (!tododelete) {
    return res.status(404).json({ message: "Todo not found" });
  } else {
    todos = todos.filter((todo) => todo.id !== todoID);
    res.json({ message: "Todo deleted successfully" });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
