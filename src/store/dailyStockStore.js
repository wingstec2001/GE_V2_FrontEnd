import agent from '../api/agent'

const dailyStockStore = {
  namespaced: true,
  state: {
    DailyProductStock: [],
    DailyMaterialStock: [],
    DailyCrushedStock: [],
    wgtin_lmSum: '',
    wgtout_lmSum: '',
    net_weight: '',
    getsuji_id: '',
  },

  getters: {},

  mutations: {
    updateDailyProductStock(state, newValue) {
      let sumWgt = newValue.net_weight
      state.DailyProductStock = newValue.dly_prodSt.map(f => {
        const obj = f
        obj.daily_weight = f.weight_in - f.weight_out
        obj.net_weight = sumWgt + f.weight_in - f.weight_out
        sumWgt = obj.net_weight

        return obj
      })
      state.wgtin_lmSum = newValue.wgtin_lmSum
      state.wgtout_lmSum = newValue.wgtout_lmSum
      state.net_weight = newValue.net_weight
      state.getsuji_id = newValue.getsuji_id
    },

    updateDailyMaterialInfo(state, newValue) {
      let sumWgt = newValue.net_weight
      state.DailyMaterialStock = newValue.dly_matSt.map(f => {
        const obj = f
        obj.daily_weight = f.weight_in - f.weight_out
        obj.net_weight = sumWgt + f.weight_in - f.weight_out
        sumWgt = obj.net_weight

        return obj
      })
      state.wgtin_lmSum = newValue.wgtin_lmSum
      state.wgtout_lmSum = newValue.wgtout_lmSum
      state.net_weight = newValue.net_weight
      state.getsuji_id = newValue.getsuji_id
    },

    updateDailyCrushedInfo(state, newValue) {
      let sumWgt = newValue.net_weight
      state.DailyCrushedStock = newValue.dly_cruSt.map(f => {
        const obj = f
        obj.daily_weight = f.weight_in - f.weight_out
        obj.net_weight = sumWgt + f.weight_in - f.weight_out
        sumWgt = obj.net_weight

        return obj
      })
      state.wgtin_lmSum = newValue.wgtin_lmSum
      state.wgtout_lmSum = newValue.wgtout_lmSum
      state.net_weight = newValue.net_weight
      state.getsuji_id = newValue.getsuji_id
    },

    clearCache(state) {
      state.DailyProductStock = []
      state.DailyMaterialStock = []
      state.DailyCrushedStock = []
      state.wgtin_lmSum = ''
      state.wgtout_lmSum = ''
      state.net_weight = ''
    },
  },

  actions: {
    async loadDailyProductStock(context, params) {
      try {
        context.commit('clearCache')
        const result = await agent.DailyStock.allProduct(params)
        context.commit('updateDailyProductStock', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadDailyMaterialStock(context, params) {
      try {
        context.commit('clearCache')
        const result = await agent.DailyStock.allMaterial(params)
        context.commit('updateDailyMaterialInfo', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadDailyCrushedInfo(context, params) {
      try {
        context.commit('clearCache')

        const result = await agent.DailyStock.allCrushed(params)
        context.commit('updateDailyCrushedInfo', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    // 材料在庫再計算
    async recalculateMaterialStock(context, params) {
      try {
        context.commit('clearCache')
        const result = await agent.DailyStock.recalMaterial(params)
        context.commit('updateDailyMaterialInfo', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    // 粉砕済在庫再計算
    async recalculateCrushedStock(context, params) {
      try {
        context.commit('clearCache')
        const result = await agent.DailyStock.recalCrushed(params)
        context.commit('updateDailyCrushedInfo', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    // ペレット在庫再計算
    async recalculatePelletStock(context, params) {
      try {
        context.commit('clearCache')
        const result = await agent.DailyStock.recalPellet(params)
        context.commit('updateDailyProductStock', result.data)
      } catch (error) {
        console.log(error)
      }
    },
  },
}

export default dailyStockStore
