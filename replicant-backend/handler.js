const { updateAccountKarma } = require('./db')
const { subredditPopulateJob } = require('./jobs/SubredditPopulateJob')
const { fetchTopPostsJob } = require('./jobs/FetchTopPostsJob')
const { scheduleJob } = require('./jobs/ScheduleJob')
const { farmKarmaJob } = require('./jobs/FarmKarmaJob')
const { detectShadowbannedAcc } = require('./jobs/DetectShadowBannedAccountsJob')
const { sanitizeSubreddits } = require('./jobs/SanitizeSubredditsJob')

/**
 *
 * @return {Promise<Message>}
 */
module.exports.accountUpdateHandler = async () => {
  try {
    return await updateAccountKarma()
  } catch (e) {
    console.error(e)
  }
}

/**
 *
 * @return {Promise<boolean>}
 */
module.exports.subredditPopulateHandler = async () => {
  try {
    return await subredditPopulateJob()
  } catch (e) {
    console.error(e)
  }
}

/**
 *
 * @return {Promise<(Model<TModelAttributes, TCreationAttributes>|boolean)[]>}
 */
module.exports.topPostFetchHandler = async () => {
  try {
    return await fetchTopPostsJob('today')
  } catch (e) {
    console.error(e)
  }
}

/**
 *
 * @return {Promise<void>}
 */
module.exports.postScheduleHandler = async () => {
  // TODO : convert to manually updatable control values.
  try {
    await scheduleJob(3, 5)
  } catch (e) {
    console.error(e)
  }
}

/**
 * @return {Promise<Message|boolean>}
 */
module.exports.karmaFarmingHandler = async () => {
  try {
    return await farmKarmaJob()
  } catch (e) {
    console.error(e)
  }
}

module.exports.detectShadowbannedAccHandler = async () => {
  try {
    return await detectShadowbannedAcc()
  } catch (e) {
    console.error(e)
  }
}

module.exports.sanitizeSubredditsHandler = async () => {
  try {
    return await sanitizeSubreddits()
  } catch (e) {
    console.error(e)
  }
}
