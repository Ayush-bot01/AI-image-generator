document.addEventListener("DOMContentLoaded", () => {

    const promptInput = document.getElementById('prompt');
    const styleSelect = document.getElementById('style');
    const resolutionSelect = document.getElementById('resolution');
    const qualitySelect = document.getElementById('quality');
    const countSelect = document.getElementById('count');
    const generateBtn = document.getElementById('generateBtn');
    const resultsDiv = document.getElementById('results');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const btnText = document.querySelector('.btn-text');

    let isGenerating = false;

    generateBtn.addEventListener('click', generateImages);

    function generateImages() {
        const prompt = promptInput.value.trim();
        if (!prompt) return showStatusMessage('error', 'Enter image description');

        if (isGenerating) return;

        isGenerating = true;
        generateBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        btnText.textContent = 'Generating...';

        resultsDiv.innerHTML = '';
        showStatusMessage('info', 'Generating images...');

        setTimeout(() => {
            const count = parseInt(countSelect.value);
            const resolution = resolutionSelect.value;
            const style = styleSelect.value;
            const quality = qualitySelect.value;

            generateImageCards(prompt, count, resolution, style, quality);

            isGenerating = false;
            generateBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            btnText.textContent = 'Generate Images';

            showStatusMessage('success', `Generated ${count} image(s)`);
        }, 500);
    }

    function generateImageCards(prompt, count, resolution, style, quality) {

        const grid = document.createElement('div');
        grid.className = 'image-grid';

        const [w, h] = resolution.split('x');

        for (let i = 0; i < count; i++) {

            const enhancedPrompt = `${prompt}, ${style} style, high quality`;

            // Pollinations URL
            const aiUrl =
                `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${w}&height=${h}&seed=${Math.random()}`;

            // Proxy URL (fixes blocked API)
            const proxyUrl =
                `https://corsproxy.io/?${encodeURIComponent(aiUrl)}`;

            const card = document.createElement('div');
            card.className = 'image-card';

            card.innerHTML = `
                <img src="${proxyUrl}"
                     alt="${prompt}"
                     style="width:100%;height:300px;object-fit:cover"
                     onerror="this.src='https://via.placeholder.com/300x300?text=Image+Failed'">
                <div class="image-info">
                    <div>"${prompt}"</div>
                    <div class="image-details">
                        <span>${resolution}</span>
                        <span>${style}</span>
                        <span>${quality}</span>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        }

        resultsDiv.appendChild(grid);
    }

    function showStatusMessage(type, message) {
        const msg = document.createElement('div');
        msg.className = `status-message status-${type}`;
        msg.textContent = message;
        resultsDiv.prepend(msg);

        setTimeout(() => msg.remove(), 4000);
    }

});


