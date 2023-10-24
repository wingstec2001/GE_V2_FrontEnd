import agent from '../api/agent'

const getsujiMaterialStore = {
  namespaced: true,
  state: {
    MonthlyMaterials: [],
    f_MonthlyMaterials: [],
    selMonthlyMaterial: [],
  },

  getters: {},

  mutations: {
    updateMonthlyMaterials(state, newValue) {
      state.MonthlyMaterials = newValue
    },

    updateSelectedMonthlyMaterial(state, newValue) {
      state.selMonthlyMaterial = newValue
    },
    filterIdMonthlyMaterials(state, newValue) {
      state.f_MonthlyMaterials = state.MonthlyMaterials.filter(f => {
        const pFlag = newValue ? f.material_id === newValue : true

        return pFlag
      })
    },
    clearMonthlyMaterials(state) {
      state.MonthlyMaterials = []
      state.f_MonthlyMaterials = []
    },
  },

  actions: {
    async loadMonthlyMaterials(context, Month) {
      const result = await agent.GetsujiMaterial.all({ selMonth: Month })
      context.commit('updateMonthlyMaterials', result.data)
    },

    async loadMonthlyMaterial(context, id) {
      const result = await agent.GetsujiMaterial.detail(id)
      context.commit('updateSelectedMonthlyMaterial', result.data)
    },

    async editMonthlyMaterial(context, material) {
      await agent.GetsujiMaterial.update(material)
    },
  },
}

export default getsujiMaterialStore
