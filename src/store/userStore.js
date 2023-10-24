import agent from '../api/agent'

const userStore = {
  namespaced: true,
  state: {
    users: [],
    usernames: [],
    user: undefined,
    selectedUser: undefined,
    updatedRoleInfo: [],
    createUserInfo: [],

    // f_users: [],
  },

  getters: {},

  mutations: {
    updateUsers(state, newValue) {
      state.users = newValue
    },
    updateUserNames(state, newValue) {
      // const key = newValue.name
      // state.usernames.push(key)
      state.usernames = newValue.map(v => v.name)
    },
    updateSelectedUser(state, newValue) {
      state.selectedUser = newValue
    },
    updateUpdateUserInfo(state, newValue) {
      state.updatedRoleInfo = newValue
    },
    updateCreateUserInfo(state, newValue) {
      state.createUserInfo = newValue
    },

  },

  actions: {
    async loadUsers(context, query) {
      try {
        const result = await agent.User.all(query)
        context.commit('updateUsers', result.data)
        console.log('loadUsers', result)
      } catch (error) {
        console.log(error)
      }
    },

    async loadUser(context, id) {
      const result = await agent.User.detail(id)

      // eslint-disable-next-line prefer-destructuring
      result.data.roles = result.data.userRoles[0]
      context.commit('updateSelectedUser', result.data)
    },
    async loadUpdateUserInfo(context, id) {
      const result = await agent.User.updateInfo(id)
      context.commit('updateUpdateUserInfo', result.data)
    },
    async loadCreateUserInfo(context) {
      const result = await agent.User.createInfo()
      context.commit('updateCreateUserInfo', result.data)
    },
    async loadUserNames(context) {
      try {
        const result = await agent.User.all()

        context.commit('updateUserNames', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async createUser(context, user) {
      await agent.User.add(user)
    },

    async editUser(context, user) {
      await agent.User.update(user)
    },

    async deleteUser(context, id) {
      await agent.User.delete(id)
      context.dispatch('loadUsers')
    },
  },
}

export default userStore
