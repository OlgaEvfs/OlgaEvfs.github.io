// __tests__/main.test.ts
import { Task, Status, Priority } from '../src/types'; // Импортируем типы для корректной типизации в тестах

// Мокируем глобальный document.addEventListener
const addEventListenerSpy = jest.spyOn(global.document, 'addEventListener');

// Mock external modules
const mockStorage = {
  loadTasks: jest.fn(),
  saveTasks: jest.fn(),
  generateId: jest.fn(),
};
// Мокируем модуль '../src/storage', чтобы контролировать его поведение в тестах.
jest.mock('../src/storage', () => mockStorage);

const mockUi = {
  renderBoard: jest.fn(),
  bindDragAndDrop: jest.fn(),
  createTaskElement: jest.fn(),
};
// Мокируем модуль '../src/ui', чтобы предотвратить реальное взаимодействие с DOM и контролировать вызовы функций.
jest.mock('../src/ui', () => mockUi);

// Мокируем глобальные DOM-элементы, необходимые main.ts.
const mockForm = {
  addEventListener: jest.fn(),
};
const mockTitleInput = {
  value: '',
};
const mockColumnElement = () => ({
  querySelector: jest.fn(() => ({ classList: { add: jest.fn(), remove: jest.fn() } })), // Мок для flash-done эффекта
  addEventListener: jest.fn(),
  innerHTML: '', // Для очистки при рендеринге доски
  appendChild: jest.fn(), // Для добавления элементов в колонку
});

// Переопределяем document.getElementById для возврата наших мок-элементов.
document.getElementById = jest.fn((id) => {
  if (id === 'new-task-form') return mockForm as any;
  if (id === 'task-title') return mockTitleInput as any;
  if (id.startsWith('col-')) return mockColumnElement() as any;
  return null;
});

// Описываем тестовый набор для логики main.ts
describe('main.ts logic', () => {
  const initialTasks: Task[] = [ // Явно типизируем initialTasks
    { id: '1', title: 'Task 1', createdAt: 'iso1', status: 'todo', priority: 'medium' },
    { id: '2', title: 'Task 2', createdAt: 'iso2', status: 'wip', priority: 'high' },
    { id: '3', title: 'Task 3', createdAt: 'iso3', status: 'test', priority: 'low' },
  ];

  let actualMoveTaskCallback: (taskId: string, to: Status) => void;
  let actualChangePriorityCallback: (taskId: string, newPriority: Priority) => void;

  // Сбрасываем все моки и переопределяем их поведение перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks(); // Очищаем все вызовы мок-функций

    // Мокируем loadTasks для предоставления начального состояния задач
    mockStorage.loadTasks.mockReturnValue(JSON.parse(JSON.stringify(initialTasks)));
    mockStorage.generateId.mockReturnValue('new-generated-id'); // Делаем генерацию ID предсказуемой

    // Мокируем bindDragAndDrop, чтобы захватить колбэк moveTask
    mockUi.bindDragAndDrop.mockImplementation((columns: Record<Status, HTMLElement>, onMove: (taskId: string, to: Status) => void) => {
      actualMoveTaskCallback = onMove;
    });

    // Мокируем renderBoard, чтобы захватить колбэк changePriority
    mockUi.renderBoard.mockImplementation((tasks: Task[], columns: Record<Status, HTMLElement>, onPriorityChange: (taskId: string, newPriority: Priority) => void) => {
      actualChangePriorityCallback = onPriorityChange;
      // Внутри renderBoard вызывается createTaskElement, который тоже мокнут
      tasks.forEach((task: Task) => { // Явно типизируем task
        columns[task.status]?.appendChild(mockUi.createTaskElement(task, onPriorityChange));
      });
    });

    // Сброс модуля `main` позволяет убедиться, что его внутреннее состояние обновляется
    // и все глобальные слушатели событий регистрируются заново для каждого теста.
    jest.resetModules();
    require('../src/main'); // Повторный импорт main.js после настройки моков
  });

  // Тестирование создания новой задачи через отправку формы
  describe('new task creation via form submission', () => {
    test('должна добавлять новую задачу в массив задач и синхронизировать состояние', () => {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      mockTitleInput.value = 'Моя Новая Задача'; // Устанавливаем значение поля ввода

      // Вызываем обработчик события отправки формы
      // (mockForm.addEventListener.mock.calls[0][1] - это первая зарегистрированная функция-обработчик)
      mockForm.addEventListener.mock.calls[0][1](submitEvent);

      // Проверяем, что состояние было сохранено и доска перерисована (1 раз при импорте, 1 раз при добавлении задачи)
      expect(mockStorage.saveTasks).toHaveBeenCalledTimes(2);
      expect(mockUi.renderBoard).toHaveBeenCalledTimes(2);

      // Проверяем, что сохраненные задачи содержат новую задачу
      const savedTasks: Task[] = mockStorage.saveTasks.mock.calls[1][0]; // Берем вызов после добавления
      expect(savedTasks).toHaveLength(initialTasks.length + 1); // Должна быть добавлена одна задача
      expect(savedTasks[0]).toMatchObject({ // Новая задача должна быть первой
        id: 'new-generated-id',
        title: 'Моя Новая Задача',
        status: 'todo',
        priority: 'medium',
      });
      expect(mockTitleInput.value).toBe(''); // Поле ввода должно быть очищено
    });

    test('не должна добавлять задачу, если заголовок пустой', () => {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      mockTitleInput.value = ''; // Пустой заголовок

      mockForm.addEventListener.mock.calls[0][1](submitEvent);

      // Проверяем, что сохранение и рендеринг были вызваны только 1 раз (при импорте модуля)
      expect(mockStorage.saveTasks).toHaveBeenCalledTimes(1);
      expect(mockUi.renderBoard).toHaveBeenCalledTimes(1);
    });
  });

  // Тестирование удаления задачи по событию клика
  describe('task deletion via click event', () => {
    test('должна удалять задачу из массива задач и синхронизировать состояние', () => {
      // Мокируем поведение closest для имитации клика по кнопке удаления карточки
      const clickEvent = {
        target: {
          closest: jest.fn((selector) => {
            if (selector === '.card-delete') {
              return {
                closest: jest.fn((cardSelector) => {
                  if (cardSelector === '.card') {
                    return { dataset: { id: '1' } }; // Имитируем карточку с id '1'
                  }
                  return null;
                }),
              };
            }
            return null;
          }),
        },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      };

      // Находим глобальный обработчик клика, зарегистрированный main.ts
      const clickCall = addEventListenerSpy.mock.calls.find(call => call[0] === 'click');
      expect(clickCall).toBeDefined(); // Убеждаемся, что слушатель был зарегистрирован
      const globalClickListener = clickCall![1] as Function; // Доступ к колбэку и приведение к типу Function
      globalClickListener(clickEvent as any);

      // Проверяем, что состояние было сохранено и доска перерисована (1 раз при импорте, 1 раз при удалении)
      expect(mockStorage.saveTasks).toHaveBeenCalledTimes(2);
      expect(mockUi.renderBoard).toHaveBeenCalledTimes(2);

      // Проверяем, что задача с id '1' была удалена
      const savedTasks: Task[] = mockStorage.saveTasks.mock.calls[1][0]; // Берем вызов после удаления
      expect(savedTasks).toHaveLength(initialTasks.length - 1);
      expect(savedTasks.some((t: Task) => t.id === '1')).toBeFalsy(); // Задача '1' не должна присутствовать
    });
  });

  // Тестирование колбэков, передаваемых модулю UI
  describe('callbacks from ui module (moveTask and changePriority)', () => {
    test('должна корректно перемещать задачу и синхронизировать состояние при вызове колбэка moveTask', () => {
      expect(actualMoveTaskCallback).toBeDefined(); // Убеждаемся, что колбэк был захвачен
      // Имитируем перемещение задачи '1' в статус 'wip'
      actualMoveTaskCallback('1', 'wip');

      // Проверяем, что состояние было сохранено и доска перерисована (1 раз при импорте, 1 раз при перемещении)
      expect(mockStorage.saveTasks).toHaveBeenCalledTimes(2);
      expect(mockUi.renderBoard).toHaveBeenCalledTimes(2);

      // Проверяем, что статус задачи '1' изменился на 'wip'
      const savedTasks: Task[] = mockStorage.saveTasks.mock.calls[1][0]; // Берем вызов после перемещения
      const movedTask = savedTasks.find((t: Task) => t.id === '1'); // Явно типизируем
      expect(movedTask).toBeDefined();
      expect(movedTask!.status).toBe('wip');
    });

    test('должна корректно изменять приоритет задачи и синхронизировать состояние при вызове колбэка changePriority', () => {
      expect(actualChangePriorityCallback).toBeDefined(); // Убеждаемся, что колбэк был захвачен
      // Имитируем изменение приоритета задачи '2' на 'low'
      actualChangePriorityCallback('2', 'low');

      // Проверяем, что состояние было сохранено и доска перерисована (1 раз при импорте, 1 раз при изменении)
      expect(mockStorage.saveTasks).toHaveBeenCalledTimes(2);
      expect(mockUi.renderBoard).toHaveBeenCalledTimes(2);

      // Проверяем, что приоритет задачи '2' изменился на 'low'
      const savedTasks: Task[] = mockStorage.saveTasks.mock.calls[1][0]; // Берем вызов после изменения
      const changedTask = savedTasks.find((t: Task) => t.id === '2'); // Явно типизируем
      expect(changedTask).toBeDefined();
      expect(changedTask!.priority).toBe('low');
    });
  });
});
