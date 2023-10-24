import agent from '../api/agent'

const employeeStore = {
  namespaced: true,
  state: {
    employees: [],
    employee: undefined,
    selectedEmployee: undefined,

    // f_employees: [],
    employeeIds: [],
    employeeNames: [],
    EmployeeMaster: {},
  },

  getters: {},

  mutations: {
    updateEmployees(state, newValue) {
      state.employees = newValue
    },
    updateSelectedEmployee(state, newValue) {
      state.selectedEmployee = newValue
    },

    updateEmployeeMaster(state, newValue) {
      state.employeeIds = newValue.map(v => v.employee_id)
    },
    updateEmployeeName(state, newValue) {
      state.employeeNames = newValue.map(v => v.employee_name)
    },
  },

  actions: {
    async loadEmployees(context, query) {
      try {
        const result = await agent.Employee.all(query)

        const data = result.data.map(k => {
          const rObj = {}
          rObj.id = k.id
          rObj.employee_id = k.employee_id
          rObj.employee_name = `${k.employee_sei} ${k.employee_mei}`
          rObj.employee_sei = k.employee_sei
          rObj.employee_mei = k.employee_mei
          rObj.employee_seikn = k.employee_seikn
          rObj.employee_meikn = k.employee_meikn
          rObj.employee_birth = k.employee_birth
          rObj.gender = k.gender === 0 ? '男' : '女'
          rObj.mobile = k.mobile
          rObj.address = k.address
          rObj.jobtitle = k.jobtitle

          return rObj
        })
        context.commit('updateEmployees', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadEmployee(context, id) {
      try {
        const result = await agent.Employee.detail(id)
        context.commit('updateSelectedEmployee', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadEmployeeIds(context) {
      try {
        const result = await agent.Employee.getids()

        context.commit('updateEmployeeMaster', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadEmployeeNames(context) {
      try {
        const result = await agent.Employee.getids()

        const data = result.data.map(k => {
          const rObj = {}
          rObj.employee_name = `${k.employee_sei} ${k.employee_mei}`

          return rObj
        })

        context.commit('updateEmployeeName', data)
      } catch (error) {
        console.log(error)
      }
    },

    async createEmployee(context, employee) {
      await agent.Employee.add(employee)
    },

    async editEmployee(context, employee) {
      await agent.Employee.update(employee)
    },

    async deleteEmployee(context, id) {
      await agent.Employee.delete(id)
      context.dispatch('loadEmployees')
    },
  },
}

export default employeeStore
