import agent from '../api/agent'

const reservedStore = {
  namespaced: true,
  state: {
    reserveds: [],
    selectedReserved: {},
  },
  getters: {},
  mutations: {
    updateReserveds(state, newValue) {
      state.reserveds = newValue
    },

    updateSelectedReserved(state, newValue) {
      state.selectedReserved = newValue
    },
  },
  actions: {
    async loadReserveds(context, query) {
      try {
        const result = await agent.Reserved.all(query)

        context.commit('updateReserveds', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadReserved(context, id) {
      const result = await agent.Reserved.detail(id)
      context.commit('updateSelectedReserved', result.data)
    },

    async editReserved(context, reserve) {
      const obj = { ...reserve }
      await agent.Reserved.update(obj)
    },
  },
}

export default reservedStore
