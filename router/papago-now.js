module.exports = {
  PapagoNow: () => { return PapagoNow; }
}

const puppeteer = require('puppeteer');
let browser;

const init = async () => {
  browser = await puppeteer.launch({
    headless:true, 
    defaultViewport:null,
    devtools: true,
    args: ['--window-size=1920,1170','--window-position=0,0']
  });
}

const translate = async (payload) => {
  const config = payload;

  const page = await browser.newPage();
  await page.goto(`https://papago.naver.com/?sk=${config.so}&tk=${config.ta}&st=${config.text}`);
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    request.continue();
  })
  return new Promise((resolve, reject) => {
    page.on('response', async (res) => {
      if(res._request._url === 'https://papago.naver.com/apis/n2mt/translate'){
        let response = await res.json();
        console.log("src Language : " + response.srcLangType);
        console.log("target Language : " + response.tarLangType);
        console.log("result : " + response.translatedText);
        resolve(JSON.stringify({ tarLangType : response.translatedText, translatedText : response.translatedText }));
        await page.close();
      }
    })
  })
}

const PapagoNow = {
  init: init,
  translate: translate
}