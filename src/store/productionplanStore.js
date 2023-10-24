import agent from '../api/agent'

const productionplanStore = {
  namespaced: true,
  state: {
    productionplans: [],
    productionplan: undefined,
    selectedProductionPlan: undefined,
    f_productionplans: [],
  },

  getters: {},

  mutations: {
    updateProductionPlans(state, newValue) {
      state.productionplans = newValue
    },
    updateSelectedProductionPlan(state, newValue) {
      state.selectedProductionPlan = newValue
    },

    filterProductionPlans(state, newValue) {
      state.f_productionplans = state.productionplans.filter(pp => {
        const rtId = newValue.routeId ? pp.route_id.toString() === newValue.routeId : true
        const pdtId = newValue.productId ? pp.product_id.toString() === newValue.productId : true
        const sDate = newValue.startDate ? new Date(pp.plan_date) >= new Date(newValue.startDate) : true
        const eDate = newValue.endDate ? new Date(pp.plan_date) <= new Date(newValue.endDate) : true

        return rtId && pdtId && sDate && eDate
      })
    },
  },

  actions: {
    async loadProductionPlans(context, query) {
      try {
        const result = await agent.ProductionPlan.all(query)

        const data = result.data.map(k => {
          const rObj = {}
          rObj.id = k.id
          rObj.route_id = k.route_id
          rObj.product_id = k.product_id
          rObj.product_name = k.product[0].product_name
          rObj.plan_date = k.plan_date

          // rObj.plan_date = format(new Date(k.plan_date), 'yyyy-MM-dd HH:mm')
          rObj.plan_weight = k.plan_weight
          if (rObj.plan_weight !== null) {
            rObj.plan_weight = k.plan_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
          }

          return rObj
        })
        context.commit('updateProductionPlans', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadProductionPlan(context, id) {
      try {
        const result = await agent.ProductionPlan.detail(id)
        context.commit('updateSelectedProductionPlan', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async createProductionPlan(context, productionplan) {
      await agent.ProductionPlan.add(productionplan)
    },

    async editProductionPlan(context, productionplan) {
      await agent.ProductionPlan.update(productionplan)
    },

    async deleteProductionPlan(context, id) {
      await agent.ProductionPlan.delete(id)
      context.dispatch('loadProductionPlans')
    },
  },
}

export default productionplanStore
