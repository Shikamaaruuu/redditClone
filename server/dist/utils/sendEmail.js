"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail(to, text) {
    let testAccount = await nodemailer_1.default.createTestAccount();
    console.log('testAccount:', testAccount);
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: testAccount.smtp.port,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: to,
        subject: "Change password ",
        html: text
    });
    console.log("Message sent: %s", info.messageId);
    console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map