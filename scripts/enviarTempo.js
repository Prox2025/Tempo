const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://livestream.ct.ws', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(5000);

    const mozambiqueTime = new Date().toLocaleString("pt-PT", {
      timeZone: "Africa/Maputo"
    });

    const cookies = await page.cookies();
    await browser.close();

    const response = await axios.post(
      'https://livestream.ct.ws/Google drive/data.php',
      {
        tempo: mozambiqueTime,
        observacao: process.env.OBSERVACAO || 'Nenhuma observação'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies.map(c => `${c.name}=${c.value}`).join('; ')
        }
      }
    );

    console.log('✅ Tempo enviado:', response.status);
  } catch (error) {
    console.error('❌ Erro ao enviar tempo:', error.message);
    await browser.close();
    process.exit(1);
  }
})();
