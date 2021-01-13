const express = require('express');
const app = express();
const PORT_NUMBER = 2021;

const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async function translate(){

  const browser = await puppeteer.launch({
    headless:true, 
    defaultViewport:null,
    devtools: true,
    args: ['--window-size=1920,1170','--window-position=0,0']
  });

  app.post('/translate', async (req, session) => {
    const config = JSON.parse(req.body.data);

    const page = await browser.newPage();
    await page.goto(`https://papago.naver.com/?sk=${config.so}&tk=${config.ta}&st=${config.text}`);
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      request.continue();
    })
    page.on('response', async (res) => {
      if(res._request._url === 'https://papago.naver.com/apis/n2mt/translate'){
        let response = await res.json();
        console.log("src Language : " + response.srcLangType);
        console.log("target Language : " + response.tarLangType);
        console.log("result : " + response.translatedText);
        session.send(response.translatedText);
        await page.close();
      }
    })
  })
  app.listen(PORT_NUMBER, () => {
    console.log(`[Papago-now for Express] app started on port ${PORT_NUMBER}`);
  })
})();