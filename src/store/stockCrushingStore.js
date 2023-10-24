import agent from '../api/agent'

const stockCrushingStore = {
  namespaced: true,
  state: {
    StockCrushing: [],
    StockCrushed: [],
    InhouseCrushed: [],
    ArrivalCrushed: [],
    Rolenames: [],
    Role: undefined,
    selectedRole: undefined,
    f_StockCrushing: [],
    f_StockCrushed: [],
    f_InhouseCrushed: [],
    f_ArrivalCrushed: [],
    createRoleInfo: {
      permissions: [],
    },

  },

  getters: {},

  mutations: {
    updateStockCrushing(state, newValue) {
      state.StockCrushing = newValue
    },

    updateStockCrushed(state, newValue) {
      state.StockCrushed = newValue
    },

    updateInhouseCrushed(state, newValue) {
      state.InhouseCrushed = newValue
    },

    updateArrivalCrushed(state, newValue) {
      state.ArrivalCrushed = newValue
    },

    updateRoleNames(state, newValue) {
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

    filterStockCrushing(state, newValue) {
      state.f_StockCrushing = state.StockCrushing.filter(filterVal => {
        const mFlag = newValue.material_id ? filterVal.material_id === newValue.material_id : true
        const cFlag = newValue.customer_id ? filterVal.customer_id === newValue.customer_id : true

        return mFlag && cFlag
      })
    },

    filterStockCrushed(state, newValue) {
      state.f_StockCrushed = state.StockCrushed.filter(filterVal => {
        const pFlag = newValue.material_id ? filterVal.material_id === newValue.material_id : true

        const cFlag = newValue.origin ? filterVal.origin === newValue.origin : true

        return pFlag && cFlag
      })
    },

    filterInhouseCrushed(state, newValue) {
      state.f_InhouseCrushed = state.InhouseCrushed.filter(filterVal => {
        const pFlag = newValue.material_id ? filterVal.material_id === newValue.material_id : true

        return pFlag
      })
    },

    filterArrivalCrushed(state, newValue) {
      state.f_ArrivalCrushed = state.ArrivalCrushed.filter(filterVal => {
        const pFlag = newValue.material_id ? filterVal.material_id === newValue.material_id : true

        return pFlag
      })
    },

  },

  actions: {

    async loadStockCrushed(context, query) {
      try {
        const result = await agent.StockCrushing.allWithCrushed(query)
        context.commit('updateStockCrushed', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadInhouseCrushed(context) {
      try {
        const result = await agent.StockCrushing.inhouse()
        context.commit('updateInhouseCrushed', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadArrivalCrushed(context) {
      try {
        const result = await agent.StockCrushing.arrived()
        context.commit('updateArrivalCrushed', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async createStockCrushed(context, StockCrushed) {
      await agent.StockCrushing.add(StockCrushed)
    },

    async editStockCrushed(context, StockCrushed) {
      await agent.StockCrushing.update(StockCrushed)
    },

    async deleteStockCrushed(context, id) {
      await agent.StockCrushing.delete(id)
      context.dispatch('loadStockCrushing')
    },

  },

}

export default stockCrushingStore
