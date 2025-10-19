"use client"
import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import LoadingSpinner from '../LoadingSpinner';
LoadingSpinner

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

const API_BASE = '/api' // 使用 Next 重写代理，避免 CORS / 环境切换

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
        ...init,
    })
    const text = await res.text()
    const data = text ? JSON.parse(text) : null
    if (!res.ok) {
        const msg = (data && (data.detail || data.message || data.error)) || res.statusText
        throw new Error(msg)
    }
    return data as T
}

async function listTasks(): Promise<Task[]> {
    return request<Task[]>(`/tasks`)
}

async function createTask(body: { text: string; completed: boolean }): Promise<Task> {
    return request<Task>(`/tasks`, { method: 'POST', body: JSON.stringify(body) })
}

async function updateTaskPut(id: string, body: { text: string; completed: boolean }): Promise<Task> {
    return request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

async function deleteTaskApi(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
}

export default function InteractiveTaskList() {
    const [isLoading, setIsLoading] = useState(false);
    const [tasklist, setTasklist] = useState<Task[]>([
        // {id: '12121', text: 'eattt', completed: false},
        // {id: '12122', text: 'sleep', completed: false},
        // {id: '12123', text: 'walk', completed: false},
    ]);
    const loadTasklist = async () => {
        setIsLoading(true);
        try {
            const res = await listTasks()
            setTasklist(res)
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        loadTasklist()
    }, [])
    const [inputValue, setInputValue] = useState('');
    const addTask = async () => {
        if (inputValue.trim()) {
            setIsLoading(true);
            await createTask({ text: inputValue, completed: false })
            await loadTasklist()
        }
    }
    const deleteTask = async (id: string) => {
        setIsLoading(true);
        await deleteTaskApi(id)
        await loadTasklist()
    }
    const toggleTask = async (ctask: Task) => {
        setIsLoading(true);
        await updateTaskPut(ctask.id, { text: ctask.text, completed: !ctask.completed })
        await loadTasklist()
    };
    return (
        <div className={styles.contentWrapper}>
            <div className={styles.inputWrapper}>
                <span className='px-2'>待办事项</span>
                <input type="text" value={inputValue} className="border rounded p-1 m-1 w-[400px] mb-2"
                    placeholder="Add a new task" onChange={(e) => setInputValue(e.target.value)} />
                <button className="bg-blue-500 text-white w-[200px] p-1  hover:bg-blue-700" onClick={addTask}>Add</button>
            </div>
            {isLoading ? (<LoadingSpinner />) :
                (<ul className={styles.taskwrapper}>
                    {tasklist.map(task => (
                        <li key={task.id} className={`${task.completed ? styles.doned : ''}`}>
                            <input type="checkbox" checked={task.completed} onChange={e => toggleTask(task)} id={task.id} />
                            <label className={styles.showTxt} htmlFor={task.id}>{task.text}</label>
                            <button className="p-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => deleteTask(task.id)}>Delete</button>
                        </li>
                    ))}
                </ul>)
            }
        </div>
    )
}