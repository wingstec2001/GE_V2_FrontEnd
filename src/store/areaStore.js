import agent from '../api/agent'

const areaStore = {
  namespaced: true,
  state: {
    areas: [],
    area: undefined,
    selectedArea: undefined,
    areaMaster: {},
    areaIds: [],
    areaNames: [],

    // f_areas: [],
  },

  getters: {},

  mutations: {
    updateAreas(state, newValue) {
      state.areas = newValue
    },
    updateSelectedArea(state, newValue) {
      state.selectedArea = newValue
    },
    updateAreaMaster(state, newValue) {
      // const key = newValue.area_id
      // if (state.areaMaster[key] === undefined) {
      //   state.areaIds.push(key)
      //   state.areaMaster[key] = newValue.area_name
      // }
      state.areaMaster = {}
      state.areaIds = newValue.map(v => {
        state.areaMaster[v.area_id] = v.area_name

        return v.area_id
      })
    },
    updateAreaNames(state, newValue) {
      // const key = newValue.area_name
      // if (state.areaNames.indexOf(key) === -1) {
      //   state.areaNames.push(key)
      // }
      state.areaNames = newValue.map(v => v.area_name)
    },

    // filterAreas(state, newValue) {
    //   state.f_areas = state.areas.filter(ar => {
    //     const aId = newValue.areaId ? ar.area_id.toString() === newValue.areaId : true
    //     const aName = newValue.areaName ? ar.area_name.toString() === newValue.areaName : true

    //     return aId && aName
    //   })
    //   console.log('filter-areas', state.f_areas)
    // },
  },

  actions: {
    async loadAreas(context, query) {
      try {
        const result = await agent.Area.all(query)
        context.commit('updateAreas', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadArea(context, id) {
      const result = await agent.Area.detail(id)
      context.commit('updateSelectedArea', result.data)
    },

    async loadAreaIds(context) {
      try {
        const result = await agent.Area.getids()
        context.commit('updateAreaMaster', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadAreaNames(context) {
      try {
        const result = await agent.Area.getids()
        context.commit('updateAreaNames', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async createArea(context, area) {
      await agent.Area.add(area)
    },

    async editArea(context, area) {
      await agent.Area.update(area)
    },

    async deleteArea(context, id) {
      await agent.Area.delete(id)

      // context.dispatch('loadAreas')
    },
  },
}

export default areaStore
