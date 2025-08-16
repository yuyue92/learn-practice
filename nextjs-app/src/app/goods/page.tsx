import styles from './styles.module.css'

interface Item {
    id: number;
    name: string;
    price: number;
}
const items: Item[] = [
    { id: 1, name: 'Apple', price: 1.99 },
    { id: 2, name: 'Banana', price: 0.99 },
    { id: 3, name: 'Orange', price: 2.49 },
];
export default function Goods() {
    const arrlist1 = [1,2,3,4,5,6,7,8,9]
    return (
        <div className='p-2 m-2'>
            <h2 className="text-center p-2 m-2">商品列表</h2>
            <ul className="divide-y divide-gray-200 max-w-md mx-auto bg-white shadow rounded">
                {items.map((item) => (
                    <li key={item.id} className="px-4 py-2 hover:bg-gray-50">
                        <div className="goodItem">
                            <span>{item.name}</span> | 
                            <span>${item.price.toFixed(2)}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}