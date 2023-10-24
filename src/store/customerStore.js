import agent from '../api/agent'

const customerStore = {
  namespaced: true,
  state: {
    customers: [],
    customer: undefined,
    selectedCustomer: undefined,

    // f_customers: [],
    customerIds: [],
    supplierIds: [],
    customerNames: [],
    mobileList: [],
    customerMaster: {},
    supplierMaster: {},
    ccaList: {},
  },

  getters: {},

  mutations: {
    updateCustomers(state, newValue) {
      state.customers = newValue
    },
    updateSelectedCustomer(state, newValue) {
      state.selectedCustomer = newValue
    },
    updateCustomerMaster(state, newValue) {
      state.customerMaster = {}
      state.customerIds = newValue.map(v => {
        state.customerMaster[v.customer_id] = v.customer_name

        return v.customer_id
      })
    },
    updateMobileNums(state, newValue) {
      state.mobileList = newValue
    },
    updateSupplierMaster(state, newValue) {
      state.supplierMaster = {}
      state.supplierIds = newValue.map(v => {
        state.supplierMaster[v.customer_id] = v.customer_name

        return v.customer_id
      })
    },
    updateCustomerName(state, newValue) {
      state.customerNames = newValue.map(v => v.customer_name)
    },
    updateCcaList(state, newValue) {
      newValue.data.forEach(c => {
        const Obj = {}
        if (c.country[0] && c.country[0].country_name) {
          Obj.country_name = c.country[0].country_name
        } else {
          Obj.country_name = ''
        }
        if (c.area[0] && c.area[0].area_name) {
          Obj.area_name = c.area[0].area_name
        } else {
          Obj.area_name = ''
        }

        state.ccaList[c.customer_id] = Obj
      })
    },
  },

  actions: {
    async loadCustomers(context, query) {
      try {
        const result = await agent.Customer.all(query)

        const data = result.data.map(k => {
          const rObj = {}
          rObj.id = k.id
          rObj.customer_id = k.customer_id
          rObj.customer_name = k.customer_name
          rObj.customer_name_eng = k.customer_name_eng
          rObj.manager_mei = k.manager_mei
          rObj.manager_sei = k.manager_sei
          if (rObj.mangaer_sei || rObj.manager_mei !== null) {
            rObj.manager_name = `${k.manager_sei} ${k.manager_mei}`
          }
          rObj.mobile = k.mobile
          rObj.customer_id = k.customer_id
          rObj.postcode = k.postcode
          rObj.address1 = k.address1
          rObj.address1_eng = k.address1_eng
          rObj.address2 = k.address2
          rObj.address2_eng = k.address2_eng
          rObj.building = k.building
          rObj.building_eng = k.building_eng
          rObj.manager_firstname = k.manager_firstname
          rObj.manager_lastname = k.manager_lastname
          rObj.tel = k.tel
          rObj.email = k.email
          rObj.fax = k.fax
          rObj.website = k.website
          rObj.wechat = k.wechat
          rObj.line = k.line
          rObj.supplier = k.supplier
          rObj.country_id = k.country_id
          if (rObj.country_id !== null) {
            rObj.country = `${k.country[0].country_name}(+${k.country[0].country_code})`
            rObj.country_name = k.country[0].country_name
            rObj.country_code = k.country[0].country_code
          }

          return rObj
        })
        context.commit('updateCustomers', data)

        context.commit('updateCcaList', result)
      } catch (error) {
        console.log(error)
      }
    },

    async loadCustomer(context, id) {
      const result = await agent.Customer.detail(id)
      context.commit('updateSelectedCustomer', result.data)
    },

    async loadCustomerIds(context) {
      try {
        const result = await agent.Customer.getids()

        context.commit('updateCustomerMaster', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadSupplierIds(context) {
      try {
        const result = await agent.Customer.getsids()

        context.commit('updateSupplierMaster', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadMobileList(context) {
      try {
        const result = await agent.Customer.getMobileNums()

        context.commit('updateMobileNums', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadCustomerNames(context) {
      try {
        const result = await agent.Customer.getids()
        context.commit('updateCustomerName', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async createCustomer(context, customer) {
      await agent.Customer.add(customer)
    },

    async editCustomer(context, customer) {
      await agent.Customer.update(customer)
    },

    async deleteCustomer(context, id) {
      await agent.Customer.delete(id)
      context.dispatch('loadCustomers')
    },
  },
}

export default customerStore
