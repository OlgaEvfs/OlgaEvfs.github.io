// Глобальные переменные и данные, экспортируемые для тестирования и использования в других модулях
export let learnedCards = JSON.parse(localStorage.getItem('learnedCards')) || [];

// Вспомогательная переменная для softwareData.
// В идеале, softwareData должна быть импортирована из другого файла или получена с сервера.
// Для простоты, пока оставим ее здесь и экспортируем.
export const softwareData = [
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
    { name: 'Debian', 'type': 'System Software' },
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

// Все функции должны быть определены на верхнем уровне и экспортированы, если они нужны снаружи.
export function markCardAsLearned(cardName) {
    if (!learnedCards.includes(cardName)) {
        learnedCards.push(cardName);
        localStorage.setItem('learnedCards', JSON.stringify(learnedCards));
    }
}

export function createLearningCards() {
    const learnContainer = document.getElementById('card-container');
    const shuffledData = softwareData.filter(item => !learnedCards.includes(item.name)).sort(() => Math.random() - 0.5);

    // Очистить контейнер перед добавлением новых карточек.
    // Это должно быть сделано только если learnContainer действительно существует,
    // что может быть не так в тестовой среде без DOM.
    if (learnContainer) {
        learnContainer.innerHTML = '';
    }

    shuffledData.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
                <div class="card-face card-front">
                    ${item.name}
                    <button class="markBtn">Learned</button>
                </div>
                <div class="card-face card-back"><h3>${item.type}</h3></div>
            `;

        // Только добавляем слушатель, если элемент существует
        const markBtn = card.querySelector('.markBtn');
        if (markBtn) {
            markBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                markCardAsLearned(item.name);
                card.remove();
            });
        }
        
        if (card) {
            card.addEventListener('click', () => card.classList.toggle('is-flipped'));
            if (learnContainer) {
                learnContainer.appendChild(card);
            }
        }
    });
}

export function resetLearnedCards(clc = createLearningCards) { // Передаем createLearningCards как аргумент по умолчанию
    learnedCards.length = 0; // Очищаем массив, сохраняя ссылку
    localStorage.removeItem('learnedCards');
    clc(); // Вызываем переданную функцию
}

// Вся остальная логика, которая раньше была в DOMContentLoaded, теперь находится в функции init
// или может быть перенесена в отдельные экспортируемые функции.
// Здесь я буду реструктурировать только те части, которые влияют на тестирование.

// Функции, которые не экспортируются, но используются внутри модуля
export function initializeTest() {
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

    // Скрыть область обучения и показать область теста
    if (learnContainer) learnContainer.classList.add('hidden');
    if (startTestBtn) startTestBtn.classList.add('hidden');
    if (testArea) testArea.classList.remove('hidden');
    if (resetLearnedBtn) resetLearnedBtn.classList.add('hidden');

    // Сбросить предыдущее состояние теста
    if (sourceCardsContainer) sourceCardsContainer.innerHTML = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
    if (checkBtn) checkBtn.classList.add('hidden');
    dropZones.forEach(zone => {
        if (zone) zone.innerHTML = `<h3>${zone.dataset.type}</h3>`; // Сбросить содержимое, но сохранить заголовок
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
        if (sourceCardsContainer) sourceCardsContainer.appendChild(card);
    });

    addDragAndDropListeners();
}

export function shuffleCards() {
    const sourceCardsContainer = document.getElementById('source-cards');
    if (!sourceCardsContainer) return;
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

export function addDragAndDropListeners() {
    const sourceCardsContainer = document.getElementById('source-cards');
    if (!sourceCardsContainer) return;
    const draggableCards = sourceCardsContainer.querySelectorAll('.card');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkBtn = document.getElementById('check-btn');

    draggableCards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => card.classList.add('hidden'), 0); // Скрыть во время перетаскивания
        });
        card.addEventListener('dragend', () => {
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

export function resetTest() {
    const learnContainer = document.getElementById('card-container');
    const startTestBtn = document.getElementById('start-test-btn');
    const testArea = document.getElementById('test-area');
    const sourceCardsContainer = document.getElementById('source-cards');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkBtn = document.getElementById('check-btn');
    const resultsContainer = document.getElementById('results');
    const resetLearnedBtn = document.getElementById('reset-btn');

    // Скрыть тест и показать обучение
    if (testArea) testArea.classList.add('hidden');
    if (learnContainer) learnContainer.classList.remove('hidden');
    if (startTestBtn) startTestBtn.classList.remove('hidden');
    if (resetLearnedBtn) resetLearnedBtn.classList.remove('hidden');

    // Очистить тестовые элементы
    if (sourceCardsContainer) sourceCardsContainer.innerHTML = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
    if (checkBtn) checkBtn.classList.add('hidden');

    // Вернуть исходное состояние зон
    dropZones.forEach(zone => {
        if (zone) zone.innerHTML = `<h3>${zone.dataset.type}</h3>`;
    });

    // Очистить старые обучающие карточки и пересоздать
    createLearningCards(); // Вызываем глобальную createLearningCards
}

export function calculateResults() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const resultsContainer = document.getElementById('results');
    const checkBtn = document.getElementById('check-btn');

    let correctAnswers = 0;
    let incorrectAnswers = 0;

    dropZones.forEach(zone => {
        const zoneType = zone.dataset.type;
        const cardsInZone = zone.querySelectorAll('.card');

        cardsInZone.forEach(card => {
            if (card) {
                card.draggable = false;
                card.style.cursor = 'default';
                if (card.dataset.type === zoneType) {
                    correctAnswers++;
                    card.classList.add('correct');
                } else {
                    incorrectAnswers++;
                    card.classList.add('incorrect');
                }
            }
        });
    });

    if (resultsContainer) resultsContainer.textContent = `Правильно: ${correctAnswers}, Ошибочно: ${incorrectAnswers}`;
    if (checkBtn) checkBtn.classList.add('hidden');
}

export function checkTestCompletion() {
    const sourceCardsContainer = document.getElementById('source-cards');
    const checkBtn = document.getElementById('check-btn');

    if (sourceCardsContainer && sourceCardsContainer.children.length === 0) {
        if (checkBtn) checkBtn.classList.remove('hidden');
    }
}

// Главная функция инициализации, которая вызывается после загрузки DOM
function init() {
    const startTestBtn = document.getElementById('start-test-btn');
    const checkBtn = document.getElementById('check-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const resetLearnedBtn = document.getElementById('reset-btn');
    const backBtn = document.getElementById('back-btn');

    createLearningCards(); // Первоначальный вызов для отображения карточек обучения

    if (startTestBtn) startTestBtn.addEventListener('click', initializeTest);
    if (checkBtn) checkBtn.addEventListener('click', calculateResults);
    if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleCards);
    if (resetLearnedBtn) resetLearnedBtn.addEventListener('click', resetLearnedCards);
    if (backBtn) backBtn.addEventListener('click', resetTest);
}

// Запускаем инициализацию после полной загрузки DOM
document.addEventListener('DOMContentLoaded', init);