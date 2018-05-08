import nodemailer from 'nodemailer'
import configType from './config/config'

const send = (
  config: typeof configType.email,
  title: string,
  price: number,
  description: string,
  screenshot: Buffer
) => {
  const transporter = nodemailer.createTransport({})

  return transporter.sendMail({
    from: config.user,
    to: config.targetEmail,
    subject: `Warehouse Deal EUR ${price}: ${title.substr(0, 30)}...`,
    html: `<p>${description}</p>`,
    attachments: [
      {
        filename: 'details.png',
        content: screenshot
      }
    ]
  })
}

export default send
