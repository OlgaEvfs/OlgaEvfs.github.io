import { generateId, loadTasks, saveTasks } from '../src/storage';
import { Task, Status, Priority } from '../src/types'; // Assuming types are needed for example tasks

// Mock localStorage
const localStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('storage.ts', () => {

  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  describe('generateId', () => {
    test('should generate a unique ID each time', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    test('should generate an ID that is a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    test('should generate an ID with a specific format (contains underscore)', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+_[a-z0-9]+$/);
    });
  });

  describe('saveTasks', () => {
    test('should save tasks to localStorage as JSON string', () => {
      const mockTasks: Task[] = [
        { id: '1', title: 'Test Task 1', createdAt: new Date().toISOString(), status: 'todo', priority: 'medium' },
      ];
      const setItemSpy = jest.spyOn(localStorage, 'setItem');

      saveTasks(mockTasks);

      expect(setItemSpy).toHaveBeenCalledWith('kanban_tasks_v1', JSON.stringify(mockTasks));
    });
  });

  describe('loadTasks', () => {
    test('should return an empty array if localStorage is empty', () => {
      expect(loadTasks()).toEqual([]);
    });

    test('should return an empty array if localStorage contains invalid JSON', () => {
      localStorage.setItem('kanban_tasks_v1', 'not a valid json');
      expect(loadTasks()).toEqual([]);
    });

    test('should return an empty array if localStorage contains an array with invalid task structure', () => {
      localStorage.setItem('kanban_tasks_v1', JSON.stringify([{ id: '1', title: 'invalid' }]));
      expect(loadTasks()).toEqual([]);
    });

    test('should correctly load valid tasks', () => {
      const mockTasks: Task[] = [
        { id: '1', title: 'Task Todo', createdAt: new Date().toISOString(), status: 'todo', priority: 'low' },
        { id: '2', title: 'Task Wip', createdAt: new Date().toISOString(), status: 'wip', priority: 'medium' },
        { id: '3', title: 'Task Test', createdAt: new Date().toISOString(), status: 'test', priority: 'high' },
        { id: '4', title: 'Task Done', createdAt: new Date().toISOString(), status: 'done', priority: 'low' },
      ];
      localStorage.setItem('kanban_tasks_v1', JSON.stringify(mockTasks));

      expect(loadTasks()).toEqual(mockTasks);
    });

    test('should filter out tasks with invalid status but keep valid ones', () => {
      const validTask: Task = { id: '1', title: 'Valid Task', createdAt: new Date().toISOString(), status: 'todo', priority: 'medium' };
      const invalidTask = { id: '2', title: 'Invalid Status Task', createdAt: new Date().toISOString(), status: 'invalid-status', priority: 'low' }; // Malformed status
      const mixedTasks = [validTask, invalidTask];

      localStorage.setItem('kanban_tasks_v1', JSON.stringify(mixedTasks));
      expect(loadTasks()).toEqual([validTask]);
    });
  });
});
