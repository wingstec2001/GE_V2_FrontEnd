import agent from '../api/agent'

const getsujiCrushedStore = {
  namespaced: true,
  state: {
    MonthlyCrusheds: [],
    f_MonthlyCrusheds: [],
    selMonthlyCrushed: [],
  },

  getters: {},

  mutations: {
    updateMonthlyCrusheds(state, newValue) {
      state.MonthlyCrusheds = newValue
    },

    updateSelectedMonthlyCrushed(state, newValue) {
      state.selMonthlyCrushed = newValue
    },
    filterIdMonthlyCrusheds(state, newValue) {
      state.f_MonthlyCrusheds = state.MonthlyCrusheds.filter(f => {
        const pFlag = newValue ? f.material_id === newValue : true

        return pFlag
      })
    },
    clearMonthlyCrusheds(state) {
      state.MonthlyCrusheds = []
      state.f_MonthlyCrusheds = []
    },
  },

  actions: {
    async loadMonthlyCrusheds(context, Month) {
      const result = await agent.GetsujiCrushed.all({ selMonth: Month })
      context.commit('updateMonthlyCrusheds', result.data)
    },

    async loadMonthlyCrushed(context, id) {
      const result = await agent.GetsujiCrushed.detail(id)
      context.commit('updateSelectedMonthlyCrushed', result.data)
    },

    async editMonthlyCrushed(context, crushed) {
      await agent.GetsujiCrushed.update(crushed)
    },
  },
}

export default getsujiCrushedStore
