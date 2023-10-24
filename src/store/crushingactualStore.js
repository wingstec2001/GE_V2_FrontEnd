import agent from '../api/agent'

const crushingactualStore = {
  namespaced: true,
  state: {
    crushingactuals: [],
    crushingactual: undefined,
    createInfos: {
      product_id: [],
    },
    selectedCrushingActual: undefined,
    f_crushingactuals: [],
  },

  getters: {},

  mutations: {
    updateCrushingActuals(state, newValue) {
      state.crushingactuals = newValue
    },
    updateCreateInfos(state, newValue) {
      state.createInfos = newValue
    },
    updateSelectedCrushingActual(state, newValue) {
      state.selectedCrushingActual = newValue
      state.selectedCrushingActual.actual_date = newValue.actual_date.substring(0, 16)
    },
    filterCrushingActuals(state, newValue) {
      state.f_crushingactuals = state.crushingactuals.filter(ca => {
        const mId = newValue.productId ? ca.product_id.toString() === newValue.productId : true
        const sDate = newValue.startDate ? new Date(ca.actual_date) >= new Date(newValue.startDate) : true
        const eDate = newValue.endDate ? new Date(ca.actual_date) <= new Date(newValue.endDate) : true

        return mId && sDate && eDate
      })
    },
  },

  actions: {
    async loadCrushingActuals(context, query) {
      try {
        const result = await agent.CrushingActual.all(query)

        const data = result.data.map(k => {
          const rObj = {}
          rObj.crushed_id = k.crushed_id
          rObj.processed = k.processed
          rObj.material_id = k.material_id
          rObj.note = k.note

          // if (k.product_name !== null) {
          //   rObj.product_name = k.product_name
          // } else {
          //   rObj.product_name = ''
          // }

          if (k.material_name !== null) {
            rObj.material_name = k.material_name
          } else {
            rObj.material_name = ''
          }
          rObj.actual_date = k.actual_date.substring(0, 16)
          rObj.actual_weight = k.actual_weight
          if (rObj.actual_weight !== null) {
            rObj.actual_weight = k.actual_weight
          }

          return rObj
        })
        context.commit('updateCrushingActuals', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadCrushingActual(context, id) {
      const result = await agent.CrushingActual.detail(id)
      context.commit('updateSelectedCrushingActual', result.data)
    },
    async loadCreateInfos(context) {
      try {
        const result = await agent.CrushingActual.createInfo()
        context.commit('updateCreateInfos', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async createCrushingActual(context, crushingactual) {
      await agent.CrushingActual.add(crushingactual)
    },

    async editCrushingActual(context, crushingactual) {
      await agent.CrushingActual.update(crushingactual)
    },

    async deleteCrushingActual(context, id) {
      await agent.CrushingActual.delete(id)
    },
  },
}

export default crushingactualStore
