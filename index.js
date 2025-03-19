const express = require('express');
const cors = require('cors');
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON body parsing

// Routes
app.use("/todos", todoRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
