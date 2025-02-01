import axios from 'axios'
import * as cheerio from 'cheerio'

const findTweetUrl = (text: string) => {
  let url = text.match(/https?:\/\/x\.com\/\w+\/status\/\d+/)?.[0]
  if (!url) {
    url = text.match(/https?:\/\/twitter\.com\/\w+\/status\/\d+/)?.[0]
  }
  return url
}

const getTweetText = (htmlString: string) => {
  const $ = cheerio.load(htmlString)
  const pContent = $('p').text()
  return pContent
}

export async function getTweet(text: string) {
  try {
    const tweetUrl = findTweetUrl(text)
    if (!tweetUrl) {
      return null
    }
    const response = await axios.get(
      `https://publish.twitter.com/oembed?url=${tweetUrl}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      }
    )
    console.log(response.data)
    const responseJson = response.data
  
    if (!responseJson.html || !responseJson.author_name || !responseJson.author_url) {
      return null
    }

    const tweetText = getTweetText(responseJson.html)
    const author = responseJson.author_url.split('/').at(-1)
    return {
      text: tweetText,
      author,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
