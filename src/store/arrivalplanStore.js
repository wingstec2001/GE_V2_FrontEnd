import agent from '../api/agent'

const arrivalplanStore = {
  namespaced: true,
  state: {
    arrivalplans: [],
    arrivalplan: undefined,
    selectedArrivalPlan: undefined,
    f_arrivalplans: [],
  },

  getters: {},

  mutations: {
    updateArrivalPlans(state, newValue) {
      state.arrivalplans = newValue
    },
    updateSelectedArrivalPlan(state, newValue) {
      state.selectedArrivalPlan = newValue
    },

    filterArrivalPlans(state, newValue) {
      state.f_arrivalplans = state.arrivalplans.filter(ap => {
        // const mId = newValue.materialId ? ap.material_id.toString() === newValue.materialId : true
        const cId = newValue.customerId ? ap.customer_id.toString() === newValue.customerId : true
        const sDate = newValue.startDate ? new Date(ap.plan_date) >= new Date(newValue.startDate) : true
        const eDate = newValue.endDate ? new Date(ap.plan_date) <= new Date(newValue.endDate) : true

        return cId && sDate && eDate
      })
    },
  },

  actions: {
    async loadArrivalPlans(context, query) {
      try {
        const result = await agent.ArrivalPlan.all(query)

        const data = result.data.map(k => {
          const rObj = {}
          rObj.id = k.id
          rObj.customer_id = k.customer_id
          rObj.customer_name = k.customer[0].customer_name
          rObj.plan_date = k.plan_date.substring(0, 10)
          rObj.plan_note = k.plan_note
          rObj.plan_ampm = k.plan_ampm
          if (rObj.plan_ampm !== null) {
            rObj.plan_ampm = k.plan_ampm === 0 ? '午前' : '午後'
          }
          rObj.plan_weight = k.plan_weight
          if (rObj.plan_weight !== null) {
            rObj.plan_weight = k.plan_weight
          }

          return rObj
        })
        context.commit('updateArrivalPlans', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadArrivalPlan(context, id) {
      const result = await agent.ArrivalPlan.detail(id)
      context.commit('updateSelectedArrivalPlan', result.data)
    },

    async createArrivalPlan(context, arrivalplan) {
      await agent.ArrivalPlan.add(arrivalplan)
    },

    async editArrivalPlan(context, arrivalplan) {
      await agent.ArrivalPlan.update(arrivalplan)
    },

    async deleteArrivalPlan(context, id) {
      await agent.ArrivalPlan.delete(id)
    },
  },
}

export default arrivalplanStore
