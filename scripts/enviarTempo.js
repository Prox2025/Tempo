const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // <- solução!
  });

  const page = await browser.newPage();

  try {
    // Acessar a URL com JS injetado
    await page.goto('https://livestream.ct.ws/M/data.php', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000); // esperar carregamento JS

    // Obter hora local de Moçambique
    const mozambiqueTime = new Date().toLocaleString("pt-PT", {
      timeZone: "Africa/Maputo",
      hour12: false
    });

    // Enviar o tempo para o servidor via fetch (usando contexto do navegador)
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
