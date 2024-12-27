"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => {
    mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/note-app', {})
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log('DB connection error:', err));
};
exports.connectDB = connectDB;
