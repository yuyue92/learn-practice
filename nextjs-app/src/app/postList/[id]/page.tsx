"use client"
// import { useRouter } from "next/navigation"
// export default function PotsDetail( { params }: { params: { id: string } } ) {
//     // const { id } = params; 
//     const id = params.id;
//     console.log('__id__: ', id)
//     const route = useRouter();
//     console.log('route__: ', route)
//     return (
//         <div className="post_detail">
//             <h1>PotsDetail {id}</h1>
//         </div>
//     )
// }

// app/projects/[id]/ClientComponent.tsx
'use client';

import { useParams } from 'next/navigation';

export default function ClientComponent() {
  const { id } = useParams(); // 客户端获取参数
  
  return <div>客户端获取的ID: {id}</div>;
}