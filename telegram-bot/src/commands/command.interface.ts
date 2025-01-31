import TelegramBot from "node-telegram-bot-api"

export interface Command {
  command: string
  description: string
  handler: (message: TelegramBot.Message) => void
}
