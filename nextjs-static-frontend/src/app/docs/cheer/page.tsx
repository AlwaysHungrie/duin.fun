import Markdown from '@/components/markdown';

const CHEER = `
# Cheer

> [!WARNING]
> This feature is a work in progress.
> Cheers recieved will not be processed by the bot currently.

Follow [@getduinbot](https://x.com/getduinbot) on X and get notified when someone from the community is publicly adding a task.

If you really want them to complete their task, you can also cheer for them by adding your own commitment to their task which will only be released to them once they've completed their task.

In order to add a cheer: 

1. Create a commitment just like you would normally do for your own task, using your own wallet address.
2. Leave a comment on the @getduinbot's post with the hash of your commitment.
3. The @getduinbot will then release your commitment to the user once the task is completed.

## Example

Following is an example of a successful cheer by a community member.

> Add example here

## Coming Soon

 - Support for non native tokens
 - Reclaim cheer
`

export default function Cheer() {
  return <Markdown content={CHEER} />
}


