import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer";
import internal from "stream";



// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to:string | Mail.Address | (string | Mail.Address)[] | undefined,text:string | Buffer | internal.Readable | Mail.AttachmentLike | undefined
) {

    let testAccount = await nodemailer.createTestAccount();
    console.log('testAccount:',testAccount)
        

    const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: testAccount.smtp.port,
    secure: false,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: testAccount.user,
        pass: testAccount.pass,
    },
});

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: to, // list of receivers
        subject: "Change password ", // Subject line
        html:text
    });

    console.log("Message sent: %s", info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}

