import nodemailer from 'nodemailer'
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport'
import configType from './config/config'

const send = (
  config: typeof configType.email,
  subject: string,
  description: string,
  attachments: Array<{
    content: Buffer
    name: string
  }> = []
): Promise<SentMessageInfo> =>
  nodemailer.createTransport(config.smtpConfig).sendMail({
    from: config.from,
    to: config.to,
    subject,
    html: description,
    attachments: attachments.map(({ name, content }) => ({
      filename: name,
      content
    }))
  })

export default send
