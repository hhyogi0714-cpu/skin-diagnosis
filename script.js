document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const resultScreen = document.getElementById('result-screen');

    const userAgeInput = document.getElementById('user-age');
    const startBtn = document.getElementById('start-btn');

    const progressFill = document.getElementById('progress-fill');
    const qCurrent = document.getElementById('q-current');
    const qTotal = document.getElementById('q-total');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');

    const resultAge = document.getElementById('result-age');
    const adviceTitle = document.getElementById('advice-title');
    const adviceMessage = document.getElementById('advice-message');

    const advicePhysical = document.getElementById('advice-physical');
    const adviceSkincare = document.getElementById('advice-skincare');
    const adviceFood = document.getElementById('advice-food');

    const retakeBtn = document.getElementById('retake-btn');
    const radarCanvas = document.getElementById('radarChart');

    // State
    let currentQuestionIndex = 0;
    let totalScore = 0;

    // 5 Axes Scores (initialized to 0)
    let axisScores = {
        firmness: 0,
        brightness: 0,
        moisture: 0,
        glycation: 0,
        lifestyle: 0
    };

    let userAge = 0;

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
        [startScreen, questionScreen, loadingScreen, resultScreen].forEach(s => {
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
        // Reset scores
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

                // Pass axis to handleAnswer
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
            finishDiagnosis();
        }
    }

    function finishDiagnosis() {
        progressFill.style.width = '100%';
        showScreen(loadingScreen);
        setTimeout(() => {
            showResult();
        }, 2000);
    }

    // ------------------------------------------
    // 10 Type Logic & Chart Rendering
    // ------------------------------------------
    function determineDiagnosisType() {
        const s = axisScores;
        // Normalize scores if needed? 
        // Assume axes have roughly equal max scores (approx 9 per axis if 3 questions * 3 pts)
        // Some axes have 3 questions, some 4. Let's normalize to percentage or average.

        // Define max scores based on questions.js distribution:
        // firmness: Q1,2,3 (3 qs -> max 9)
        // moisture: Q4,8,10 (3 qs -> max 9)
        // brightness: Q7,9 (2 qs -> max 6) -> slightly less weight
        // lifestyle: Q6,12,13,14 (4 qs -> max 12) -> heavy weight
        // glycation: Q5,11,15 (3 qs -> max 9)

        // Let's analyze high risk.
        // Threshold for "High Risk" = > 50% of max score? 
        const isHigh = (score, max) => score >= (max * 0.5); // >= half bad

        const highFirmness = isHigh(s.firmness, 9);
        const highMoisture = isHigh(s.moisture, 9);
        const highBrightness = isHigh(s.brightness, 6);
        const highLifestyle = isHigh(s.lifestyle, 12);
        const highGlycation = isHigh(s.glycation, 9);

        const weakCount = [highFirmness, highMoisture, highBrightness, highLifestyle, highGlycation].filter(Boolean).length;

        // 1. Crisis
        if (weakCount >= 4 || totalScore >= 30) return 'crisis';

        // 2. Diamond (Perfect)
        if (totalScore <= 5 && weakCount === 0) return 'diamond';

        // 3. Composite Types (Priority Logic)
        if (highFirmness && highBrightness) return 'sagging_spots';
        if (highFirmness && highGlycation) return 'sagging_glycation';
        if (highBrightness && highGlycation) return 'spots_glycation';

        // 4. Single Risks (Priority Logic: highest ratio)
        // Find simpler max ratio axis
        const ratios = {
            firmness: s.firmness / 9,
            moisture: s.moisture / 9,
            brightness: s.brightness / 6,
            lifestyle: s.lifestyle / 12,
            glycation: s.glycation / 9
        };

        const maxRatio = Math.max(...Object.values(ratios));
        const worstAxis = Object.keys(ratios).find(k => ratios[k] === maxRatio);

        if (maxRatio < 0.3) return 'pre_aging'; // Low risk overall but not perfect

        // Single Types mapping
        if (worstAxis === 'firmness') return 'sagging';
        if (worstAxis === 'brightness') return 'spots';
        if (worstAxis === 'moisture') return 'dryness';
        if (worstAxis === 'glycation') return 'glycation';
        if (worstAxis === 'lifestyle') return 'pre_aging'; // Lifestyle issue but not yet skin issue? Or map to Aging Prev?

        return 'pre_aging'; // Fallback
    }

    function showResult() {
        // Age Calc
        let ageDiff = 0;
        if (totalScore <= 5) ageDiff = -5;
        else if (totalScore <= 15) ageDiff = -2 + ((totalScore - 6) / 9 * 4);
        else ageDiff = 2 + (totalScore - 15) * 0.6;

        let calculatedAge = Math.round(userAge + ageDiff);
        if (calculatedAge < 18) calculatedAge = 18;

        // Determine Type
        const diagnosisType = determineDiagnosisType();
        const advice = advices[diagnosisType];

        // Render Text
        adviceTitle.textContent = advice.title;
        adviceMessage.textContent = advice.message;
        advicePhysical.innerHTML = advice.advice_physical;
        adviceSkincare.innerHTML = advice.advice_skincare;
        adviceFood.innerHTML = advice.advice_food;

        // Render Chart
        drawRadarChart(axisScores);

        showScreen(resultScreen);
        animateValue(resultAge, userAge, calculatedAge, 1500);
    }

    // Chart Drawer
    function drawRadarChart(scores) {
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

        // Draw Background Webs (Pentagon)
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

            // Axis line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Label
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
            const ratio = score / axis.max; // 0 (good) to 1 (bad)
            // But usually radar chart: Center is 0 (Good) or Center is 0 (Bad)?
            // Conventionally: Center is 0, Outer is Max.
            // In our scoring: 0 is Good, Max is Bad.
            // If we want "Higher is Better" visual (usually better looking), we should invert.
            // Let's plot "Health Score": (Max - Score) / Max.
            // So Outer (1.0) = Perfect (Score 0), Center (0.0) = Bad (Score Max).

            const healthRatio = 1 - (ratio > 1 ? 1 : ratio); // Safety cap

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
