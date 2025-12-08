
const { create } = require("zustand");
interface User {
    id: string
    name: string
    role: string
}
export const useUserInfoStore = create((set, get) => ({
    loginStatus: false,
    toggleLoginStatus: (statusFlag: boolean) => set({ loginStatus: statusFlag }),

    userList: [
        { id: '76d35677-e45f-42a4-8b6a-68019fa0afdc', name: 'Alice', role: 'Admin' },
        { id: 'aa3cfeeb-aed9-439c-b0f2-520f08e91a14', name: 'Bob', role: 'Editor' },
        { id: '111a3aff-65db-490a-a157-5fe79c15869e', name: 'Cara', role: 'Viewer' }
    ],
    addOnUser: () => {
        set((state: any) => ({
            // 写法1：使用函数式更新（推荐）
            userList: [
                ...state.userList,
                { id: crypto.randomUUID(), name: `User_${state.userList.length + 1}`, role: 'Viewer' }
            ]
        }))
    },
    getAllUser: () => get().userList,
    deleteUser: (id: string) => set((state: any) => ({
        userList: state.userList.filter(v => v.id !== id)
    }))
}))