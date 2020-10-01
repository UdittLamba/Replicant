const snoowrap = require('snoowrap');
const Account = require('../models/Account');
const Subreddit = require('../models/Subreddit');
const Post = require('../models/Post');

/**
 * fetch and store top posts of approved subs and subscribe to approved subreddits.
 * @param time can be 'today', 'month', 'year' or 'all time'
 */
const fetchTopPostsJob = (time) => {
    Account.findOne().then((account) => {// any reddit account will do.
        const requester = new snoowrap({
            userAgent: account.dataValues.userAgent,
            clientId: account.dataValues.clientId,
            clientSecret: account.dataValues.clientSecret,
            username: account.dataValues.username,
            password: account.dataValues.password
        });
        Subreddit.findAll().then((subs) => {
            for (const subName of subs) {
                if (subName.dataValues.isApproved === true) {
                    requester.getSubreddit(subName.dataValues.name)
                        .subscribe()
                        .getTop(time)
                        .then((posts) => {
                        for (const post of posts) {
                            //Avoid OC content with poster makes a self reference.
                            //Avoid posts with less than 1000 karma.
                            //Avoid reddit hosted video media.
                            if (!post.title.includes('I') && !post.title.includes('My ') && !post.title.includes(' my ')
                                && post.domain !== 'v.redd.it' && post.ups > 1000) {
                                Post.findOrCreate({
                                    where: {name: post.name},
                                    defaults: {
                                        title: post.title,
                                        name: post.name,
                                        upvoteRatio: post.upvote_ratio,
                                        ups: post.ups,
                                        downs: post.downs,
                                        score: post.score,
                                        subreddit: post.subreddit.display_name,
                                        isOriginalContent: post.is_original_content,
                                        isRedditMediaDomain: post.is_reddit_media_domain,
                                        isMeta: post.is_meta,
                                        edited: post.edited,
                                        isSelf: post.is_self,
                                        selfText: post.selftext,
                                        selfTextHtml: post.selftext_html,
                                        created: post.created,
                                        over18: post.over_18,
                                        url: post.url,
                                        domain: post.domain,
                                    }
                                }).catch((err) => console.log(err));
                            }
                        }
                    }).catch((err) => console.log(err));
                }
            }
        }).catch((err) => console.log(err));
    });
};

//fetchTopPostsJob('year');
module.exports = fetchTopPostsJob;