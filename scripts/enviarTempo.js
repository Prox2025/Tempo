const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Acessar a URL com JavaScript e cookies
    await page.goto('https://livestream.ct.ws/M/data.php', { waitUntil: 'networkidle2' });

    // Esperar 3 segundos manualmente
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Tempo atual de Moçambique (UTC+2)
    const mozambiqueTime = new Date().toLocaleString("pt-PT", {
      timeZone: "Africa/Maputo",
      hour12: false
    });

    // Executar fetch dentro do navegador com tempo
    const resultado = await page.evaluate(async (tempoAtual) => {
      const response = await fetch('https://livestream.ct.ws/M/data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempo: tempoAtual })
      });

      const data = await response.json();
      return data;
    }, mozambiqueTime);

    console.log('✅ Resposta do servidor:', resultado);
  } catch (err) {
    console.error('❌ Erro ao enviar:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
