import { Command } from './command.interface'
import { startCommand } from './handlers/startCommand'
import { addressCommand } from './handlers/addressCommand'
import { supportedNetworksCommand } from './handlers/supportedNetworksCommand'
import { exampleCommand } from './handlers/exampleCommand'
import { duinCommand } from './handlers/duinCommand'
import { registerCommand } from './handlers/registerCommand'

export const commands: Command[] = [
  startCommand,
  addressCommand,
  supportedNetworksCommand,
  exampleCommand,
  duinCommand,
  registerCommand,
]
