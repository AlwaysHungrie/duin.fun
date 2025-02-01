import { TwitterApi } from 'twitter-api-v2'
import config from '../utils/config'

const twitterClient = new TwitterApi({
  appKey: config.TWITTER_CONFIG.API_KEY,
  appSecret: config.TWITTER_CONFIG.API_KEY_SECRET,
  accessToken: config.TWITTER_CONFIG.ACCESS_TOKEN,
  accessSecret: config.TWITTER_CONFIG.ACCESS_TOKEN_SECRET,
})

export default twitterClient
