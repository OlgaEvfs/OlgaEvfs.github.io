// Главный модуль приложения
// Здесь инициализируется состояниеб навешиваем события и запускаем рендер.
// ВАЖНО: в импортах указываем суффикс .js, чтобы браузер ESM (мог найти файлы после сборки)
// корректно находил скомпилированные файлы в dist/ без бандлера.
import { loadTasks, saveTasks, generateId } from './storage.js';
import { renderBoard, bindDragAndDrop } from './ui.js';
// Назождение элементов интерфейса
const form = document.getElementById('new-task-form');
const titleInput = document.getElementById('task-title');
// Колонки (элементы, куда помещаются карточки)
const colTodo = document.getElementById('col-todo');
const colWip = document.getElementById('col-wip');
const colTest = document.getElementById('col-test');
const colDone = document.getElementById('col-done');
// Сопоставление статус -> элемент колонки
const colums = {
    todo: colTodo,
    wip: colWip,
    test: colTest,
    done: colDone,
};
// Локальное состояние задач (загружаем из localStorage при старте)
let tasks = loadTasks();
// Утилита перерендера и сохранения
function sync() {
    renderBoard(tasks, colums, changePriority);
    saveTasks(tasks);
}
// Обработка создания новой задачи
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    if (!title)
        return;
    // Создаем новую задачу: дата ставится автоматически текущая
    const newTask = {
        id: generateId(),
        title,
        createdAt: new Date().toISOString(),
        priority: 'medium',
        status: 'todo',
    };
    tasks = [newTask, ...tasks];
    titleInput.value = '';
    sync();
});
// Функция перемещения задачи между колонками
function moveTask(taskId, to) {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1)
        return;
    // Обновляем статус и сохраняем
    tasks[idx] = { ...tasks[idx], status: to };
    sync();
    // Если задача перемещена в колонку Done - подсветим ее карточку на 1 секунду
    if (to === 'done') {
        const el = colums.done.querySelector(`[data-id="${taskId}"]`);
        if (el) {
            el.classList.add('flash-done');
            setTimeout(() => el.classList.remove('flash-done'), 1000);
        }
    }
}
// Изменение приоритета
function changePriority(taskId, newPriority) {
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1)
        return;
    tasks[idx].priority = newPriority;
    sync();
}
// Привязка Drag & Drop
bindDragAndDrop(colums, moveTask);
// Первый рендер на старте
sync();
// Удаление задачи по клику на кнопку удаления
// Деленируем на весь документ, т.к. карточки динамические
document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target)
        return;
    const delBtn = target.closest('.card-delete');
    if (!delBtn)
        return;
    e.preventDefault();
    e.stopPropagation();
    const card = delBtn.closest('.card');
    const id = card === null || card === void 0 ? void 0 : card.dataset.id;
    if (!id)
        return;
    // Фактическое удаление и синхронихация
    tasks = tasks.filter((t) => t.id !== id);
    sync();
});
//# sourceMappingURL=main.js.map