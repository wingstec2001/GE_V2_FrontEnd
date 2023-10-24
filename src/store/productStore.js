import agent from '../api/agent'

const productStore = {
  namespaced: true,
  state: {
    products: [],
    product: undefined,
    selectedProduct: undefined,
    productMaster: {},
    productIds: [],
    productNames: [],

    // f_products: [],
  },
  getters: {},
  mutations: {
    updateProducts(state, newValue) {
      state.products = newValue
    },
    updateSelectedProduct(state, newValue) {
      state.selectedProduct = newValue
    },
    updateProductMaster(state, newValue) {
      // const key = newValue.product_id
      // if (state.productMaster[key] === undefined) {
      //   state.productIds.push(key)
      //   state.productMaster[key] = newValue.product_name
      // }
      state.productMaster = {}
      state.productIds = newValue.map(v => {
        state.productMaster[v.product_id] = v.product_name

        return v.product_id
      })
    },
    updateProductNames(state, newValue) {
      // const key = newValue.product_name
      // if (state.productNames.indexOf(key) === -1) {
      //   state.productNames.push(key)
      // }
      state.productNames = newValue.map(v => v.product_name)
    },

  },
  actions: {
    async loadProducts(context, query) {
      try {
        const result = await agent.Product.all(query)
        context.commit('updateProducts', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadProduct(context, id) {
      const result = await agent.Product.detail(id)
      context.commit('updateSelectedProduct', result.data)
    },
    async loadProductIds(context) {
      try {
        const result = await agent.Product.getids()
        context.commit('updateProductMaster', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadProductNames(context) {
      try {
        const result = await agent.Product.getids()
        context.commit('updateProductNames', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async createProduct(context, product) {
      const obj = { ...product }
      if (obj.product_img !== '') {
        await agent.Product.uploadPhoto(obj.product_img).then(data => {
          // eslint-disable-next-line no-param-reassign
          obj.product_img = data.data
        })
      } else {
        // eslint-disable-next-line no-param-reassign
        obj.product_img = ''
      }

      await agent.Product.add(obj)
    },
    async uploadPhoto(context, product) {
      await agent.Product.uploadPhoto(product)
    },
    async editProduct(context, product) {
      const obj = { ...product }
      if (obj.product_img != null) {
        await agent.Product.uploadPhoto(obj.product_img).then(data => {
          obj.product_img = data.data
        })
      } else {
        delete obj.product_img
      }
      await agent.Product.update(obj)
    },
    async deleteProduct(context, id) {
      await agent.Product.delete(id)
      context.dispatch('loadProducts')
    },
  },
}

export default productStore
