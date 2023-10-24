import agent from '../api/agent'

const getsujiProductStore = {
  namespaced: true,
  state: {
    MonthlyProducts: [],
    f_MonthlyProducts: [],
    selMonthlyProduct: [],
  },

  getters: {},

  mutations: {
    updateMonthlyProducts(state, newValue) {
      state.MonthlyProducts = newValue
    },

    updateSelectedMonthlyProduct(state, newValue) {
      state.selMonthlyProduct = newValue
    },
    filterIdMonthlyProducts(state, newValue) {
      state.f_MonthlyProducts = state.MonthlyProducts.filter(f => {
        const pFlag = newValue ? f.product_id === newValue : true

        return pFlag
      })
    },
    clearMonthlyProducts(state) {
      state.MonthlyProducts = []
      state.f_MonthlyProducts = []
    },
  },

  actions: {
    async loadMonthlyProducts(context, Month) {
      const result = await agent.GetsujiProduct.all({ selMonth: Month })
      context.commit('updateMonthlyProducts', result.data)
    },

    async loadMonthlyProduct(context, id) {
      const result = await agent.GetsujiProduct.detail(id)
      context.commit('updateSelectedMonthlyProduct', result.data)
    },

    async editMonthlyProduct(context, product) {
      await agent.GetsujiProduct.update(product)
    },

    async updLastMonthCarryOver(context, product) {
      console.log('updLastMonthCarryOver')
      await agent.GetsujiProduct.updatelastmonth(product)
    },
  },
}

export default getsujiProductStore
