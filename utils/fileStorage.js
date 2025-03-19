const fs = require("fs");
const filePath = "./todos.json";

// Function to read todos from the JSON file
const loadTodos = () => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        return []; // If file not found, return an empty array
    }
};

// Function to write todos to the JSON file
const saveTodos = (todos) => {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
};

module.exports = { loadTodos, saveTodos };
