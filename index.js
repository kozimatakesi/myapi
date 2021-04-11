const express = require('express');
const puppetter = require('puppeteer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'https://reac-test01.herokuapp.com/', //アクセス許可するオリジン
  credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
  optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}))

app.get('/api/v1/list', async (req, res) => {
  console.log(req.query.name);
  const browser = await puppetter.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('https://www.hareruyamtg.com/ja/products/search');
  const datas = await page.evaluate(() => {
    const list = [...document.querySelectorAll('#front_product_search_cardset option')];
    return list.map((data) => ({ name: data.textContent, value: data.value }));
  });
  const nameArray = datas.filter((data) => data.name.match(req.query.name));
  browser.close();
  res.json(nameArray);
});

app.listen(PORT, () => console.log('Listening on port 3001'));