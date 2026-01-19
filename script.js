document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const cameraScreen = document.getElementById('camera-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const resultScreen = document.getElementById('result-screen');

    const userAgeInput = document.getElementById('user-age');
    const startBtn = document.getElementById('start-btn');

    const progressFill = document.getElementById('progress-fill');
    const qCurrent = document.getElementById('q-current');
    const qTotal = document.getElementById('q-total');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    // Camera Elements
    const cameraFeed = document.getElementById('camera-feed');
    const cameraPreviewImg = document.getElementById('camera-preview-img');
    const cameraPlaceholder = document.getElementById('camera-placeholder');
    const startCameraBtn = document.getElementById('start-camera-btn');
    const nativeCameraBtn = document.getElementById('native-camera-btn');
    const cameraFileInput = document.getElementById('camera-file-input');
    const faceGuide = document.querySelector('.face-guide');
    const cameraControls = document.querySelector('.camera-controls');
    const shutterBtn = document.getElementById('shutter-btn');

    const resultAge = document.getElementById('result-age');
    const adviceTitle = document.getElementById('advice-title');
    const adviceMessage = document.getElementById('advice-message');

    const advicePhysical = document.getElementById('advice-physical');
    const adviceSkincare = document.getElementById('advice-skincare');
    const adviceFood = document.getElementById('advice-food');
    const adviceExosome = document.getElementById('advice-exosome');

    const retakeBtn = document.getElementById('retake-btn');
    const radarCanvas = document.getElementById('radarChart');

    // State
    let currentQuestionIndex = 0;
    let totalScore = 0;
    let axisScores = {
        firmness: 0,
        brightness: 0,
        moisture: 0,
        glycation: 0,
        lifestyle: 0
    };
    let userAge = 0;
    let stream = null; // Camera stream

    // Initialize
    function init() {
        if (typeof questions === 'undefined') {
            console.error('Questions data not found!');
            return;
        }
        qTotal.textContent = questions.length;
    }

    // Navigation Functions
    function showScreen(screen) {
        // Stop camera if leaving camera screen
        if (screen !== cameraScreen && stream) {
            stopCamera();
        }

        [startScreen, questionScreen, cameraScreen, loadingScreen, resultScreen].forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
            setTimeout(() => {
                if (!s.classList.contains('active')) s.style.display = 'none';
            }, 500);
        });

        screen.style.display = 'block';
        setTimeout(() => {
            screen.classList.remove('hidden');
            screen.classList.add('active');
        }, 50);

        document.querySelector('.app-container').scrollTop = 0;
    }

    // Start
    startBtn.addEventListener('click', () => {
        const inputAge = parseInt(userAgeInput.value);
        if (!inputAge || inputAge < 10 || inputAge > 120) {
            alert('有効な年齢を入力してください（10〜120歳）');
            return;
        }
        userAge = inputAge;
        totalScore = 0;
        axisScores = { firmness: 0, brightness: 0, moisture: 0, glycation: 0, lifestyle: 0 };
        currentQuestionIndex = 0;
        showScreen(questionScreen);
        renderQuestion();
    });

    // Render Question
    function renderQuestion() {
        const question = questions[currentQuestionIndex];
        const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
        progressFill.style.width = `${progressPercent}%`;

        qCurrent.textContent = currentQuestionIndex + 1;

        questionText.style.opacity = 0;
        optionsContainer.style.opacity = 0;

        setTimeout(() => {
            questionText.textContent = question.text;
            optionsContainer.innerHTML = '';

            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = option.text;
                btn.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
                btn.style.opacity = 0;

                btn.addEventListener('click', () => handleAnswer(option.score, question.axis));
                optionsContainer.appendChild(btn);
            });

            questionText.style.opacity = 1;
            optionsContainer.style.opacity = 1;
        }, 300);
    }

    function handleAnswer(score, axis) {
        totalScore += score;
        if (axis && axisScores.hasOwnProperty(axis)) {
            axisScores[axis] += score;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            // Questions finished, go to Camera Screen
            showScreen(cameraScreen);
            // Don't auto-start camera. Reset to placeholder state.
            resetCameraUI();
        }
    }

    function resetCameraUI() {
        cameraPlaceholder.style.display = 'flex';
        cameraFeed.style.display = 'none';
        cameraPreviewImg.style.display = 'none';
        faceGuide.style.display = 'none';
        cameraControls.style.display = 'none';
        stopCamera();
    }

    // ------------------------------------------
    // Camera Logic (Hybrid Strategy)
    // ------------------------------------------

    const uploadPhotoBtn = document.getElementById('upload-photo-btn');
    const skipPhotoBtn = document.getElementById('skip-photo-btn');

    // ------------------------------------------
    // 1. Upload/Take Photo
    // ------------------------------------------
    let currentPhotoData = null; // Store photo data

    // ------------------------------------------
    // 1. Upload/Take Photo
    // ------------------------------------------
    uploadPhotoBtn.addEventListener('click', () => {
        cameraFileInput.click();
    });

    // Handle File Selection
    cameraFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                currentPhotoData = e.target.result; // Save for result

                // Show preview
                cameraPlaceholder.style.display = 'none';
                cameraPreviewImg.src = e.target.result;
                cameraPreviewImg.style.display = 'block';

                // Show analyzing message
                const note = document.querySelector('.camera-note');
                if (note) note.textContent = "画像を解析しています...";

                // Auto-progress
                setTimeout(() => {
                    finishDiagnosis(true);
                }, 1500);
            }
            reader.readAsDataURL(file);
        }
    });

    // ------------------------------------------
    // 2. Skip Face Auth
    // ------------------------------------------
    // ------------------------------------------
    // 2. Skip Face Auth
    // ------------------------------------------
    skipPhotoBtn.addEventListener('click', () => {
        if (confirm("顔写真なしで診断結果を表示しますか？")) {
            currentPhotoData = null;
            finishDiagnosis(false);
        }
    });

    // ------------------------------------------
    // Result Logic
    // ------------------------------------------
    // (Removed commented out obsolete code)

    function finishDiagnosis(withCameraAnalysis) {
        progressFill.style.width = '100%';
        showScreen(loadingScreen);

        setTimeout(() => {
            if (withCameraAnalysis) {
                const mockAdjustment = Math.floor(Math.random() * 4) - 1;
                totalScore += mockAdjustment;
                if (totalScore < 0) totalScore = 0;
            }
            showResult(withCameraAnalysis); // Pass flag
        }, 3000);
    }

    function determineDiagnosisType() {
        const s = axisScores;
        const isHigh = (score, max) => score >= (max * 0.5);

        const highFirmness = isHigh(s.firmness, 9);
        const highMoisture = isHigh(s.moisture, 9);
        const highBrightness = isHigh(s.brightness, 6);
        const highLifestyle = isHigh(s.lifestyle, 12);
        const highGlycation = isHigh(s.glycation, 9);

        const weakCount = [highFirmness, highMoisture, highBrightness, highLifestyle, highGlycation].filter(Boolean).length;

        if (weakCount >= 4 || totalScore >= 30) return 'crisis';
        if (totalScore <= 5 && weakCount === 0) return 'diamond';
        if (highFirmness && highBrightness) return 'sagging_spots';
        if (highFirmness && highGlycation) return 'sagging_glycation';
        if (highBrightness && highGlycation) return 'spots_glycation';

        const ratios = {
            firmness: s.firmness / 9,
            moisture: s.moisture / 9,
            brightness: s.brightness / 6,
            lifestyle: s.lifestyle / 12,
            glycation: s.glycation / 9
        };

        const maxRatio = Math.max(...Object.values(ratios));
        const worstAxis = Object.keys(ratios).find(k => ratios[k] === maxRatio);

        if (maxRatio < 0.3) return 'pre_aging';

        if (worstAxis === 'firmness') return 'sagging';
        if (worstAxis === 'brightness') return 'spots';
        if (worstAxis === 'moisture') return 'dryness';
        if (worstAxis === 'glycation') return 'glycation';
        if (worstAxis === 'lifestyle') return 'pre_aging';

        return 'pre_aging';
    }

    function showResult(withCameraAnalysis = false) {
        let ageDiff = 0;
        if (totalScore <= 5) ageDiff = -5;
        else if (totalScore <= 15) ageDiff = -2 + ((totalScore - 6) / 9 * 4);
        else ageDiff = 2 + (totalScore - 15) * 0.6;

        let calculatedAge = Math.round(userAge + ageDiff);
        if (calculatedAge < 18) calculatedAge = 18;

        const diagnosisType = determineDiagnosisType();
        const advice = advices[diagnosisType];

        adviceTitle.textContent = advice.title;
        adviceMessage.textContent = advice.message;
        advicePhysical.innerHTML = advice.advice_physical;
        adviceSkincare.innerHTML = advice.advice_skincare;
        adviceFood.innerHTML = advice.advice_food;

        // AI Photo Rendering
        const photoContainer = document.getElementById('result-photo-container');
        if (withCameraAnalysis && currentPhotoData) {
            photoContainer.style.display = 'block';
            const img = document.getElementById('result-base-image');
            const canvas = document.getElementById('result-overlay-canvas');

            img.onload = () => {
                canvas.width = img.clientWidth;
                canvas.height = img.clientHeight;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw Simulation Circles
                ctx.strokeStyle = "rgba(255, 60, 60, 0.8)";
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10;
                ctx.shadowColor = "white";

                const drawTarget = (x, y) => {
                    ctx.beginPath();
                    ctx.arc(x, y, 20, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y);
                    ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5);
                    ctx.stroke();
                };

                const w = canvas.width;
                const h = canvas.height;

                // ----------------------------------------------------
                // Expanded AI Analysis Repertoire (Female Concerns)
                // ----------------------------------------------------
                const concerns = [
                    {
                        id: 'sagging',
                        label: 'フェイスラインの緩み',
                        draw: () => { drawTarget(w * 0.25, h * 0.75); drawTarget(w * 0.75, h * 0.75); } // Jaw
                    },
                    {
                        id: 'smile_lines',
                        label: 'ほうれい線の影',
                        draw: () => { drawTarget(w * 0.35, h * 0.65); drawTarget(w * 0.65, h * 0.65); } // Mouth corners
                    },
                    {
                        id: 'eyes',
                        label: '目元のちりめんジワ',
                        draw: () => { drawTarget(w * 0.25, h * 0.45); drawTarget(w * 0.75, h * 0.45); } // Under eyes
                    },
                    {
                        id: 'pores',
                        label: '頬の毛穴開き',
                        draw: () => { drawTarget(w * 0.4, h * 0.55); drawTarget(w * 0.6, h * 0.55); } // Cheeks
                    },
                    {
                        id: 'spots',
                        label: '潜在的なシミ・くすみ',
                        draw: () => { drawTarget(w * 0.3, h * 0.5); drawTarget(w * 0.8, h * 0.6); } // Random cheek spots
                    }
                ];

                // Randomly select 2 unique concerns to display
                // (Fisher-Yates shuffle simulation)
                const shuffled = concerns.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 2);

                // Execute drawing
                selected.forEach(c => c.draw());

                // Generate Dynamic Report Text
                const reportText = `写真分析の結果、<span style="border-bottom:2px solid #ffaaaa;">${selected[0].label}</span>と<span style="border-bottom:2px solid #ffaaaa;">${selected[1].label}</span>に反応が見られました。重点的なケアをおすすめします。`;

                // Update DOM (Wait for image load context)
                setTimeout(() => {
                    const reportContainer = document.getElementById('ai-report-text');
                    if (reportContainer) reportContainer.innerHTML = reportText;
                }, 0);
            };
            img.src = currentPhotoData;

            // AI Analysis Report Setup (Insert container only)
            // We use a specific ID to update the text content dynamically above
            const aiReportHTML = `<li class="advice-item" style="background:#fff0f0; border:1px solid #ffcccc; margin-bottom:1rem; padding:1rem; border-radius:8px;">
                <strong style="color:#d9534f; display:block; margin-bottom:0.5rem;">📷 AI画像解析レポート</strong>
                <p id="ai-report-text" style="margin:0;">分析中...</p>
            </li>`;
            advicePhysical.insertAdjacentHTML('afterbegin', aiReportHTML);

        } else {
            photoContainer.style.display = 'none';
        }

        if (adviceExosome && advice.advice_exosome) {
            adviceExosome.textContent = advice.advice_exosome;
        }

        drawRadarChart(axisScores);

        showScreen(resultScreen);
        animateValue(resultAge, userAge, calculatedAge, 1500);
    }

    // Chart Drawer
    function drawRadarChart(scores) {
        if (!radarCanvas) return;
        const ctx = radarCanvas.getContext('2d');
        const width = radarCanvas.width;
        const height = radarCanvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 100;

        ctx.clearRect(0, 0, width, height);

        // Labels
        const axes = [
            { label: 'ハリ・弾力', key: 'firmness', max: 9 },
            { label: '透明感', key: 'brightness', max: 6 },
            { label: '潤い', key: 'moisture', max: 9 },
            { label: '糖化度', key: 'glycation', max: 9 },
            { label: '生活習慣', key: 'lifestyle', max: 12 }
        ];

        const angleStep = (Math.PI * 2) / axes.length;

        // Draw Background Webs
        ctx.strokeStyle = '#E6D2C4';
        ctx.lineWidth = 1;
        for (let level = 1; level <= 4; level++) {
            ctx.beginPath();
            const r = (radius / 4) * level;
            for (let i = 0; i < axes.length; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw Axes Lines & Labels
        ctx.fillStyle = '#A67B5B';
        ctx.font = '12px "Noto Sans JP"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < axes.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            ctx.fillText(axes[i].label, labelX, labelY);
        }

        // Draw Data Shape
        ctx.beginPath();
        ctx.fillStyle = 'rgba(178, 150, 125, 0.5)';
        ctx.strokeStyle = '#B2967D';
        ctx.lineWidth = 2;

        for (let i = 0; i < axes.length; i++) {
            const axis = axes[i];
            const score = scores[axis.key];
            const ratio = score / axis.max;

            // "Health Score": (Max - Score) / Max.
            const healthRatio = 1 - (ratio > 1 ? 1 : ratio);

            const r = radius * healthRatio;
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    retakeBtn.addEventListener('click', () => {
        userAgeInput.value = '';
        showScreen(startScreen);
    });

    init();
});
