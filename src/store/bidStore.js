import agent from '../api/agent'

const bidStore = {
  namespaced: true,
  state: {
    bids: [],
    selectedBid: {},
  },
  getters: {},
  mutations: {
    updateBids(state, newValue) {
      state.bids = newValue
    },

    updateSelectedBid(state, newValue) {
      state.selectedBid = newValue
    },
  },
  actions: {
    async loadBids(context, query) {
      try {
        const result = await agent.Bid.all(query)

        context.commit('updateBids', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadBid(context, id) {
      const result = await agent.Bid.detail(id)
      context.commit('updateSelectedBid', result.data)
    },

    async createBid(context, bid) {
      let uploaded = false
      const obj = { ...bid }
      if (obj.bid_images.length !== 0) {
        await agent.Bid.uploadPhoto(obj.bid_images).then(data => {
          console.log('upload photo', data.data)
          obj.bid_images = data.data
          uploaded = true
        })
      } else {
        obj.bid_images = []
        uploaded = true
      }
      /* eslint-disable-next-line */
      while (!uploaded) { await new Promise(resolve => { setTimeout(() => { resolve() }, 1000) }) }
      await agent.Bid.add(obj)
    },
    async editBid(context, bid) {
      let uploaded = false
      const obj = { ...bid }

      // select object in reserce_image to upload
      const uploadImgs = []
      obj.bid_images.forEach(i => {
        if (typeof i === 'object') {
          uploadImgs.push(i)
        }
      })

      if (uploadImgs.length !== 0) {
        await agent.Bid.uploadPhoto(uploadImgs).then(data => {
          console.log('upload photo', data.data)
          const uploadedImgs = data.data
          for (let i = 0, j = 0; i < obj.bid_images.length; i += 1) {
            if (typeof obj.bid_images[i] === 'object') {
              obj.bid_images[i] = uploadedImgs[j]
              j += 1
            }
          }
          uploaded = true
          console.log('uploaded photo', obj.bid_images)
        })
      } else {
        uploaded = true
      }
      /* eslint-disable-next-line */
      while (!uploaded) { await new Promise(resolve => { setTimeout(() => { resolve() }, 1000) }) }
      await agent.Bid.update(obj)
    },
    async deleteBid(context, id) {
      await agent.Bid.delete(id)
    },
  },
}

export default bidStore
