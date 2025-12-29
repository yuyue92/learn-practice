/**
 * JavaScript 算法与数据结构完整实现指南
 * 包含详细讲解和时间复杂度分析
 */

// ============================================================================
// 第一部分: 基础数据结构
// ============================================================================

// 1. 链表 (Linked List)
// ----------------------------------------------------------------------------
class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    /**
     * 单向链表实现
     * 特点: 动态大小，插入删除O(1)，查找O(n)
     */
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    append(data) {
        // 在末尾添加节点 - O(n)
        const newNode = new ListNode(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    prepend(data) {
        // 在开头添加节点 - O(1)
        const newNode = new ListNode(data);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    
    delete(data) {
        // 删除指定值的节点 - O(n)
        if (!this.head) return;
        
        if (this.head.data === data) {
            this.head = this.head.next;
            this.size--;
            return;
        }
        
        let current = this.head;
        while (current.next) {
            if (current.next.data === data) {
                current.next = current.next.next;
                this.size--;
                return;
            }
            current = current.next;
        }
    }
    
    find(data) {
        // 查找节点 - O(n)
        let current = this.head;
        while (current) {
            if (current.data === data) return current;
            current = current.next;
        }
        return null;
    }
    
    display() {
        // 显示链表
        const elements = [];
        let current = this.head;
        while (current) {
            elements.push(current.data);
            current = current.next;
        }
        return elements.join(' -> ');
    }
    
    reverse() {
        // 反转链表 - O(n)
        let prev = null;
        let current = this.head;
        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        this.head = prev;
    }
}


// 2. 双向链表 (Doubly Linked List)
// ----------------------------------------------------------------------------
class DoublyListNode {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList {
    /**
     * 双向链表
     * 优势: 可以双向遍历
     */
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    append(data) {
        const newNode = new DoublyListNode(data);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }
    
    prepend(data) {
        const newNode = new DoublyListNode(data);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.size++;
    }
}


// 3. 栈 (Stack)
// ----------------------------------------------------------------------------
class Stack {
    /**
     * 栈实现 - LIFO (后进先出)
     * 应用: 函数调用栈、括号匹配、深度优先搜索
     * 所有操作: O(1)
     */
    constructor() {
        this.items = [];
    }
    
    push(element) {
        // 入栈
        this.items.push(element);
    }
    
    pop() {
        // 出栈
        if (this.isEmpty()) return null;
        return this.items.pop();
    }
    
    peek() {
        // 查看栈顶元素
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    clear() {
        this.items = [];
    }
}


// 4. 队列 (Queue)
// ----------------------------------------------------------------------------
class Queue {
    /**
     * 队列实现 - FIFO (先进先出)
     * 应用: 广度优先搜索、任务调度、缓冲区
     * 所有操作: O(1)
     */
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        // 入队
        this.items.push(element);
    }
    
    dequeue() {
        // 出队
        if (this.isEmpty()) return null;
        return this.items.shift();
    }
    
    front() {
        // 查看队首元素
        if (this.isEmpty()) return null;
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}


// 5. 优先队列 (Priority Queue)
// ----------------------------------------------------------------------------
class PriorityQueue {
    /**
     * 优先队列 - 使用最小堆实现
     * 时间复杂度: 插入O(log n), 删除O(log n)
     */
    constructor() {
        this.heap = [];
    }
    
    enqueue(value, priority) {
        this.heap.push({ value, priority });
        this.bubbleUp(this.heap.length - 1);
    }
    
    dequeue() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }
    
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority >= this.heap[parentIndex].priority) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }
    
    bubbleDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.heap.length && 
                this.heap[leftChild].priority < this.heap[minIndex].priority) {
                minIndex = leftChild;
            }
            
            if (rightChild < this.heap.length && 
                this.heap[rightChild].priority < this.heap[minIndex].priority) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            
            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
}


// 6. 二叉树 (Binary Tree)
// ----------------------------------------------------------------------------
class TreeNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinaryTree {
    /**
     * 二叉树实现
     * 包含三种遍历方式
     */
    constructor() {
        this.root = null;
    }
    
    inorderTraversal(node = this.root, result = []) {
        /**
         * 中序遍历: 左 -> 根 -> 右
         * 对于二叉搜索树，结果是有序的
         * 时间复杂度: O(n)
         */
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.data);
            this.inorderTraversal(node.right, result);
        }
        return result;
    }
    
    preorderTraversal(node = this.root, result = []) {
        /**
         * 前序遍历: 根 -> 左 -> 右
         * 用于复制树结构
         * 时间复杂度: O(n)
         */
        if (node) {
            result.push(node.data);
            this.preorderTraversal(node.left, result);
            this.preorderTraversal(node.right, result);
        }
        return result;
    }
    
    postorderTraversal(node = this.root, result = []) {
        /**
         * 后序遍历: 左 -> 右 -> 根
         * 用于删除树
         * 时间复杂度: O(n)
         */
        if (node) {
            this.postorderTraversal(node.left, result);
            this.postorderTraversal(node.right, result);
            result.push(node.data);
        }
        return result;
    }
    
    levelOrderTraversal() {
        /**
         * 层序遍历 (广度优先)
         * 使用队列实现
         * 时间复杂度: O(n)
         */
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node.data);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        return result;
    }
    
    height(node = this.root) {
        // 计算树的高度 - O(n)
        if (!node) return 0;
        return 1 + Math.max(this.height(node.left), this.height(node.right));
    }
}


// 7. 二叉搜索树 (Binary Search Tree)
// ----------------------------------------------------------------------------
class BST {
    /**
     * 二叉搜索树: 左子树 < 根 < 右子树
     * 查找、插入、删除平均: O(log n)
     * 最坏情况(退化成链表): O(n)
     */
    constructor() {
        this.root = null;
    }
    
    insert(data) {
        // 插入节点
        const newNode = new TreeNode(data);
        if (!this.root) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }
    
    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
    
    search(data) {
        // 搜索节点
        return this.searchNode(this.root, data);
    }
    
    searchNode(node, data) {
        if (!node) return null;
        
        if (data < node.data) {
            return this.searchNode(node.left, data);
        } else if (data > node.data) {
            return this.searchNode(node.right, data);
        } else {
            return node;
        }
    }
    
    findMin(node = this.root) {
        // 找到最小值节点
        if (!node) return null;
        while (node.left) {
            node = node.left;
        }
        return node;
    }
    
    findMax(node = this.root) {
        // 找到最大值节点
        if (!node) return null;
        while (node.right) {
            node = node.right;
        }
        return node;
    }
    
    delete(data) {
        // 删除节点
        this.root = this.deleteNode(this.root, data);
    }
    
    deleteNode(node, data) {
        if (!node) return null;
        
        if (data < node.data) {
            node.left = this.deleteNode(node.left, data);
        } else if (data > node.data) {
            node.right = this.deleteNode(node.right, data);
        } else {
            // 找到要删除的节点
            if (!node.left && !node.right) {
                return null;
            }
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            
            // 有两个子节点：找右子树的最小值
            const temp = this.findMin(node.right);
            node.data = temp.data;
            node.right = this.deleteNode(node.right, temp.data);
        }
        
        return node;
    }
}


// 8. AVL树 (自平衡二叉搜索树)
// ----------------------------------------------------------------------------
class AVLNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    /**
     * AVL树 - 自平衡二叉搜索树
     * 所有操作: O(log n) - 保证平衡
     * 应用: 需要频繁查找和保持平衡的场景
     */
    constructor() {
        this.root = null;
    }
    
    height(node) {
        return node ? node.height : 0;
    }
    
    updateHeight(node) {
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    }
    
    getBalance(node) {
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }
    
    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;
        
        x.right = y;
        y.left = T2;
        
        this.updateHeight(y);
        this.updateHeight(x);
        
        return x;
    }
    
    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;
        
        y.left = x;
        x.right = T2;
        
        this.updateHeight(x);
        this.updateHeight(y);
        
        return y;
    }
    
    insert(data) {
        this.root = this.insertNode(this.root, data);
    }
    
    insertNode(node, data) {
        if (!node) return new AVLNode(data);
        
        if (data < node.data) {
            node.left = this.insertNode(node.left, data);
        } else if (data > node.data) {
            node.right = this.insertNode(node.right, data);
        } else {
            return node;
        }
        
        this.updateHeight(node);
        const balance = this.getBalance(node);
        
        // Left Left
        if (balance > 1 && data < node.left.data) {
            return this.rotateRight(node);
        }
        
        // Right Right
        if (balance < -1 && data > node.right.data) {
            return this.rotateLeft(node);
        }
        
        // Left Right
        if (balance > 1 && data > node.left.data) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        
        // Right Left
        if (balance < -1 && data < node.right.data) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }
        
        return node;
    }
}


// 9. 堆 (Heap)
// ----------------------------------------------------------------------------
class MinHeap {
    /**
     * 最小堆实现
     * 父节点总是小于子节点
     * 插入、删除: O(log n)
     * 查找最小值: O(1)
     * 应用: 优先队列、堆排序、Top K问题
     */
    constructor() {
        this.heap = [];
    }
    
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }
    
    getLeftChildIndex(i) {
        return 2 * i + 1;
    }
    
    getRightChildIndex(i) {
        return 2 * i + 2;
    }
    
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    insert(value) {
        // 插入元素
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
    }
    
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            if (this.heap[index] >= this.heap[parentIndex]) break;
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }
    
    extractMin() {
        // 提取最小元素
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }
    
    heapifyDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = this.getLeftChildIndex(index);
            const rightChild = this.getRightChildIndex(index);
            
            if (leftChild < this.heap.length && this.heap[leftChild] < this.heap[minIndex]) {
                minIndex = leftChild;
            }
            
            if (rightChild < this.heap.length && this.heap[rightChild] < this.heap[minIndex]) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            
            this.swap(index, minIndex);
            index = minIndex;
        }
    }
    
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }
    
    size() {
        return this.heap.length;
    }
}


// 10. 哈希表 (Hash Table)
// ----------------------------------------------------------------------------
class HashTable {
    /**
     * 哈希表实现 - 使用链地址法处理冲突
     * 平均情况: 查找、插入、删除 O(1)
     * 最坏情况: O(n)
     */
    constructor(size = 53) {
        this.keyMap = new Array(size);
    }
    
    _hash(key) {
        // 哈希函数
        let total = 0;
        const WEIRD_PRIME = 31;
        for (let i = 0; i < Math.min(key.length, 100); i++) {
            const char = key[i];
            const value = char.charCodeAt(0) - 96;
            total = (total * WEIRD_PRIME + value) % this.keyMap.length;
        }
        return total;
    }
    
    set(key, value) {
        // 设置键值对
        const index = this._hash(key);
        if (!this.keyMap[index]) {
            this.keyMap[index] = [];
        }
        
        // 检查是否已存在
        for (let i = 0; i < this.keyMap[index].length; i++) {
            if (this.keyMap[index][i][0] === key) {
                this.keyMap[index][i][1] = value;
                return;
            }
        }
        
        this.keyMap[index].push([key, value]);
    }
    
    get(key) {
        // 获取值
        const index = this._hash(key);
        if (this.keyMap[index]) {
            for (let pair of this.keyMap[index]) {
                if (pair[0] === key) return pair[1];
            }
        }
        return undefined;
    }
    
    delete(key) {
        // 删除键值对
        const index = this._hash(key);
        if (this.keyMap[index]) {
            for (let i = 0; i < this.keyMap[index].length; i++) {
                if (this.keyMap[index][i][0] === key) {
                    this.keyMap[index].splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }
    
    keys() {
        // 获取所有键
        const keysArr = [];
        for (let bucket of this.keyMap) {
            if (bucket) {
                for (let pair of bucket) {
                    keysArr.push(pair[0]);
                }
            }
        }
        return keysArr;
    }
    
    values() {
        // 获取所有值
        const valuesArr = [];
        for (let bucket of this.keyMap) {
            if (bucket) {
                for (let pair of bucket) {
                    if (!valuesArr.includes(pair[1])) {
                        valuesArr.push(pair[1]);
                    }
                }
            }
        }
        return valuesArr;
    }
}


// 11. 图 (Graph)
// ----------------------------------------------------------------------------
class Graph {
    /**
     * 图的邻接表实现
     * 支持有向图和无向图
     */
    constructor(directed = false) {
        this.adjacencyList = new Map();
        this.directed = directed;
    }
    
    addVertex(vertex) {
        // 添加顶点
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    
    addEdge(vertex1, vertex2, weight = 1) {
        // 添加边
        if (!this.adjacencyList.has(vertex1)) {
            this.addVertex(vertex1);
        }
        if (!this.adjacencyList.has(vertex2)) {
            this.addVertex(vertex2);
        }
        
        this.adjacencyList.get(vertex1).push({ node: vertex2, weight });
        
        if (!this.directed) {
            this.adjacencyList.get(vertex2).push({ node: vertex1, weight });
        }
    }
    
    removeEdge(vertex1, vertex2) {
        // 删除边
        if (this.adjacencyList.has(vertex1)) {
            this.adjacencyList.set(
                vertex1,
                this.adjacencyList.get(vertex1).filter(v => v.node !== vertex2)
            );
        }
        
        if (!this.directed && this.adjacencyList.has(vertex2)) {
            this.adjacencyList.set(
                vertex2,
                this.adjacencyList.get(vertex2).filter(v => v.node !== vertex1)
            );
        }
    }
    
    removeVertex(vertex) {
        // 删除顶点
        if (!this.adjacencyList.has(vertex)) return;
        
        // 删除所有相关的边
        for (let adjacentVertex of this.adjacencyList.get(vertex)) {
            this.removeEdge(vertex, adjacentVertex.node);
        }
        
        this.adjacencyList.delete(vertex);
    }
    
    getVertices() {
        return Array.from(this.adjacencyList.keys());
    }
    
    getEdges() {
        const edges = [];
        for (let [vertex, neighbors] of this.adjacencyList) {
            for (let neighbor of neighbors) {
                edges.push([vertex, neighbor.node, neighbor.weight]);
            }
        }
        return edges;
    }
}


// 12. Trie (前缀树)
// ----------------------------------------------------------------------------
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    /**
     * 前缀树/字典树
     * 插入、搜索: O(m), m是字符串长度
     * 应用: 自动补全、拼写检查、IP路由
     */
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        // 插入单词
        let node = this.root;
        for (let char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
    }
    
    search(word) {
        // 搜索完整单词
        let node = this.root;
        for (let char of word) {
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char);
        }
        return node.isEndOfWord;
    }
    
    startsWith(prefix) {
        // 搜索前缀
        let node = this.root;
        for (let char of prefix) {
            if (!node.children.has(char)) {
                return false;
            }
            node = node.children.get(char);
        }
        return true;
    }
    
    delete(word) {
        // 删除单词
        const deleteHelper = (node, word, index) => {
            if (index === word.length) {
                if (!node.isEndOfWord) return false;
                node.isEndOfWord = false;
                return node.children.size === 0;
            }
            
            const char = word[index];
            const childNode = node.children.get(char);
            
            if (!childNode) return false;
            
            const shouldDeleteChild = deleteHelper(childNode, word, index + 1);
            
            if (shouldDeleteChild) {
                node.children.delete(char);
                return node.children.size === 0 && !node.isEndOfWord;
            }
            
            return false;
        };
        
        deleteHelper(this.root, word, 0);
    }
}


// ============================================================================
// 第二部分: 排序算法
// ============================================================================

class SortingAlgorithms {
    /**
     * 冒泡排序
     * 时间复杂度: O(n²) - 最好O(n), 最坏O(n²)
     * 空间复杂度: O(1)
     * 稳定性: 稳定
     * 原理: 相邻元素两两比较，大的往后移
     */
    static bubbleSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;
                }
            }
            if (!swapped) break; // 优化：如果没有交换，说明已经有序
        }
        return arr;
    }
    
    /**
     * 选择排序
     * 时间复杂度: O(n²)
     * 空间复杂度: O(1)
     * 稳定性: 不稳定
     * 原理: 每次选择最小的元素放到前面
     */
    static selectionSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            }
        }
        return arr;
    }
    
    /**
     * 插入排序
     * 时间复杂度: O(n²) - 最好O(n), 最坏O(n²)
     * 空间复杂度: O(1)
     * 稳定性: 稳定
     * 原理: 像打扑克牌一样，将每个元素插入到已排序部分的正确位置
     * 适用: 小规模数据或基本有序的数据
     */
    static insertionSort(arr) {
        for (let i = 1; i < arr.length; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[