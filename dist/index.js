"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
// Routes
app.use('/api/user', authRoutes_1.default);
app.use('/api/notes', noteRoutes_1.default);
// Error Handling
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Connect to database
(0, db_1.connectDB)();
