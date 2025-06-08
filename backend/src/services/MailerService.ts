import nodemailer from 'nodemailer';

class MailerService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "gonzaloalexramos@gmail.com", // TODO: send it to .env
                pass: "lzur yusi atsp mkdx", // TODO: send it to .env
            }
        });
    }

    async enviarCorreo(to: string, subject: string, html: string) {
        const info = await this.transporter.sendMail({
            from: '"Mi App" <no-reply@miapp.com>',
            to,
            subject,
            html,
        });
        return info;
    }
}

export default MailerService;