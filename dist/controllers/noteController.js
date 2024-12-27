"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNotes = exports.getNotes = exports.createNote = void 0;
const noteModel_1 = __importDefault(require("../models/noteModel"));
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const note = new noteModel_1.default({
            title,
            content,
            createdBy: req.user.id,
        });
        yield note.save();
        res.status(201).json({
            message: 'Note created successfully',
            data: note,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error creating note:', error.message);
            res.status(500).json({
                error: 'Error creating note',
                details: error.message,
            });
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});
exports.createNote = createNote;
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield noteModel_1.default.find({ createdBy: req.user.id }).sort({ createdAt: -1 }).limit(3);
        res.status(200).json(notes);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching notes' });
    }
});
exports.getNotes = getNotes;
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield noteModel_1.default.find({ createdBy: req.user.id });
        res.status(200).json(notes);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching all notes' });
    }
});
exports.getAllNotes = getAllNotes;
// // Get a particular note by ID
// export const getNoteDetails = async (req: Request, res: Response): Promise<void> =>  {
//   try {
//     const { id } = req.params;
//     const { createdBy } = req.query;  // Assume createdBy is passed as a query parameter
//     const note = await Note.findOne({ _id: id, createdBy });
//     if (!note) {
//      res.status(404).json({ error: 'Note not found' });
//      return;
//     }
//     res.status(200).json(note);   } catch (error) {
//     console.error('Error fetching note details:', error);
//     res.status(500).json({ error: 'Error fetching note details' });
//   }
// };
