import agent from '../api/agent'

const crushingplanStore = {
  namespaced: true,
  state: {
    crushingplans: [],
    crushingplan: undefined,
    selectedCrushingPlan: undefined,
    f_crushingplans: [],
  },

  getters: {},

  mutations: {
    updateCrushingPlans(state, newValue) {
      state.crushingplans = newValue
    },
    updateSelectedCrushingPlan(state, newValue) {
      state.selectedCrushingPlan = newValue
    },

    filterCrushingPlans(state, newValue) {
      state.f_crushingplans = state.crushingplans.filter(cp => {
        const mId = newValue.productId ? cp.product_id.toString() === newValue.productId : true
        const sDate = newValue.startDate ? new Date(cp.plan_dt) >= new Date(newValue.startDate) : true
        const eDate = newValue.endDate ? new Date(cp.plan_dt) <= new Date(newValue.endDate) : true

        return mId && sDate && eDate
      })
    },
  },

  actions: {
    async loadCrushingPlans(context) {
      try {
        const result = await agent.CrushingPlan.all()

        const data = result.data.map(k => {
          const rObj = {}
          rObj.id = k.id
          rObj.plan_dt = k.plan_dt
          rObj.plan_weight = k.plan_weight
          if (rObj.plan_weight !== null) {
            rObj.plan_weight = k.plan_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
          }

          return rObj
        })
        context.commit('updateCrushingPlans', data)
        console.log('loadCrushingPlans', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadCrushingPlan(context, id) {
      try {
        const result = await agent.CrushingPlan.detail(id)
        context.commit('updateSelectedCrushingPlan', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async createCrushingPlan(context, crushingplan) {
      await agent.CrushingPlan.add(crushingplan)
    },

    async editCrushingPlan(context, crushingplan) {
      await agent.CrushingPlan.update(crushingplan)
    },

    async deleteCrushingPlan(context, id) {
      await agent.CrushingPlan.delete(id)
      context.dispatch('loadCrushingPlans')
    },
  },
}

export default crushingplanStore
