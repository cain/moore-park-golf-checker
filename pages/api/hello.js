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

    const selectedDate = '2021-10-10';

    const generateLink = (date) => `https://moorepark.miclub.com.au/guests/bookings/ViewPublicCalendar.msp?bookingResourceId=3050007&selectedDate=${date}&weekends=false`
    await page.goto(generateLink(selectedDate));

    result = await page.title();
    console.log('title', result)
    const back8 = await page.$$('[data-feeid="1501386580"]');
    const eighteen = await page.$$('[data-feeid="1501385381"]');
    const front10 = 1501386657;
    const twilight = 1501796650;

    let data = {
      eighteen: [],
      back8: [],
      front10: [],
      twilight: [],
    }

    // Available times if greater than 1
    if(eighteen.length > 1) {
      console.log(eighteen);
      await Promise.all(eighteen.map(async (x, i) => {
        // if(i === 0) return;
        const onclick = await x.getProperty('onclick');
        const date = onclick._remoteObject.description && onclick._remoteObject.description.match(/\d{4}([.\-/ ])\d{2}\1\d{2}/)[0];
        console.log(date);
        if(date) {
          data.eighteen = [...data.eighteen, { date, link: generateLink(selectedDate) }]
        }
      }))
      res.statusCode = 200
      return res.json({ data })    
    }

    // const data = available.map(async (el) => await el.getProperty('data-variationid'))

  } catch (error) {
    console.error(error);
    // return callback(error);
    res.statusCode = 500
    return res.json(error)  
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

}
