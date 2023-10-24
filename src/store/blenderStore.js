import agent from '../api/agent'

const blenderStore = {
  namespaced: true,
  state: {
    blenders: [],
    selectedBlender: undefined,
  },
  getters: {},
  mutations: {
    updateBlenders(state, newValue) {
      state.blenders = newValue
    },
    updateBlender(state, newValue) {
      state.selectedBlender = newValue
    },
  },
  actions: {
    async loadBlenders(context, query) {
      try {
        const result = await agent.Blender.all(query)

        const data = result.data.map(k => {
          const rObj = {}
          rObj.id = k.id
          rObj.stock_crushed_id = k.stock_crushed_id
          rObj.material_id = k.material_id

          rObj.material_name = k.material_name

          rObj.blended_dt = k.blended_dt.substring(0, 16)
          rObj.blended_weight = k.blended_weight
          rObj.origin = k.origin ?? ''

          return rObj
        })

        context.commit('updateBlenders', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadBlender(context, id) {
      const result = await agent.Blender.detail(id)
      const data = { ...result.data }
      data.blended_dt = result.data.blended_dt.substring(0, 16)
      data.material_name = result.data.material ? result.data.material.material_name : ''

      context.commit('updateBlender', data)
    },

    async createBlender(context, blender) {
      await agent.Blender.add(blender)
    },

    async deleteBlender(context, id) {
      await agent.Blender.delete(id)
    },

    async addByWeight(context, info) {
      await agent.Blender.addbyweight(info)
    },
  },
}

export default blenderStore
