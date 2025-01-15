document.getElementById('startButton').addEventListener('click', () => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ta-IN';
    recognition.start();

    recognition.onresult = async (event) => {
        const tamilText = event.results[0][0].transcript;
        document.getElementById('outputText').innerText = `Tamil Text: ${tamilText}`;

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t&q=${encodeURIComponent(tamilText)}`);
            const result = await response.json();
            const englishText = result[0][0][0];

            document.getElementById('outputText').innerText = `English Text: ${englishText}`;

            const tts = new SpeechSynthesisUtterance(englishText);
            tts.lang = 'en-US';
            speechSynthesis.speak(tts);

            document.getElementById('downloadPrompt').classList.remove('hidden');

            document.getElementById('yesButton').onclick = () => {
                const blob = new Blob([englishText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'output_english.txt';
                a.click();
                document.getElementById('downloadPrompt').classList.add('hidden');
            };

            document.getElementById('noButton').onclick = () => {
                document.getElementById('downloadPrompt').classList.add('hidden');
            };

        } catch (error) {
            document.getElementById('outputText').innerText = `Error: ${error.message}`;
        }
    };

    recognition.onerror = () => {
        document.getElementById('outputText').innerText = 'Speech recognition failed. Please try again.';
    };
});
