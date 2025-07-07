const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Acede ao servidor onde o JS e os cookies são carregados
    await page.goto('https://livestream.ct.ws/M/data.php', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000); // espera 3 segundos para scripts JS carregarem

    // 2. Tempo atual de Moçambique
    const mozambiqueTime = new Date().toLocaleString("pt-PT", {
      timeZone: "Africa/Maputo",
      hour12: false
    });

    // 3. Enviar via POST diretamente do navegador (com cookies válidos)
    const resultado = await page.evaluate(async (tempoAtual) => {
      const response = await fetch('https://livestream.ct.ws/M/data.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tempo: tempoAtual
        })
      });

      const data = await response.json();
      return data;
    }, mozambiqueTime);

    // 4. Exibe o resultado no terminal
    console.log('✅ Resposta do servidor:', resultado);
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await browser.close();
  }
})();
