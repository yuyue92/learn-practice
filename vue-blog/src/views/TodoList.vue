<template>
    <div class="todo-app">
        <h1>Todo List</h1>
        <!-- 添加新任务 -->
         <div class="add-todo">
            <input type="text" v-model="newTodoText" class="todo-input" @keyup.enter="addTodo">
            <button class="add-button" @click="addTodo">Add</button>
         </div>
         <!-- 过滤选项 -->
          <div class="filters">
            <button v-for="filter in filters" :key="filter" @click="currentFilter = filter"
             :class="{active: currentFilter === filter}">{{ filter }}</button>
          </div>
          <!-- Todo列表 -->
           <transition-group name="fade" tag="ul" class="todo-list">
             <!-- <ul class="todo-list"> -->
              <li v-for="todo in filteredTodos" :key="todo.id" :class="{completed: todo.completed}">
                  <input type="checkbox" v-model="todo.completed" class="todo-checkbox" @change="toggleTodo(todo.id)" :name="todo.text"/>
                  <span class="todo-text">{{ todo.text }}</span>
                  <button class="delete-button" @click="deleteTodo(todo.id)">x</button>
              </li>
             <!-- </ul> -->
           </transition-group>
           <!-- 统计信息 -->
           <div class="stats">
                <span>{{ activeTodosCount }} items left</span>
                <button v-if="completedTodosCount > 0" @click="clearCompleted" class="save-button">
                  Clear completed ({{ completedTodosCount }})
                </button>
                <!-- <button @click="saveTodos" class="asve-button">
                  本地保存
                </button> -->
            </div>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue';

// 首先创建一个文件定义类型
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}
type FilterType = 'all' | 'active' | 'completed';

export default defineComponent({
    name:'TodoApp',
    setup() {
        // 状态管理
        const todos = ref<Todo[]>([
            // {id:1, text:'洗脸', completed: false },
            // {id:2, text:'刷牙', completed: false },
            // {id:3, text:'吃饭饭', completed: false },
            // {id:4, text:'去打球', completed: false },
            // {id:5, text:'锻炼健身', completed: false },
            // {id:6, text:'约人见面', completed: false },
        ]);
        
        const newTodoText = ref('');
        const currentFilter = ref<FilterType>('all');
        const filters: FilterType [] = ['all' , 'active' , 'completed'];
        // 计算属性
        const filteredTodos = computed(()=>{
            switch(currentFilter.value) {
                case 'active':
                    return todos.value.filter(c=> !c.completed)
                case 'completed':
                    return todos.value.filter(c=> c.completed)
                default:
                    return todos.value
            }
        });
        //未完成事项的长度计数
        const activeTodosCount = computed(()=>{
            return todos.value.filter(c=> !c.completed).length
        });
        //已完成的长度计数
        const completedTodosCount  = computed(()=>{
            return todos.value.filter(c=> c.completed).length
        });
        // 新增事项的方法
        const addTodo = ()=>{
            if (newTodoText.value.trim() ==='') return;
            const newTodo: Todo = {
                id: Date.now(),
                text: newTodoText.value.trim(),
                completed: false,
            };
            todos.value.push(newTodo);
            newTodoText.value = '';
            saveTodos()
        };
        const deleteTodo = (id: number) =>{
          todos.value = todos.value.filter(c => c.id !== id);
          saveTodos()
        };
        const clearCompleted = ()=>{
          todos.value = todos.value.filter(c=> !c.completed)
        }
        //从本地localStorage加载数据
        const loadTodos = ()=>{
          const saved = localStorage.getItem('todos');
          if (saved) {
            todos.value = JSON.parse(saved)
          }
        }
        loadTodos();    //初始化加载本地数据
        //保存到本地localStorage
        const saveTodos = ()=>{
          localStorage.setItem('todos', JSON.stringify(todos.value))
        }
        const toggleTodo = (id: number) =>{
          const ctodo = todos.value.find(c=>c.id === id);
          console.log('ttt: ',ctodo )
          saveTodos();
        };
        return {
            todos,
            newTodoText,
            currentFilter,
            filters,
            filteredTodos,
            activeTodosCount,
            completedTodosCount,
            addTodo,
            deleteTodo,
            toggleTodo,
            clearCompleted,
            saveTodos,
            loadTodos
        }
    }
})
</script>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.add-todo {
  display: flex;
  margin-bottom: 20px;
}

.todo-input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.add-button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.add-button:hover {
  background-color: #369f6e;
}

.filters {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.filters button {
  padding: 5px 10px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
.save-button {
  padding: 5px 10px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.filters button.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-list li.completed .todo-text {
  text-decoration: line-through;
  color: #888;
}
.todo-checkbox {
    margin-right: 10px;
}

.todo-text {
    flex-grow: 1;
}

.delete-button {
  background: none;
  border: none;
  color: #ff5a5a;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}

.delete-button:hover {
  color: #ff0000;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  color: #666;
}

.clear-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.clear-button:hover {
  color: #333;
  text-decoration: underline;
}
/* 添加动画效果的样式 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-leave-active {
  position: absolute;
}
</style>