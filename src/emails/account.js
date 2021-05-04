const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'p.nymika@gmail.com',
        subject: 'thanks for joining',
        text: `Welcome to the app, ${name}. Let me know how you get along`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'p.nymika@gmail.com',
        subject: 'sorry for disappointing',
        html: `<h2>Hey ${name}, we wish to compensate</h2>`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
// sgMail.send({
//     to: 'p.nymika@gmail.com',
//     from : 'p.nymika@gmail.com',
//     subject: 'My first trial',
//     text: 'hope this one reaches you..'
// })