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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = (to, subject, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: "alakmishra170101@gmail.com",
                pass: "wpwhpzxkplsgyomm",
            },
        });
        const mailOptions = {
            from: "alakmishra170101@gmail.com",
            to,
            subject,
            html: htmlContent,
        };
        const result = yield transporter.sendMail(mailOptions);
        console.log('Email sent:', result.messageId);
        return result;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
exports.sendMail = sendMail;
