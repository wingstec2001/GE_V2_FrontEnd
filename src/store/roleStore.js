import agent from '../api/agent'

const Rolestore = {
  namespaced: true,
  state: {
    Roles: [],
    Rolenames: [],
    Role: undefined,
    selectedRole: undefined,

    // f_Roles: [],
    createRoleInfo: {
      permissions: [],
    },
    updateRoleInfo: {
      id: undefined,
      name: undefined,
      rolePermissions: [],
      permissions: [],
    },
  },

  getters: {},

  mutations: {
    updateRoles(state, newValue) {
      state.Roles = newValue
      state.f_Roles = newValue
    },
    updateRoleNames(state, newValue) {
      // const key = newValue.name
      // state.Rolenames.push(key)
      state.Rolenames = newValue.map(v => v.name)
    },
    updateCreateRoleInfo(state, newValue) {
      state.createRoleInfo = newValue
    },
    updateUpdateRoleInfo(state, newValue) {
      state.updateRoleInfo = newValue
    },
    updateSelectedRole(state, newValue) {
      state.selectedRole = newValue
    },

  },

  actions: {
    async loadRoles(context, query) {
      try {
        const result = await agent.Role.all(query)
        context.commit('updateRoles', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadRole(context, id) {
      const result = await agent.Role.detail(id)

      // eslint-disable-next-line prefer-destructuring
      result.data.roles = result.data.RoleRoles[0]
      context.commit('updateSelectedRole', result.data)
    },

    async loadRoleNames(context) {
      try {
        const result = await agent.Role.all()

        context.commit('updateRoleNames', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadCreateRoleInfo(context) {
      const result = await agent.Role.createInfo()
      context.commit('updateCreateRoleInfo', result.data)
    },
    async loadUpdateRoleInfo(context, id) {
      const result = await agent.Role.updateInfo(id)
      context.commit('updateUpdateRoleInfo', result.data)
    },
    async createRole(context, Role) {
      await agent.Role.add(Role)
    },

    async editRole(context, Role) {
      await agent.Role.update(Role)
    },

    async deleteRole(context, id) {
      await agent.Role.delete(id)
      context.dispatch('loadRoles')
    },
  },
}

export default Rolestore
