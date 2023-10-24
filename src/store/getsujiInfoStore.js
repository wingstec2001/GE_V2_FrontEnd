import agent from '../api/agent'

const getsujiInfoStore = {
  namespaced: true,
  state: {
    MonthlyInfo: [],
    f_MonthlyInfo: [],
    selProMonthlyInfo: [],
  },

  getters: {},

  mutations: {
    updateMonthlyInfo(state, newValue) {
      state.MonthlyInfo = newValue
    },

    // SelectdProductMonthlyInfo
    updateSelProMonthlyInfo(state, newValue) {
      state.selProMonthlyInfo = newValue
    },
    filterIdMonthlyInfo(state, newValue) {
      state.f_MonthlyInfo = state.MonthlyInfo.filter(f => {
        const pFlag = newValue ? f.product_id === newValue : true

        return pFlag
      })
    },
    filterDateMonthlyInfo(state, newValue) {
      state.MonthlyInfo = state.MonthlyInfo.filter(f => {
        const dFlag = newValue ? f.yyyymm === newValue : true

        return dFlag
      })
    },
    clearMonthlyInfo(state) {
      state.MonthlyInfo = []
      state.f_MonthlyInfo = []
    },
  },

  actions: {
    async loadMonthInfo(context, month) {
      try {
        context.commit('clearMonthlyInfo')
        const result = await agent.GetsujiInfo.all()
        context.commit('updateMonthlyInfo', result.data)
        context.commit('filterDateMonthlyInfo', month)
      } catch (error) {
        console.log(error)
      }
    },
    async loadMonthlyInfo(context) {
      try {
        context.commit('clearMonthlyInfo')
        const result = await agent.GetsujiInfo.all()
        context.commit('updateMonthlyInfo', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadProdMonthlyInfo(context, id) {
      try {
        const result = await agent.GetsujiInfo.detail(id)
        context.commit('updateSelProMonthlyInfo', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async editProdMonthlyInfo(context, info) {
      await agent.GetsujiInfo.update(info)
    },
  },
}

export default getsujiInfoStore
