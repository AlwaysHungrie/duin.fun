import twitterClient from "./twitterClient"

export async function createTaskTweet(task: string, xHandle: string) {
  try {
    const tweet = await twitterClient.v2.tweet(`A task has been added by @${xHandle}: ${task}`)
    return tweet.data.id
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function createEndTaskTweet(reason: string, tweetId: string) {
  try {
    const tweet = await twitterClient.v2.tweet(`Task completed: ${reason}`, {
      reply: {
        in_reply_to_tweet_id: tweetId,
      },
    })
    return tweet.data.id
  } catch (error) {
    console.error(error)
    return null
  }
}
