document.addEventListener('DOMContentLoaded', () => {
    // DOM元素
    const tableBody = document.getElementById('tableBody')
    const addBtn = document.getElementById('addBtn')
    const importBtn = document.getElementById('importBtn')
    const exportBtn = document.getElementById('exportBtn')
    const searchInput = document.getElementById('searchInput')
    const filterSelect = document.getElementById('filterSelect')
    const modal = document.getElementById('modal')
    const closeBtn = document.querySelector('.close-btn')
    const modalTitle = document.getElementById('modalTitle')
    const dataForm = document.getElementById('dataForm')
    const saveBtn = document.getElementById('saveBtn')
    
    // 表单字段
    const itemId = document.getElementById('itemId')
    const itemName = document.getElementById('itemName')
    const itemCategory = document.getElementById('itemCategory')
    const itemPrice = document.getElementById('itemPrice')
    const itemStock = document.getElementById('itemStock')
    const itemDescription = document.getElementById('itemDescription')
    
    // 当前操作模式 ('add' 或 'edit')
    let currentMode = 'add'
    
    // 初始化应用
    initApp()
    
    // 初始化应用
    async function initApp() {
      // 加载并显示数据
      await loadData()
      
      // 绑定事件
      addBtn.addEventListener('click', () => {
        currentMode = 'add'
        modalTitle.textContent = '添加新数据'
        dataForm.reset()
        itemId.value = ''
        modal.style.display = 'flex'
      })
      
      importBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.importData()
        if (result) {
          await loadData()
          showAlert('数据导入成功!', 'success')
        }
      })
      
      exportBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.exportData()
        if (result) {
          showAlert('数据导出成功!', 'success')
        }
      })
      
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none'
      })
      
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none'
        }
      })
      
      dataForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        await saveData()
      })
      
      searchInput.addEventListener('input', () => {
        filterData()
      })
      
      filterSelect.addEventListener('change', () => {
        filterData()
      })
    }
    
    // 加载数据
    async function loadData() {
      const data = await window.electronAPI.getData()
      renderTable(data)
    }
    
    // 渲染表格
    function renderTable(data) {
      tableBody.innerHTML = ''
      
      if (data.length === 0) {
        const row = document.createElement('tr')
        row.innerHTML = `
          <td colspan="6" class="empty-message">没有数据，请点击"添加数据"按钮添加</td>
        `
        tableBody.appendChild(row)
        return
      }
      
      data.forEach(item => {
        const row = document.createElement('tr')
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>¥${item.price.toFixed(2)}</td>
          <td>${item.stock}</td>
          <td>
            <button class="action-btn edit-btn" data-id="${item.id}">编辑</button>
            <button class="action-btn delete-btn" data-id="${item.id}">删除</button>
          </td>
        `
        tableBody.appendChild(row)
      })
      
      // 绑定编辑和删除按钮事件
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id
          await editItem(id)
        })
      })
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id
          await deleteItem(id)
        })
      })
    }
    
    // 编辑项目
    async function editItem(id) {
      const data = await window.electronAPI.getData()
      const item = data.find(i => i.id === id)
      
      if (item) {
        currentMode = 'edit'
        modalTitle.textContent = '编辑数据'
        
        // 填充表单
        itemId.value = item.id
        itemName.value = item.name
        itemCategory.value = item.category
        itemPrice.value = item.price
        itemStock.value = item.stock
        itemDescription.value = item.description || ''
        
        modal.style.display = 'flex'
      }
    }
    
    // 删除项目
    async function deleteItem(id) {
      const confirmDelete = confirm('确定要删除这条数据吗?')
      if (confirmDelete) {
        const success = await window.electronAPI.deleteItem(id)
        if (success) {
          await loadData()
          showAlert('数据删除成功!', 'success')
        } else {
          showAlert('删除失败!', 'error')
        }
      }
    }
    
    // 保存数据
    async function saveData() {
      const item = {
        id: itemId.value,
        name: itemName.value,
        category: itemCategory.value,
        price: parseFloat(itemPrice.value),
        stock: parseInt(itemStock.value),
        description: itemDescription.value
      }
      
      let success = false
      
      if (currentMode === 'add') {
        const newItem = await window.electronAPI.addItem(item)
        if (newItem) {
          success = true
        }
      } else {
        success = await window.electronAPI.updateItem(item)
      }
      
      if (success) {
        modal.style.display = 'none'
        await loadData()
        showAlert(`数据${currentMode === 'add' ? '添加' : '更新'}成功!`, 'success')
      } else {
        showAlert('操作失败!', 'error')
      }
    }
    
    // 筛选数据
    async function filterData() {
      const searchTerm = searchInput.value.toLowerCase()
      const filterType = filterSelect.value
      const data = await window.electronAPI.getData()
      
      if (!searchTerm) {
        renderTable(data)
        return
      }
      
      const filteredData = data.filter(item => {
        if (filterType === 'all') {
          return (
            item.name.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.id.toLowerCase().includes(searchTerm) ||
            item.price.toString().includes(searchTerm) ||
            item.stock.toString().includes(searchTerm))
        } else if (filterType === 'name') {
          return item.name.toLowerCase().includes(searchTerm)
        } else if (filterType === 'category') {
          return item.category.toLowerCase().includes(searchTerm)
        }
        return true
      })
      
      renderTable(filteredData)
    }
    
    // 显示提示消息
    function showAlert(message, type) {
      const alert = document.createElement('div')
      alert.className = `alert alert-${type}`
      alert.textContent = message
      
      document.body.appendChild(alert)
      
      setTimeout(() => {
        alert.remove()
      }, 3000)
    }
  })