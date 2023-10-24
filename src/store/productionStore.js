import agent from '../api/agent'

const productionStore = {
  namespaced: true,
  state: {
    productions: [],
    f_productions: [],
    production: undefined,
    selectedProduction: undefined,
  },
  getters: {},
  mutations: {
    updateProductions(state, newValue) {
      state.productions = newValue
    },
    updateSelectedProduction(state, newValue) {
      state.selectedProduction = newValue

      // state.selectedProduction.produced_dt = newValue.produced_dt.substring(0, 16)
    },
    filterProductions(state, newValue) {
      state.f_productions = state.productions.filter(pdt => {
        const rtId = newValue.routeId ? pdt.route_id.toString() === newValue.routeId : true
        const pdtId = newValue.productId ? pdt.product_id.toString() === newValue.productId : true
        const sDate = newValue.startDate ? new Date(pdt.produced_dt) >= new Date(newValue.startDate) : true
        const eDate = newValue.endDate ? new Date(pdt.produced_dt) <= new Date(newValue.endDate) : true

        return rtId && pdtId && sDate && eDate
      })
    },
  },
  actions: {
    async loadProductions(context, query) {
      try {
        const result = await agent.Production.all(query)

        const data = result.data.map(k => {
          const rObj = {}
          rObj.id = k.id
          rObj.route_id = k.route_id
          rObj.product_id = k.product_id
          if (k.product.length !== 0) {
            rObj.product_name = k.product[0].product_name
          } else {
            rObj.product_name = ''
          }

          rObj.produced_dt = k.produced_dt.substring(0, 16)
          rObj.produced_weight = k.produced_weight
          rObj.note = k.note

          return rObj
        })

        context.commit('updateProductions', data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadProduction(context, id) {
      const result = await agent.Production.detail(id)
      context.commit('updateSelectedProduction', result.data)
    },

    async createProduction(context, production) {
      await agent.Production.add(production)
    },
    async editProduction(context, production) {
      await agent.Production.update(production)
    },
    async deleteProduction(context, id) {
      await agent.Production.delete(id)
    },
  },
}

export default productionStore
