// Утилита форматирования даты для пользовательского вывода
export function formatDate(iso) {
    // Преобразуем ISO-строку в удобочитаемую дату/время
    const d = new Date(iso);
    // toLocaleString - простой способ вывести дату с учетом локали
    return d.toLocaleString(undefined, {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}
// Создание DOM-элемента карточки задачи
export function createTaskElement(task, onPriorityChange) {
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
        onPriorityChange(task.id, prioritySelect.value);
    });
    card.append(delBtn, titleEl, metaEl, prioritySelect);
    return card;
}
// Привязка обработчиков Drag & Drop к колонкам и карточкам
// onMove - колбэк, вызывается при переносе карточки в новую колонку
export function bindDragAndDrop(columns, onMove) {
    // Навешиваем обработчики на каждую колонку
    Object.keys(columns).forEach((status) => {
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
            var _a;
            e.preventDefault();
            col.classList.remove('drag-over');
            const id = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
            if (id)
                onMove(id, status);
        });
    });
    // Делегируем обработчик dragstart на весь документ: карточки создаются динамически
    document.addEventListener('dragstart', (e) => {
        var _a;
        const target = e.target;
        if (!target)
            return;
        // Проверяем, что старт перетаскивания относится к карточке
        const card = target.closest('.card');
        if (card && card.dataset.id) {
            (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', card.dataset.id);
            // Небольщой визуальный эффект: полупрозрачность в момент переноса
            card.style.opacity = '0.6';
        }
    });
    document.addEventListener('dragend', (e) => {
        const target = e.target;
        if (!target)
            return;
        const card = target.closest('.card');
        if (card) {
            card.style.opacity = '';
        }
    });
}
// Рендер задач в соответствующие колонки
export function renderBoard(tasks, columns, onPriorityChange) {
    // Сначала очищаем содержимое колонок
    Object.keys(columns).forEach((status) => {
        columns[status].innerHTML = '';
    });
    // Затем создаем карточки и добавляем в нужную колонку
    tasks.forEach((task) => {
        const el = createTaskElement(task, onPriorityChange);
        columns[task.status].appendChild(el);
    });
}
//# sourceMappingURL=ui.js.map