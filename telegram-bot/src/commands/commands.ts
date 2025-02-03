import { Command } from './command.interface'
import { startCommand } from './handlers/startCommand'
import { addressCommand } from './handlers/addressCommand'
import { supportedNetworksCommand } from './handlers/supportedNetworksCommand'
import { exampleCommand } from './handlers/exampleCommand'
import { duinCommand, duinPrivateCommand } from './handlers/duinCommand'
import { registerCommand } from './handlers/registerCommand'
import { claimXHandleCommand } from './handlers/claimxhandle'

export const commands: Command[] = [
  startCommand,
  addressCommand,
  supportedNetworksCommand,
  exampleCommand,
  duinCommand,
  duinPrivateCommand,
  registerCommand,
  claimXHandleCommand,
]
