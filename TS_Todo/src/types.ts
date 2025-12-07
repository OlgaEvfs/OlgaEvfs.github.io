// Типы данных для приложения Kanban

// Возможные статусы задачи (колонки доски)
export type Status = 'todo' | 'wip' | 'test' | 'done';
export type Priority = 'low' | 'medium' | 'high';


// Описание сущности задачи
export interface Task {
    // Уникальный идентификатор. Нужен для DnD и обновлений
    id: string;
    // Заголовок/название задачи, вводится пользователем
    title: string;
    // Дата создания в ISO-формате (строка), щаполняется автоматически
    createdAt: string;
    // Приоритет задания
    priority: Priority;
    // Статус задачи (в какой колонке она находится сейчас)
    status: Status;
}