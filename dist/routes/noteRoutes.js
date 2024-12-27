"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteController_1 = require("../controllers/noteController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/create', authMiddleware_1.auth, noteController_1.createNote); // Middleware and handler
router.get('/', authMiddleware_1.auth, noteController_1.getNotes);
router.get('/all', authMiddleware_1.auth, noteController_1.getAllNotes);
//router.get('/:id', auth, getNoteDetails );
exports.default = router;
