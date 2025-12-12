document.addEventListener('DOMContentLoaded', () => {
    let learnedCards = JSON.parse(localStorage.getItem('learnedCards')) || [];

    const softwareData = [
        { name: 'Windows 11', type: 'System Software' },
        { name: 'Microsoft word', type: 'Application Software'},
        { name: 'Linux', type: 'System Software' },
        { name: 'Photoshop', type: 'Application Software' },
        { name: 'BIOS', type: 'System Software' },
        { name: 'Visual Studio Code', type: 'Application Software' },
        { name: 'macOS', type: 'System Software' },
        { name: 'Slack', type: 'Application Software' },
        { name: 'Android', type: 'System Software' },
        { name: 'Google Chrome', type: 'Application Software' },
        { name: 'Unix', type: 'System Software' },
        { name: 'Zoom', type: 'Application Software' },
        { name: 'iOS', type: 'System Software' },
        { name: 'Spotify', type: 'Application Software' },
        { name: 'Excel', type: 'Application Software' },
        { name: 'Ubuntu', type: 'System Software' },
        { name: 'Final Cut Pro', type: 'Application Software' },
        { name: 'Fedora', type: 'System Software' },
        { name: 'AutoCAD', type: 'Application Software' },
        { name: 'Debian', type: 'System Software' },
        { name: 'Skype', type: 'Application Software' },
        { name: 'Red Hat Enterprise Linux', type: 'System Software' },
        { name: 'Trello', type: 'Application Software' },
        { name: 'Chrome OS', type: 'System Software' },
        { name: 'Dropbox', type: 'Application Software' },
        { name: 'Solaris', type: 'System Software' },
        { name: 'Notion', type: 'Application Software' },
        { name: 'FreeBSD', type: 'System Software' },
        { name: 'Adobe Illustrator', type: 'Application Software' },
        { name: 'CentOS', type: 'System Software' },
        { name: 'Microsoft Teams', type: 'Application Software' },
        { name: 'Arch Linux', type: 'System Software' },
        { name: 'Evernote', type: 'Application Software' },
        { name: 'Manjaro', type: 'System Software' },
        { name: 'Asana', type: 'Application Software' },
        { name: 'openSUSE', type: 'System Software' },
        { name: 'GitHub Desktop', type: 'Application Software' },
        { name: 'Kali Linux', type: 'System Software' },
        { name: 'PowerPoint', type: 'Application Software' },
        { name: 'Mageia', type: 'System Software' },
        { name: 'OneNote', type: 'Application Software' },
        { name: 'Zorin OS', type: 'System Software' },
        { name: 'Slack', type: 'Application Software' },
        { name: 'Pop!_OS', type: 'System Software' },
        { name: 'Adobe Premiere Pro', type: 'Application Software' },
        { name: 'Gentoo', type: 'System Software' },
        { name: 'Abode Acrobat Reader', type: 'Application Software' },
        { name: 'Deepin', type: 'System Software' },
        { name: 'WPS Office', type: 'Application Software' },
        { name: 'Abobe Photoshop', type: 'Application Software' },
        { name: 'VLC Media Player', type: 'Application Software' }
    ];

    // ---- ЭЛЕМЕНТЫ DOM ----
    const learnContainer = document.getElementById('card-container');
    const startTestBtn = document.getElementById('start-test-btn');
    const testArea = document.getElementById('test-area');
    const sourceCardsContainer = document.getElementById('source-cards');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkBtn = document.getElementById('check-btn');
    const resultsContainer = document.getElementById('results');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const resetLearnedBtn = document.getElementById('reset-btn');
    const backBtn = document.getElementById('back-btn');

    /**
     *  Создает начальный набор переворачиваемых карточек для обучения.
     */
    function createLearningCards() {
        // Показываем только не изученные карточки
        const shuffledData = softwareData.filter(item => !learnedCards.includes(item.name)).sort(() => Math.random() - 0.5); // Убрать изученные

        shuffledData.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-face card-front">
                    ${item.name}
                    <button class="markBtn">Изучено</button>
                </div>
                <div class="card-face card-back"><h3>${item.type}</h3></div>
            `;

            // Пометить изученой
            card.querySelector('.markBtn').addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвратить переворот карточки
                markCardAsLearned(item.name);
                card.remove();
            })

            card.addEventListener('click', () => card.classList.toggle('is-flipped'));
            learnContainer.appendChild(card);
        });
    }

    function initializeTest() {
        // Скрыть область обучения и показать область теста
        learnContainer.classList.add('hidden');
        startTestBtn.classList.add('hidden');
        testArea.classList.remove('hidden');
        resetLearnedBtn.classList.add('hidden');

        // Сбросить предыдущее состояние теста
        sourceCardsContainer.innerHTML = '';
        resultsContainer.innerHTML = '';
        checkBtn.classList.add('hidden');
        dropZones.forEach(zone => {
            zone.innerHTML = `<h3>${zone.dataset.type}</h3>`; // Сбросить содержимое, но сохранить заголовок
        });

        // Создать перетаскивание карточки
        const shuffledData = [...softwareData].sort(() => Math.random() - 0.5).slice(0, 20);
        shuffledData.forEach((item, index) => {
            const card = document.createElement('div');
            card.id = `card-${index}`;
            card.classList.add('card'); // Повторное использование стиля .card, но он будет вести себя по-другому
            card.draggable = true;
            card.textContent = item.name;
            card.dataset.type = item.type;
            sourceCardsContainer.appendChild(card);
        });

        addDragAndDropListeners();
    }

    /**
     * Сброс изученных карточек
     */
    function resetLearnedCards() {
        learnedCards = [];
        localStorage.removeItem('learnedCards');

        // Очистить контейнер обучения
        learnContainer.innerHTML = '';

        // Пересоздать карточки с нуля
        createLearningCards();
    }

    /**
     * Преремешивание карточек
     */
    function shuffleCards() {
        const cards = Array.from(sourceCardsContainer.children);

        // Алгоритм перемешивания
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            // Меняем карточки местами в контейнере
            sourceCardsContainer.insertBefore(cards[j], cards[i]);

            // Меняем их позиции в массиве
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    /**
     *  Добавляет все необходимые слушатели событий для функциональности перетаскивания.
     */
    function addDragAndDropListeners() {
        const draggableCards = document.querySelectorAll('#source-cards .card');

        draggableCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.id);
                setTimeout(() => card.classList.add('hidden'), 0); // Скрыть во время перетаскивания
            });
            card.addEventListener('dragend', () => {
                // Это событие не является строго необходимым здесь, но хорошо для очистки
                card.classList.remove('hidden');
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', e => {
                e.preventDefault(); // Разрешить сброс
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const id = e.dataTransfer.getData('text/plain');
                const draggable = document.getElementById(id);
                if (draggable) {
                    zone.appendChild(draggable);
                }
                checkTestCompletion();
            });
        });
    }

    /**
     *  Проверяет, перемещены ли все карточки в зоны сброса, и показывает кнопку проверки.
     */
    function checkTestCompletion() {
        if (sourceCardsContainer.children.length === 0) {
            checkBtn.classList.remove('hidden');
        }
    }

    /**
     * Помечаем изученную карточку
     */
    function markCardAsLearned(cardName) {
        if (!learnedCards.includes(cardName)) {
            learnedCards.push(cardName);
            localStorage.setItem('learnedCards', JSON.stringify(learnedCards));
        }
    }

    /**
     *  Сбрасывает тест и возвращает пользователя к обучающей части.
     */
    function resetTest() {
        // Скрыть тест и показать обучение
        testArea.classList.add('hidden');
        learnContainer.classList.remove('hidden');
        startTestBtn.classList.remove('hidden');
        resetLearnedBtn.classList.remove('hidden');

        // Очистить тестовые элементы
        sourceCardsContainer.innerHTML = '';
        resultsContainer.innerHTML = '';
        checkBtn.classList.add('hidden');

        // Вернуть исходное состояние зон
        dropZones.forEach(zone => {
            zone.innerHTML = `<h3>${zone.dataset.type}</h3>`;
        });

        // Очистить старые обучающие карточки и пересоздать
        learnContainer.innerHTML = '';
        createLearningCards();
    }

    /**
     * Вычисляет и отображает результаты теста.
     */
    function calculateResults() {
        let correctAnswers = 0;
        let incorrectAnswers = 0;

        dropZones.forEach(zone => {
            const zoneType = zone.dataset.type;
            const cardsInZone = zone.querySelectorAll('.card');

            cardsInZone.forEach(card => {
                card.draggable = false; // Отключить дальнейшее перетаскивание
                card.style.cursor = 'default';
                if (card.dataset.type === zoneType) {
                    correctAnswers++;
                    card.classList.add('correct');
                } else {
                    incorrectAnswers++;
                    card.classList.add('incorrect');
                }
            });
        });

        resultsContainer.textContent = `Правильно: ${correctAnswers}, Ошибочно: ${incorrectAnswers}`;
        checkBtn.classList.add('hidden');
    }

    // ---- ИНИЦИАЛИЗАЦИЯ ----
    createLearningCards();
    startTestBtn.addEventListener('click', initializeTest);
    checkBtn.addEventListener('click', calculateResults);
    shuffleBtn.addEventListener('click', shuffleCards);
    resetLearnedBtn.addEventListener('click', resetLearnedCards);
    backBtn.addEventListener('click', resetTest);
});