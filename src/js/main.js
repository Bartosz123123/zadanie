const API_KEY = 'WKLEJ_TUTAJ_KLUCZ_API';

document.getElementById('processButton').addEventListener('click', async () => {
	const articleContent = document.getElementById('articleInput').value;
	const outputDiv = document.getElementById('output');

	if (!articleContent) {
		outputDiv.innerHTML = "<p style='color: red;'>Wprowadź treść artykułu!</p>";
		return;
	}

	const prompt = `
		Przetwórz poniższy tekst na format HTML:
		- Użyj odpowiednich tagów HTML do strukturyzacji treści.
		- Dodaj miejsca na grafiki z tagiem <img src="image_placeholder.jpg"> i alt z opisem.
		- Umieść podpisy pod grafikami.
		- Kod powinien zawierać jedynie zawartość między tagami <body> i </body>.

		Tekst:
		${articleContent}
	`;

	try {
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: 'Jesteś asystentem, który konwertuje tekst na HTML.',
					},
					{
						role: 'user',
						content: prompt,
					},
				],
				max_tokens: 2000,
				temperature: 0.7,
			},
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const generatedHTML = response.data.choices[0].message.content;

		outputDiv.innerHTML = `
			<h2>Wygenerowany HTML:</h2>
			<pre>${generatedHTML}</pre>
			<button id="downloadButton">Pobierz jako plik</button>
		`;

		document.getElementById('downloadButton').addEventListener('click', () => {
			const blob = new Blob([generatedHTML], { type: 'text/html' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'artykul.html';
			link.click();
		});
	} catch (error) {
		console.error('Błąd podczas komunikacji z API OpenAI:', error);
		outputDiv.innerHTML =
			"<p style='color: red;'>Błąd podczas przetwarzania artykułu. Sprawdź konsolę.</p>";
	}
});
