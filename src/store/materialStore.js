import agent from '../api/agent'

const materialStore = {
  namespaced: true,
  state: {
    materials: [],
    material: undefined,
    photo: undefined,
    selectedMaterial: undefined,
    materialIds: [],
    materialMaster: {},
    materialNames: [],
    f_materials: [],
  },
  getters: {},
  mutations: {
    updateMaterials(state, newValue) {
      state.materials = newValue
    },
    updateSelectedMaterial(state, newValue) {
      state.selectedMaterial = newValue
    },
    updateMaterialMaster(state, newValue) {
      state.materialMaster = {}
      state.materialIds = newValue.map(v => {
        state.materialMaster[v.material_id] = v.material_name

        return v.material_id
      })
    },
    updateMaterialNames(state, newValue) {
      state.materialNames = newValue.map(v => v.material_name)
    },
    filterMaterials(state, newValue) {
      state.f_materials = state.materials.filter(ar => {
        const mId = newValue.materialId ? ar.material_id.toString() === newValue.materialId : true
        const mName = newValue.materialName ? ar.material_name.toString() === newValue.materialName : true

        return mId && mName
      })
    },
  },
  actions: {
    async loadMaterials(context, query) {
      try {
        const result = await agent.Material.all(query)
        context.commit('updateMaterials', result.data)
      } catch (error) {
        console.log('laodMaterials,error:', error)
      }
    },
    async loadMaterial(context, id) {
      try {
        const result = await agent.Material.detail(id)
        context.commit('updateSelectedMaterial', result.data)
      } catch (error) {
        console.log('laodMaterial,error:', error)
      }
    },
    async loadMaterialIds(context) {
      try {
        const result = await agent.Material.getids()
        context.commit('updateMaterialMaster', result.data)
      } catch (error) {
        console.log('loadMaterialIds,error:', error)
      }
    },
    async loadMaterialNames(context) {
      try {
        const result = await agent.Material.getids()
        context.commit('updateMaterialNames', result.data)
      } catch (error) {
        console.log('loadMaterialNames,error:', error)
      }
    },

    async createMaterial(context, material) {
      const obj = { ...material }
      if (obj.material_img !== '') {
        await agent.Material.uploadPhoto(obj.material_img).then(data => {
          obj.material_img = data.data
        })
      } else {
        obj.material_img = ''
      }

      await agent.Material.add(obj)
    },

    async uploadPhoto(context, material) {
      await agent.Material.uploadPhoto(material)
    },

    async editMaterial(context, material) {
      const obj = { ...material }
      if (obj.material_img != null) {
        await agent.Material.uploadPhoto(obj.material_img).then(data => {
          obj.material_img = data.data
        })
      } else {
        delete obj.material_img
      }

      await agent.Material.update(obj)
    },

    async deleteMaterial(context, id) {
      await agent.Material.delete(id)
      context.dispatch('loadMaterials')
    },
  },
}

export default materialStore
