
const request = require('request-promise');

const instagram = { regex: [/instagr.am\/*/g, /instagram.com\/p*/g], url: 'https://api.instagram.com/oembed/?url=' };
const twitter = { regex: [/twitter\.com\/*/g], url: 'https://publish.twitter.com/oembed?url=' };
const facebook = { regex: [/facebook\.com\/photo*/g, /facebook.com\/permalink*/g, /facebook.com\/.*\/posts*/g], url: 'https://www.facebook.com/plugins/post/oembed.json/?url=' };
const facebookVideo = { regex: [/facebook\.com\/video*/g, /facebook\.com\/.*\/video*/g], url: 'https://www.facebook.com/plugins/video/oembed.json/?url=' };
const youtube = { regex: [/youtube\.com\/watch*/g, /youtu\.be\/*/g], url: 'https://www.youtube.com/oembed?url=' };

const platforms = [instagram, twitter, facebook, facebookVideo, youtube];

const getPlatform = (url) => {
  for (let i = 0, len = platforms.length; i < len; i += 1) {
    const platform = platforms[i];
    for (let i = 0, len = platform.regex.length; i < len; i += 1) {
      const regex = platform.regex[i];
      if (url.match(regex)) {
        return platform;
      }
    }
  }
  return false;
};

const fetch = async (url) => {
  const options = {
    followRedirect: false,
    gzip: true,
    timeout: 5000,
    maxSockets: 10,
    resolveWithFullResponse: true,
    simple: false,
    headers: {
      'User-Agent': 'User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    },
  };

  return request(url, options).then((response) => {
    const data = JSON.parse(response.body);
    return data.html;
  });
};

exports.render = async (req, res, next) => {
  const { url } = req.query;
  if (!url) {
    console.log('Embed: No URL given');
    return res.send('Please provide Social Media Posting as GET parameter, for example: <a href="?url=http://instagram.com/p/V8UMy0LjpX/">?url=http://instagram.com/p/V8UMy0LjpX/</a>');
  }
  const platform = getPlatform(url);
  console.log(`${platform.url}${url}`);
  const response = await fetch(`${platform.url}${url}`);
  res.send(`
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <div class="embed" style=" display: inline-block;">${response}</div>`);

  if (!url) {
    res.send('Please provide Social Media Posting as GET parameter, for example: <a href="?url=http://instagram.com/p/V8UMy0LjpX/">?url=http://instagram.com/p/V8UMy0LjpX/</a>');
  }

  return next();
};
