const puppeteer = require('puppeteer');


async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 400,
      height: 400,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  });
  return browser.newPage();
}

exports.screenshot = async (req, res, next) => {
  const { url } = req.query;

  if (!url) {
    console.log('Prembed: No URL given');
    return res.send('Please provide Social Media Posting as GET parameter, for example: <a href="?url=http://instagram.com/p/V8UMy0LjpX/">?url=http://instagram.com/p/V8UMy0LjpX/</a>');
  }

  const page = await getBrowserPage();
  const embedURL = `http://localhost:${req.socket.localPort}/embed?url=${url}`;
  console.log(embedURL);
  await page.goto(embedURL, { waitUntil: 'networkidle2' });
  await page.setViewport({
    width: 400,
    height: 400,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.waitFor(500);
  const element = await page.$('.embed');
  const imageBuffer = await element.screenshot({ omitBackground: true });
  res.set('Content-Type', 'image/png');
  res.send(imageBuffer);
  return next();
};
