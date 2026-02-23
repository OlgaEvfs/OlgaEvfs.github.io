// Импортируем все экспортированные функции из script.js
import * as script from './script.js';

// Мокаем localStorage для изоляции тестов от реального хранилища браузера.
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key) => {
            delete store[key];
        },
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
});

describe('markCardAsLearned', () => {
    beforeEach(() => {
        localStorage.clear();
        script.learnedCards.length = 0;
    });

    test('должна добавлять новую карточку в learnedCards и localStorage', () => {
        const cardName = 'Test Card 1';
        script.markCardAsLearned(cardName);

        expect(script.learnedCards).toContain(cardName);
        expect(script.learnedCards.length).toBe(1);
        expect(localStorage.getItem('learnedCards')).toEqual(JSON.stringify([cardName]));
    });

    test('не должна добавлять уже изученную карточку', () => {
        const cardName = 'Test Card 2';
        script.markCardAsLearned(cardName);
        script.markCardAsLearned(cardName);

        expect(script.learnedCards.length).toBe(1);
        expect(localStorage.getItem('learnedCards')).toEqual(JSON.stringify([cardName]));
    });

    test('должна работать с несколькими карточками', () => {
        const cardName1 = 'Card A';
        const cardName2 = 'Card B';
        script.markCardAsLearned(cardName1);
        script.markCardAsLearned(cardName2);

        expect(script.learnedCards).toContain(cardName1);
        expect(script.learnedCards).toContain(cardName2);
        expect(script.learnedCards.length).toBe(2);
        expect(localStorage.getItem('learnedCards')).toEqual(JSON.stringify([cardName1, cardName2]));
    });
});

describe('resetLearnedCards', () => {
    // Мокаем createLearningCards, так как она работает с DOM, который мы не хотим здесь тестировать
    const mockCreateLearningCards = jest.fn();

    beforeEach(() => {
        localStorage.clear();
        script.learnedCards.length = 0;
        mockCreateLearningCards.mockClear();
    });

    test('должна очищать learnedCards и удалять элемент из localStorage', () => {
        script.learnedCards.push('Card A', 'Card B');
        localStorage.setItem('learnedCards', JSON.stringify(script.learnedCards));

        script.resetLearnedCards(mockCreateLearningCards);

        expect(script.learnedCards.length).toBe(0);
        expect(localStorage.getItem('learnedCards')).toBeNull();
    });

    test('должна вызывать createLearningCards', () => {
        script.resetLearnedCards(mockCreateLearningCards);
        expect(mockCreateLearningCards).toHaveBeenCalledTimes(1);
    });
});

describe('DOM manipulation functions', () => {
    beforeEach(() => {
        // Создаем базовую структуру DOM для тестов
        document.body.innerHTML = `
            <div id="card-container"></div>
            <button id="start-test-btn"></button>
            <div id="test-area" class="hidden">
                <div id="source-cards"></div>
                <div class="drop-zone" data-type="System Software"><h3>System Software</h3></div>
                <div class="drop-zone" data-type="Application Software"><h3>Application Software</h3></div>
                <button id="check-btn" class="hidden"></button>
                <div id="results"></div>
                <button id="shuffle-btn"></button>
                <button id="reset-btn"></button>
                <button id="back-btn"></button>
            </div>
        `;
    });

    describe('calculateResults', () => {
        test('должна корректно подсчитывать и отображать результаты', () => {
            const dropZone1 = document.querySelector('.drop-zone[data-type="System Software"]');
            const dropZone2 = document.querySelector('.drop-zone[data-type="Application Software"]');
            const resultsContainer = document.getElementById('results');
            const checkBtn = document.getElementById('check-btn');

            // Добавляем карточки в зоны
            dropZone1.innerHTML += '<div class="card" data-type="System Software"></div>'; // Правильная
            dropZone1.innerHTML += '<div class="card" data-type="Application Software"></div>'; // Неправильная
            dropZone2.innerHTML += '<div class="card" data-type="Application Software"></div>'; // Правильная

            script.calculateResults();

            expect(resultsContainer.textContent).toBe('Правильно: 2, Ошибочно: 1');
            expect(checkBtn.classList.contains('hidden')).toBe(true);

            const cards = document.querySelectorAll('.card');
            expect(cards[0].classList.contains('correct')).toBe(true);
            expect(cards[1].classList.contains('incorrect')).toBe(true);
            expect(cards[2].classList.contains('correct')).toBe(true);
        });
    });

    describe('checkTestCompletion', () => {
        test('должна показывать кнопку "check", если все карточки распределены', () => {
            const checkBtn = document.getElementById('check-btn');
            const sourceCardsContainer = document.getElementById('source-cards');
            sourceCardsContainer.innerHTML = ''; // Карточек нет

            script.checkTestCompletion();
            expect(checkBtn.classList.contains('hidden')).toBe(false);
        });

        test('не должна показывать кнопку "check", если остались карточки', () => {
            const checkBtn = document.getElementById('check-btn');
            const sourceCardsContainer = document.getElementById('source-cards');
            sourceCardsContainer.innerHTML = '<div class="card"></div>'; // Есть одна карточка

            script.checkTestCompletion();
            expect(checkBtn.classList.contains('hidden')).toBe(true);
        });
    });

    describe('shuffleCards', () => {
        test('должна перемешивать порядок карточек', () => {
            const sourceCardsContainer = document.getElementById('source-cards');
            sourceCardsContainer.innerHTML = `
                <div id="card-1"></div>
                <div id="card-2"></div>
                <div id="card-3"></div>
            `;
            const initialOrder = Array.from(sourceCardsContainer.children).map(c => c.id);

            // Мокаем Math.random для предсказуемого перемешивания
            const mockMath = Object.create(global.Math);
            let call = 0;
            mockMath.random = () => {
                const values = [0.1, 0.2, 0.3]; // Разные значения для лучшего перемешивания
                return values[call++ % values.length];
            };
            global.Math = mockMath;

            script.shuffleCards();

            const newOrder = Array.from(sourceCardsContainer.children).map(c => c.id);
            expect(newOrder).not.toEqual(initialOrder);
            expect(newOrder.length).toBe(3);
        });
    });

    describe('initializeTest', () => {
        test('должна настраивать среду для теста', () => {
            const learnContainer = document.getElementById('card-container');
            const startTestBtn = document.getElementById('start-test-btn');
            const testArea = document.getElementById('test-area');
            const sourceCardsContainer = document.getElementById('source-cards');
            const dropZones = document.querySelectorAll('.drop-zone');

            script.initializeTest();

            expect(learnContainer.classList.contains('hidden')).toBe(true);
            expect(startTestBtn.classList.contains('hidden')).toBe(true);
            expect(testArea.classList.contains('hidden')).toBe(false);
            expect(sourceCardsContainer.children.length).toBe(20); // Должно быть создано 20 карточек
            expect(dropZones[0].innerHTML).toBe('<h3>System Software</h3>');
            expect(dropZones[1].innerHTML).toBe('<h3>Application Software</h3>');
        });
    });

    describe('addDragAndDropListeners', () => {
        test('должна добавлять слушатели событий к карточкам и зонам', () => {
            // Заполняем source-cards, чтобы было что тестить
            document.getElementById('source-cards').innerHTML = '<div class="card" id="card-test"></div>';
            const card = document.getElementById('card-test');
            const dropZone = document.querySelector('.drop-zone');
            
            const cardAddEventListenerSpy = jest.spyOn(card, 'addEventListener');
            const dropZoneAddEventListenerSpy = jest.spyOn(dropZone, 'addEventListener');

            script.addDragAndDropListeners();

            expect(cardAddEventListenerSpy).toHaveBeenCalledWith('dragstart', expect.any(Function));
            expect(cardAddEventListenerSpy).toHaveBeenCalledWith('dragend', expect.any(Function));
            expect(dropZoneAddEventListenerSpy).toHaveBeenCalledWith('dragover', expect.any(Function));
            expect(dropZoneAddEventListenerSpy).toHaveBeenCalledWith('dragleave', expect.any(Function));
            expect(dropZoneAddEventListenerSpy).toHaveBeenCalledWith('drop', expect.any(Function));
        });
    });

    describe('createLearningCards', () => {
        let learnContainer;
        let originalMarkCardAsLearned;

        beforeEach(() => {
            document.body.innerHTML = `
                <div id="card-container"></div>
            `;
            learnContainer = document.getElementById('card-container');
            script.learnedCards.length = 0; // Очищаем массив для каждого теста
            localStorage.clear(); // Очищаем localStorage для каждого теста
            
            // Store original and replace with a blank mock
            originalMarkCardAsLearned = script.markCardAsLearned;
            script.markCardAsLearned = jest.fn(); 
        });

        afterEach(() => {
            // Restore the original function
            script.markCardAsLearned = originalMarkCardAsLearned;
        });

        test('должна создавать карточки в learnContainer', () => {
            script.createLearningCards();
            expect(learnContainer.children.length).toBeGreaterThan(0); // Должны быть созданы карточки
            const firstCard = learnContainer.querySelector('.card');
            expect(firstCard).not.toBeNull();
            expect(firstCard.querySelector('.card-front')).not.toBeNull();
            expect(firstCard.querySelector('.card-back')).not.toBeNull();
            expect(firstCard.querySelector('.markBtn')).not.toBeNull();
        });

        test('должна добавлять корректный текст и тип карточки', () => {
            script.createLearningCards();
            const firstCard = learnContainer.querySelector('.card');
            const softwareItem = script.softwareData.find(item => item.name === firstCard.querySelector('.card-front').childNodes[0].textContent.trim());
            expect(firstCard.querySelector('.card-front').childNodes[0].textContent.trim()).toBe(softwareItem.name);
            expect(firstCard.querySelector('.card-back h3').textContent).toBe(softwareItem.type);
        });

        test('клик по карточке должен переключать класс is-flipped', () => {
            script.createLearningCards();
            const card = learnContainer.querySelector('.card');
            expect(card.classList.contains('is-flipped')).toBe(false);
            card.click();
            expect(card.classList.contains('is-flipped')).toBe(true);
            card.click();
            expect(card.classList.contains('is-flipped')).toBe(false);
        });

        test('клик по кнопке "Learned" должен вызывать markCardAsLearned и удалять карточку', () => {
            script.createLearningCards();
            const card = learnContainer.querySelector('.card');
            const markBtn = card.querySelector('.markBtn');
            const cardName = card.querySelector('.card-front').childNodes[0].textContent.trim();

            const cardRemoveSpy = jest.spyOn(card, 'remove');
            const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation');
            
            markBtn.click();

            // Assert on the side effects instead of the direct call, due to closure complexities
            expect(script.learnedCards).toContain(cardName);
            expect(localStorage.getItem('learnedCards')).toEqual(JSON.stringify([cardName]));
            expect(cardRemoveSpy).toHaveBeenCalledTimes(1);
            expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
            expect(learnContainer.contains(card)).toBe(false);

            cardRemoveSpy.mockRestore();
            stopPropagationSpy.mockRestore();
        });

        test('не должна создавать карточки, которые уже изучены', () => {
            const learnedCardName = script.softwareData[0].name;
            script.learnedCards.push(learnedCardName);
            
            script.createLearningCards();

            const cardElements = Array.from(learnContainer.querySelectorAll('.card'));
            const learnedCard = cardElements.find(card => card.querySelector('.card-front').childNodes[0].textContent.trim() === learnedCardName);
            expect(learnedCard).toBeUndefined(); // Карточки не должно быть среди созданных
            expect(learnContainer.children.length).toBe(script.softwareData.length - 1); // Количество карточек должно быть на 1 меньше
        });

        test('должна очищать контейнер перед добавлением новых карточек', () => {
            learnContainer.innerHTML = '<div class="old-card"></div>';
            script.createLearningCards();
            expect(learnContainer.querySelector('.old-card')).toBeNull();
        });
    });

    describe('resetTest', () => {
        let originalCreateLearningCards;

        beforeEach(() => {
            document.body.innerHTML = `
                <div id="card-container" class="hidden"></div>
                <button id="start-test-btn" class="hidden"></button>
                <div id="test-area">
                    <div id="source-cards">Some test cards</div>
                    <div class="drop-zone" data-type="System Software">Filled System Software</div>
                    <div class="drop-zone" data-type="Application Software">Filled Application Software</div>
                </div>
                <button id="check-btn"></button>
                <div id="results">Some results</div>
                <button id="shuffle-btn"></button>
                <button id="reset-btn" class="hidden"></button>
                <button id="back-btn"></button>
            `;
            // Mock createLearningCards as it's called by resetTest
            originalCreateLearningCards = script.createLearningCards;
            script.createLearningCards = jest.fn();
        });

        afterEach(() => {
            script.createLearningCards = originalCreateLearningCards;
        });

        test('должна скрывать test-area и показывать learning area элементы', () => {
            const learnContainer = document.getElementById('card-container');
            const startTestBtn = document.getElementById('start-test-btn');
            const testArea = document.getElementById('test-area');
            const resetBtn = document.getElementById('reset-btn');

            script.resetTest();

            expect(testArea.classList.contains('hidden')).toBe(true);
            expect(learnContainer.classList.contains('hidden')).toBe(false);
            expect(startTestBtn.classList.contains('hidden')).toBe(false);
            expect(resetBtn.classList.contains('hidden')).toBe(false);
        });

        test('должна очищать source-cards и results', () => {
            const sourceCardsContainer = document.getElementById('source-cards');
            const resultsContainer = document.getElementById('results');

            script.resetTest();

            expect(sourceCardsContainer.innerHTML).toBe('');
            expect(resultsContainer.innerHTML).toBe('');
        });

        test('должна сбрасывать drop zones до их заголовков', () => {
            const dropZones = document.querySelectorAll('.drop-zone');

            script.resetTest();

            expect(dropZones[0].innerHTML).toBe('<h3>System Software</h3>');
            expect(dropZones[1].innerHTML).toBe('<h3>Application Software</h3>');
        });

        test('должна вызывать createLearningCards', () => {
            script.resetTest();
            expect(script.createLearningCards).toHaveBeenCalledTimes(1);
        });
    });
});
