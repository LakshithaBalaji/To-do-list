const express = require("express");
const router = express.Router();
const { loadTodos, saveTodos } = require("../utils/fileStorage");

// ✅ Create a new todo
router.post("/", (req, res) => {
    const { title, description } = req.body;
    const todos = loadTodos();
    const newTodo = { id: Date.now(), title, description, completed: false };
    todos.push(newTodo);
    saveTodos(todos);
    res.status(201).json(newTodo);
});

// ✅ Get all todos
router.get("/", (req, res) => {
    res.json(loadTodos());
});

// ✅ Get a specific todo by ID
router.get("/:id", (req, res) => {
    const todos = loadTodos();
    const todo = todos.find(t => t.id == req.params.id);
    todo ? res.json(todo) : res.status(404).json({ message: "Todo not found" });
});

// ✅ Update a todo by ID
router.put("/:id", (req, res) => {
    const todos = loadTodos();
    const todoIndex = todos.findIndex(t => t.id == req.params.id);

    if (todoIndex === -1) return res.status(404).json({ message: "Todo not found" });

    const { title, description, completed } = req.body;
    todos[todoIndex] = {
        ...todos[todoIndex],
        title: title ?? todos[todoIndex].title,
        description: description ?? todos[todoIndex].description,
        completed: completed ?? todos[todoIndex].completed
    };

    saveTodos(todos);
    res.json(todos[todoIndex]);
});

// ✅ Delete a todo by ID
router.delete("/:id", (req, res) => {
    let todos = loadTodos();
    const newTodos = todos.filter(t => t.id != req.params.id);

    if (todos.length === newTodos.length) return res.status(404).json({ message: "Todo not found" });

    saveTodos(newTodos);
    res.status(204).send();
});

module.exports = router;
