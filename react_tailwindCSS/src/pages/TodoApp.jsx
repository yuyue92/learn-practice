import { produce } from "immer"
import { useState } from "react"

export default function TodoApp() {
    const [ctodo, setctodo] = useState('')
    const [todoList, settodoList] = useState([
        { id: 0, text: 'eat', done: true },
        { id: 1, text: 'wash', done: true },
        { id: 2, text: 'sleep', done: false },
    ])
    const addNew = () => {
        if (ctodo === '') return
        settodoList(produce(todoList, temp => {
            temp.push({ id: todoList.length, text: ctodo, done: false })
        }))
    }
    const toggleOne = (evt, item) => {
        settodoList(produce(todoList, temp =>{
            const citem = temp.find(v=> v.id === item.id)
            if(citem) {
                citem.done = evt.target.checked
            }
        }))
    }
    return (
        <div>s
            <p className="border-b-2 p-2 m-2">
                <input type="text" value={ctodo} onChange={e => setctodo(e.target.value)} className="border rounded-sm p-1 m-2 w-24" />
                <button onClick={addNew} className="border rounded p-1 m-1 bg-gray-100">Add</button>
                <button className="border rounded p-1 m-1 bg-gray-100">FilterList</button>
                <button onClick={()=>{console.table( todoList) }} className="border rounded p-1 m-1 bg-gray-100">printList</button>
            </p>
            <ul className="border rounded-sm p-2 m-3">
                {todoList.map(t => (
                    <li key={t.id}>
                        <label><input type="checkbox" checked={t.done} onChange={e => toggleOne(e, t)} className="m-2" />{t.text}</label>
                    </li>
                ))}
            </ul>
        </div>
    )
}