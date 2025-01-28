<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Pixelator</title>
    <style>
        /* Estilos permanecem os mesmos */
    </style>
</head>
<body>
    <div class="container">
        <input type="file" id="fileInput" accept="image/*">
        <div class="upload-area" id="dropZone">
            <p>Upload another one</p>
            <canvas id="previewCanvas" style="display: none; max-width: 100%; border-radius: 10px;"></canvas>
        </div>

        <div class="slider-container">
            <span class="slider-label">How pixelated you want it</span>
            <input type="range" 
                   id="pixelationSlider" 
                   min="0" 
                   max="50" 
                   value="0"
                   step="1">
        </div>

        <button class="button" id="saveButton">Save for myself</button>
    </div>

    <script>
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const previewCanvas = document.getElementById('previewCanvas');
        const slider = document.getElementById('pixelationSlider');
        const saveButton = document.getElementById('saveButton');
        const ctx = previewCanvas.getContext('2d', { willReadFrequently: true });

        let originalImage = null;
        let maxWidth = 800; // Limite máximo de largura para processamento
        let isProcessing = false;
        let requestId = null;
        let fileName = 'imagem'; // Nome padrão para o arquivo

        function resizeImage(image, maxWidth) {
            const ratio = Math.min(1, maxWidth / image.width);
            const width = image.width * ratio;
            const height = image.height * ratio;
            return { width, height };
        }

        function handleFile(file) {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    originalImage = new Image();
                    originalImage.onload = () => {
                        const { width, height } = resizeImage(originalImage, maxWidth);
                        previewCanvas.width = width;
                        previewCanvas.height = height;
                        previewCanvas.style.display = 'block';
                        slider.value = 0;
                        pixelateImage(0);
                    };
                    originalImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
                fileName = file.name.split('.').slice(0, -1).join('.') || 'imagem'; // Define o nome do arquivo
            }
        }

        function pixelateImage(value) {
            if (!originalImage || isProcessing) return;

            isProcessing = true;

            if (requestId) {
                cancelAnimationFrame(requestId);
            }

            requestId = requestAnimationFrame(() => {
                const { width, height } = previewCanvas;

                ctx.clearRect(0, 0, width, height);

                if (value === 0) {
                    ctx.drawImage(originalImage, 0, 0, width, height);
                } else {
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');

                    const pixelSize = Math.max(1, Math.floor(value));

                    tempCanvas.width = width / pixelSize;
                    tempCanvas.height = height / pixelSize;

                    tempCtx.drawImage(originalImage, 0, 0, tempCanvas.width, tempCanvas.height);

                    ctx.imageSmoothingEnabled = false;

                    ctx.drawImage(tempCanvas, 0, 0, width, height);
                }

                isProcessing = false;
            });
        }

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#2196f3';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = '#444';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#444';
            handleFile(e.dataTransfer.files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            handleFile(e.target.files[0]);
        });

        let lastUpdate = 0;
        const updateInterval = 1000 / 60; // 60fps

        slider.addEventListener('input', (e) => {
            const now = Date.now();
            if (now - lastUpdate >= updateInterval) {
                pixelateImage(e.target.value);
                lastUpdate = now;
            }
        });

        saveButton.addEventListener('click', () => {
            if (previewCanvas) {
                const link = document.createElement('a');
                link.download = fileName.length > 3 ? `${fileName}-pixelated.png` : 'imagem.png';
                link.href = previewCanvas.toDataURL('image/png');
                link.click();
            }
        });
    </script>
</body>
</html>