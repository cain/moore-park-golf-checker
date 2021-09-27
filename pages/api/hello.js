// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const chromium = require('chrome-aws-lambda');

export default async (req, res) => {

  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto('https://example.com');

    result = await page.title();
    res.statusCode = 200
    return res.json({ result })  
  } catch (error) {
    // return callback(error);
    res.statusCode = 200
    return res.json(error)  
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

}
