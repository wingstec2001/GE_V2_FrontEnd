import agent from '../api/agent'

const reserveStore = {
  namespaced: true,
  state: {
    reserves: [],
    selectedReserve: {},
  },
  getters: {},
  mutations: {
    updateReserves(state, newValue) {
      state.reserves = newValue
    },

    updateSelectedReserve(state, newValue) {
      state.selectedReserve = newValue
    },
  },
  actions: {
    async loadReserves(context, query) {
      try {
        const result = await agent.Reserve.all(query)

        context.commit('updateReserves', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadReserve(context, id) {
      const result = await agent.Reserve.detail(id)
      context.commit('updateSelectedReserve', result.data)
    },

    async createReserve(context, reserve) {
      let uploaded = false
      const obj = { ...reserve }
      if (obj.reserve_images.length !== 0) {
        await agent.Reserve.uploadPhoto(obj.reserve_images).then(data => {
          obj.reserve_images = data.data
          uploaded = true
        })
      } else {
        obj.reserve_images = []
        uploaded = true
      }
      /* eslint-disable-next-line */
      while (!uploaded) { await new Promise(resolve => { setTimeout(() => { resolve() }, 1000) }) }
      await agent.Reserve.add(obj)

      // await agent.Reserve.uploadPhoto(reserve)
    },
    async editReserve(context, reserve) {
      let uploaded = false
      const obj = { ...reserve }

      // select object in reserce_image to upload
      const uploadImgs = []
      obj.reserve_images.forEach(i => {
        if (typeof i === 'object') {
          uploadImgs.push(i)
        }
      })

      if (uploadImgs.length !== 0) {
        await agent.Reserve.uploadPhoto(uploadImgs).then(data => {
          const uploadedImgs = data.data
          for (let i = 0, j = 0; i < obj.reserve_images.length; i += 1) {
            if (typeof obj.reserve_images[i] === 'object') {
              obj.reserve_images[i] = uploadedImgs[j]
              j += 1
            }
          }
          uploaded = true
          console.log('uploaded photo', obj.reserve_images)
        })
      } else {
        uploaded = true
      }
      /* eslint-disable-next-line */
      while (!uploaded) { await new Promise(resolve => { setTimeout(() => { resolve() }, 1000) }) }
      await agent.Reserve.update(obj)
    },
    async deleteReserve(context, id) {
      await agent.Reserve.delete(id)
    },
  },
}

export default reserveStore
