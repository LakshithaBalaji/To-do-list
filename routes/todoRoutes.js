const express = require("express");
const router = express.Router();
const { loadTodos, saveTodos } = require("../utils/fileStorage");

// ✅ Create a new todo
router.post("/", (req, res) => {
    const { title, description, priority = "medium", dueDate = null, category = "general" } = req.body;
    const todos = loadTodos();
    const newTodo = {
        id: Date.now(),
        title,
        description,
        completed: false,
        priority,  // New field (low, medium, high)
        dueDate,   // New field (YYYY-MM-DD format)
        category   // New field (work, personal, etc.)
    };
    todos.push(newTodo);
    saveTodos(todos);
    res.status(201).json(newTodo);
});

// ✅ Get all todos with filtering & sorting
router.get("/", (req, res) => {
    let todos = loadTodos();

    // 📌 Filtering
    if (req.query.completed) {
        todos = todos.filter(todo => String(todo.completed) === req.query.completed);
    }
    if (req.query.priority) {
        todos = todos.filter(todo => todo.priority === req.query.priority);
    }
    if (req.query.category) {
        todos = todos.filter(todo => todo.category === req.query.category);
    }

    // 📌 Sorting
    if (req.query.sortBy) {
        const sortBy = req.query.sortBy.toLowerCase();
        todos.sort((a, b) => {
            if (sortBy === "title") return a.title.localeCompare(b.title);
            if (sortBy === "priority") return ["low", "medium", "high"].indexOf(a.priority) - ["low", "medium", "high"].indexOf(b.priority);
            if (sortBy === "duedate") return new Date(a.dueDate) - new Date(b.dueDate);
            return 0;
        });
    }

    res.json(todos);
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

    const { title, description, completed, priority, dueDate, category } = req.body;
    todos[todoIndex] = {
        ...todos[todoIndex],
        title: title ?? todos[todoIndex].title,
        description: description ?? todos[todoIndex].description,
        completed: completed ?? todos[todoIndex].completed,
        priority: priority ?? todos[todoIndex].priority,
        dueDate: dueDate ?? todos[todoIndex].dueDate,
        category: category ?? todos[todoIndex].category
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
