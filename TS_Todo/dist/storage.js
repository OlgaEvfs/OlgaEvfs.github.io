// Модуль для работы с localStorage
//Содержит функции загрузки/сохранения списка задач и генерации id
const STORAGE_KEY = 'kanban_tasks_v1';
// Безопасная нагрузка задач из localStorage.
// Если записей нет или формат поврежден - вернем пустой массивю
export function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        // Простейщая валидация структуры
        return parsed.filter((t) => t && typeof t === 'object' &&
            typeof t.id === 'string' &&
            typeof t.title === 'string' &&
            typeof t.createdAt === 'string' &&
            ['todo', 'wip', 'done'].includes(t.status) &&
            ['low', 'medium', 'high'].includes(t.priority));
    }
    catch (_a) {
        return [];
    }
}
// Сохранение массива задач как JSON-строки
export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
// Простейшая генерация уникального идентификатора
// Используем время + случайный суффикс
export function generateId() {
    const rnd = Math.random().toString(36).slice(2, 8);
    return `${Date.now().toString(36)}_${rnd}`;
}
//# sourceMappingURL=storage.js.map