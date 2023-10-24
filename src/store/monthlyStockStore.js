import agent from '../api/agent'

const monthlyStockStore = {
  namespaced: true,
  state: {
    MthlyProdStock: [],
    f_MthlyProdStock: [],
    MthlyMatStock: [],
    f_MthlyMatStock: [],
    MthlyCruStock: [],
    f_MthlyCruStock: [],
  },

  getters: {},

  mutations: {
    updateMthlyProdStock(state, newValue) {
      state.MthlyProdStock = newValue
    },

    filterMthlyProdStock(state, newValue) {
      state.f_MthlyProdStock = state.MthlyProdStock.filter(f => {
        const pFlag = newValue ? f.product_id === newValue : true

        return pFlag
      })
    },

    updateMthlyMatStock(state, newValue) {
      state.MthlyMatStock = newValue
    },

    filterMthlyMatStock(state, newValue) {
      state.f_MthlyMatStock = state.MthlyMatStock.filter(f => {
        const mFlag = newValue ? f.material_id === newValue : true

        return mFlag
      })
    },

    updateMthlyCruStock(state, newValue) {
      state.MthlyCruStock = newValue
    },

    filterMthlyCruStock(state, newValue) {
      state.f_MthlyCruStock = state.MthlyCruStock.filter(f => {
        const mFlag = newValue ? f.material_id === newValue : true

        return mFlag
      })
    },

    clearMonthlyStock(state) {
      state.MthlyProdStock = []
      state.MthlyMatStock = []
      state.MthlyCruStock = []
      state.f_MthlyProdStock = []
      state.f_MthlyMatStock = []
      state.f_MthlyCruStock = []
    },
  },

  actions: {
    async loadMthlyProdStock(context, Month) {
      try {
        const result = await agent.MonthlyStock.allProduct({ type: 'product', selMonth: Month })
        context.commit('updateMthlyProdStock', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadMthlyMatStock(context, Month) {
      try {
        const result = await agent.MonthlyStock.allMaterial({ type: 'material', selMonth: Month })
        context.commit('updateMthlyMatStock', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadMthlyCruStock(context, Month) {
      try {
        const result = await agent.MonthlyStock.allCrushed({ type: 'crushed', selMonth: Month })
        context.commit('updateMthlyCruStock', result.data)
      } catch (error) {
        console.log(error)
      }
    },
  },
}

export default monthlyStockStore
