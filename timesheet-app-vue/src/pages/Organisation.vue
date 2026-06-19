<template>
  <AppShell>
    <PageHead
      title="Organisation & User Management"
      desc="Manage organisation units, reporting lines and system access."
    >
      <template #actions>
        <button class="btn primary">+ Add Employee</button>
      </template>
    </PageHead>

    <div class="split">
      <!-- 左：组织树 -->
      <div class="tree">
        <h3>Organisation Tree</h3>
        <ul class="tree-root">
          <TreeNode
            v-for="node in ORG_TREE"
            :key="node.id"
            :node="node"
            :selected-id="selectedNode?.id"
            :default-open="true"
            @select="selectedNode = $event"
          />
        </ul>
        <div class="sponsor-note">
          点击节点展开 / 收起，点击叶节点筛选右侧员工表。
        </div>
      </div>

      <!-- 右：员工表 + 详情 -->
      <div>
        <div class="card">
          <div style="display: flex; align-items: center">
            <div>
              <h3 style="margin: 0">Employees</h3>
              <div class="hint">Department: {{ selectedNode?.label ?? 'All' }}</div>
            </div>
            <div class="spacer" />
            <input
              class="input"
              style="width: 240px"
              placeholder="Search employee..."
              v-model="search"
            />
          </div>
          <br />
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Supervisor</th>
                <th>Second-level</th>
                <th>Roles</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(e, i) in filteredEmployees"
                :key="i"
                style="cursor: pointer"
                :style="{ background: selectedEmployee?.name === e.name ? '#f0f7ff' : undefined }"
                @click="selectedEmployee = e"
              >
                <td>{{ e.name }}</td>
                <td>{{ e.email }}</td>
                <td>{{ e.supervisor }}</td>
                <td>{{ e.second }}</td>
                <td>{{ e.role }}</td>
                <td><span class="status approved">{{ e.status }}</span></td>
              </tr>
              <tr v-if="filteredEmployees.length === 0">
                <td colspan="6" style="text-align: center; color: #98a2b3">No employees found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <br />

        <!-- 员工详情抽屉 -->
        <div v-if="selectedEmployee" class="drawer">
          <h3>Employee Details</h3>
          <div class="grid two">
            <div class="field">
              <label>Full Name</label>
              <input class="input" :value="selectedEmployee.name" :key="selectedEmployee.name + '-name'" />
            </div>
            <div class="field">
              <label>Company Email</label>
              <input class="input" :value="selectedEmployee.email" :key="selectedEmployee.name + '-email'" />
            </div>
            <div class="field">
              <label>Organisation Unit</label>
              <select class="select">
                <option>Application Development</option>
                <option>QA Team</option>
                <option>Finance</option>
                <option>HR</option>
              </select>
            </div>
            <div class="field">
              <label>Direct Supervisor</label>
              <select class="select" :value="selectedEmployee.supervisor" :key="selectedEmployee.name + '-sup'">
                <option>Mary Chan</option>
                <option>David Lee</option>
                <option>Henry Ng</option>
              </select>
            </div>
            <div class="field">
              <label>Second-level Supervisor</label>
              <select class="select" :value="selectedEmployee.second" :key="selectedEmployee.name + '-sup2'">
                <option>David Lee</option>
                <option>Henry Ng</option>
              </select>
            </div>
            <div class="field">
              <label>Account Status</label>
              <select class="select">
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
          <br />
          <div>
            <b>System Roles</b>
            <br />
            <label
              v-for="role in ['Employee', 'Supervisor', 'Project Manager', 'System Administrator']"
              :key="role"
              style="margin-right: 16px"
            >
              <input
                type="checkbox"
                :checked="role === selectedEmployee.role"
                :key="selectedEmployee.name + role"
              />
              {{ role }}
            </label>
          </div>
          <br />
          <button class="btn primary">Save Changes</button>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppShell from '../components/AppShell.vue'
import PageHead from '../components/PageHead.vue'
import TreeNode from '../components/TreeNode.vue'
import { ORG_EMPLOYEES } from '../data/mockData'

const ORG_TREE = [
  {
    id: 'pccw',
    label: 'PCCW Group',
    children: [
      {
        id: 'tech',
        label: 'Technology',
        children: [
          {
            id: 'itd',
            label: 'IT Delivery',
            children: [
              { id: 'appdev',  label: 'Application Development', children: [] },
              { id: 'qa',      label: 'QA Team',                 children: [] },
              { id: 'support', label: 'Support',                 children: [] },
            ],
          },
        ],
      },
      { id: 'finance', label: 'Finance', children: [] },
      { id: 'hr',      label: 'HR',      children: [] },
    ],
  },
]

const selectedNode     = ref({ id: 'appdev', label: 'Application Development' })
const selectedEmployee = ref(ORG_EMPLOYEES[0])
const search           = ref('')

const filteredEmployees = computed(() =>
  ORG_EMPLOYEES.filter(
    e =>
      e.name.toLowerCase().includes(search.value.toLowerCase()) ||
      e.email.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script>

<style scoped>
.tree-root { list-style: none; margin: 0; padding: 0; }
</style>
