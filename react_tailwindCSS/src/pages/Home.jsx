import { produce } from "immer";
import { useState } from "react"
import TodoApp from "./TodoApp";

export default function Home() {
    const [user, setUser] = useState({name:'zhangsan', age: 33, state: 'a'});
    // 在useSate里面直接修改对象
    const growUp = ()=>{
        setUser(produce(user, temp => {
            temp.age +=1
        }))
    }
    const toggleState = () => {
        setUser(produce(user, deaft => {
            if(deaft.state === 'c') deaft.state = 'd'
            if(deaft.state === 'b') deaft.state = 'c'
            if(deaft.state === 'a') deaft.state = 'b'
        }))
    }
    const [arr1, setArr1] = useState(
        [{id: 0, name:'zssss'}, {id: 1, name:'sssa'}]
    )
    const addArr =()=>{
        setArr1(produce(arr1, deaft => {
            deaft.push({id: arr1.length, name: Date.now() })
        }))
    }
    const setArray1 = ()=>{
        setArr1(produce(arr1, draft => {
            draft[0].name= `yy_${arr1.length}`
        }))
    }
    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <h1 className="text-2xl font-semibold">Home</h1>
            <div className="rounded-lg border bg-white p-4">
                {user.name}: {user.age}
                <button onClick={growUp} className="border rounded p-2 m-3 bg-slate-200">age+1</button>
                <button onClick={toggleState} className="border rounded p-2 m-3 bg-slate-200">toggle_State</button>
                ustate: {user.state}
            </div>
            <div className="rounded-lg border bg-white p-4">
                <button onClick={addArr} className="border rounded p-2 m-3 bg-slate-200">add_arr</button>
                <button onClick={setArray1} className="border rounded p-2 m-3 bg-slate-200">set_arr</button>
                {JSON.stringify(arr1)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-white p-4">区块 A</div>
                <div className="rounded-lg border bg-white p-4">区块 B</div>
            </div>
            {/* 制造一点高度，方便看出主区域滚动条 */}
            <div className="rounded-lg border bg-white p-4">
                <TodoApp/>
            </div>
        </div>
    )
}