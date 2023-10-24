import agent from '../api/agent'

const stockedStore = {
  namespaced: true,
  state: {
    StockedMaterials: [],
    StockedProducts: [],
    StockedCrushed: [],
    f_StockedMaterials: [],
    f_StockedProducts: [],
    f_StockedCrushed: [],
  },

  getters: {},

  mutations: {
    updateStockedMaterials(state, newValue) {
      state.StockedMaterials = newValue
    },
    updateStockedProducts(state, newValue) {
      state.StockedProducts = newValue
    },
    updateStockedCrushed(state, newValue) {
      state.StockedCrushed = newValue
    },

    filterStockedProducts(state, newValue) {
      state.f_StockedProducts = state.StockedProducts.filter(f => {
        const pFlag = newValue ? f.product_id === newValue : true

        return pFlag
      })
    },

    filterStockedCrushed(state, newValue) {
      state.f_StockedCrushed = state.StockedCrushed.filter(f => {
        const pFlag = newValue ? f.material_id === newValue : true

        return pFlag
      })
    },

    filterStockedMaterials(state, newValue) {
      state.f_StockedMaterials = state.StockedMaterials.filter(f => {
        const pFlag = newValue ? f.material_id === newValue : true

        return pFlag
      })
    },
    clearStocked(state) {
      state.StockedMaterials = []
      state.StockedProducts = []
      state.StockedCrushed = []
      state.f_StockedMaterials = []
      state.f_StockedProducts = []
      state.f_StockedCrushed = []
    },
  },

  actions: {
    async loadStockMaterials(context, query) {
      try {
        const result = await agent.Stocked.allMaterials(query)
        context.commit('updateStockedMaterials', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadStockProducts(context, query) {
      try {
        const result = await agent.Stocked.allProducts(query)
        context.commit('updateStockedProducts', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadStockCrushed(context, query) {
      try {
        const result = await agent.Stocked.allCrushed(query)
        context.commit('updateStockedCrushed', result.data)
      } catch (error) {
        console.log(error)
      }
    },
  },
}

export default stockedStore
