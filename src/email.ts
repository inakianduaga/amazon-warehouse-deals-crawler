import nodemailer from 'nodemailer'
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport'
import configType from './config/config'

const send = (
  config: typeof configType.email,
  title: string,
  price: number,
  description: string,
  screenshot: Buffer
): Promise<SentMessageInfo> =>
  nodemailer.createTransport(config.smtpConfig).sendMail({
    from: config.from,
    to: config.to,
    subject: `Warehouse Deal EUR ${price}: ${title.substr(0, 30)}...`,
    html: `<p>${description}</p>`,
    attachments: [
      {
        filename: 'details.png',
        content: screenshot
      }
    ]
  })

export default send
