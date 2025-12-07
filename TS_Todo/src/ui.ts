// Модуль, отвечающий за взаимодействие с DOM
import type { Task, Status, } from './types';

// Утилита форматирования даты для пользовательского вывода
export function formatDate(iso: string): string {
    // Преобразуем ISO-строку в удобочитаемую дату/время
    const d = new Date(iso);
    // toLocaleString - простой способ вывести дату с учетом локали
    return d.toLocaleString(undefined, {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

// Создание DOM-элемента карточки задачи
export function createTaskElement(task: Task, onPriorityChange: (id: string, priority: 'low' | 'medium' | 'high') => void): HTMLElement {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    // Для DnD: указываем, что элемент можно перетаскивать
    card.draggable = true;
    // Сохраняем id в data-атрибуте, чтобы легко извлечь при drop
    card.dataset.id = task.id;

    // Кнопка удаления карточки
    const delBtn = document.createElement('button');
    delBtn.className = 'card-delete';
    delBtn.type = 'button';
    delBtn.title = 'Delete task';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.textContent = 'x';

    // Заголовок задачи
    const titleEl = document.createElement('div');
    titleEl.className = 'card-title';
    titleEl.textContent = task.title;

    // Метаданные: дата создания
    const metaEl = document.createElement('div');
    metaEl.className = 'card-meta';
    metaEl.textContent = `Created: ${formatDate(task.createdAt)}`;

    // Приоритет задачи
    const prioritySelect = document.createElement('select');
    prioritySelect.className = 'card-priority-select';

    prioritySelect.innerHTML = `
        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
    `;

    prioritySelect.addEventListener('change', () => {
        onPriorityChange(task.id, prioritySelect.value as 'low' | 'medium' | 'high');
    });

    card.append(delBtn, titleEl, metaEl, prioritySelect);
    return card;
}

// Привязка обработчиков Drag & Drop к колонкам и карточкам
// onMove - колбэк, вызывается при переносе карточки в новую колонку
export function bindDragAndDrop(
    columns: Record<Status, HTMLElement>,
    onMove: (taskId: string, to: Status) => void
): void {
    // Навешиваем обработчики на каждую колонку
    (Object.keys(columns) as Status[]).forEach((status) => {
        const col = columns[status];

        // При перетаскивании над колонкой - разрешаем drop
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('drag-over');
        });

        col.addEventListener('dragleave', () => {
            col.classList.remove('drag-over');
        });

        // При броске карточки: извлекаем id и оповещаем колбэк
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.classList.remove('drag-over');
            const id = e.dataTransfer?.getData('text/plain');
            if (id) onMove(id, status);
        });
    });

    // Делегируем обработчик dragstart на весь документ: карточки создаются динамически
    document.addEventListener('dragstart', (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        // Проверяем, что старт перетаскивания относится к карточке
        const card = target.closest('.card') as HTMLElement | null;
        if (card && card.dataset.id) {
            e.dataTransfer?.setData('text/plain', card.dataset.id);
            // Небольщой визуальный эффект: полупрозрачность в момент переноса
            card.style.opacity = '';
        }
    });

    document.addEventListener('dargend', (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const card = target.closest('.card') as HTMLElement | null;
        if (card) {
            card.style.opacity = '';
        }
    });
}

// Рендер задач в соответствующие колонки
export function renderBoard(tasks: Task[], columns: Record<Status, HTMLElement>, onPriorityChange: (id: string, priority: 'low' | 'medium' | 'high') => void): void {
    // Сначала очищаем содержимое колонок
    (Object.keys(columns) as Status[]).forEach((status) => {
        columns[status].innerHTML = '';
    });

    // Затем создаем карточки и добавляем в нужную колонку
    tasks.forEach((task) => {
        const el = createTaskElement(task, onPriorityChange);
        columns[task.status].appendChild(el);
    });
}