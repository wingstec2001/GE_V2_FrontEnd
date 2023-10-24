import agent from '@/api/agent'

const vanningStore = {
  namespaced: true,
  state: {
    vannings: [],
    shippeds: [],
    shippings: [],
    selectedVanning: '',
  },

  getters: {},

  mutations: {
    updateVannings(state, newValue) {
      state.vannings = []
      newValue.forEach(v => {
        const obj = { ...v }
        obj.vanning_date = `${v.vanning_date} ${v.vanning_time.substring(0, 5)}`
        obj.totalWeight = 0
        v.vanning_details.forEach(vd => {
          obj.totalWeight += vd.vanning_weight
        })
        state.vannings.push(obj)
      })

      state.shippings = state.vannings.filter(v => v.vanning_status !== 2)
      state.shippeds = state.vannings.filter(v => v.vanning_status === 2)
    },
    updateSelectedVanning(state, newValue) {
      state.selectedVanning = ''
      state.selectedVanning = newValue
    },
  },

  actions: {
    async loadVannings(context, query) {
      const result = await agent.Vanning.all(query)
      context.commit('updateVannings', result.data)
    },

    async loadVanning(context, id) {
      const result = await agent.Vanning.detail(id)
      context.commit('updateSelectedVanning', result.data)
    },

    async createVanning(context, Vanning) {
      await agent.Vanning.add(Vanning)
    },

    async editVanning(context, Vanning) {
      await agent.Vanning.update(Vanning)
    },
  },
}

export default vanningStore
