import agent from '../api/agent'

const countryStore = {
  namespaced: true,
  state: {
    countries: [],
    country: undefined,
    selectedCountry: undefined,
    countryMaster: {},
    countryIds: [],
    countryNames: [],

    // f_countries: [],
  },

  getters: {},

  mutations: {
    updateCountries(state, newValue) {
      state.countries = newValue
    },
    updateSelectedCountry(state, newValue) {
      state.selectedCountry = newValue
    },

    updateCountryMaster(state, newValue) {
      // const key = newValue.country_id
      // if (state.countryMaster[key] === undefined) {
      //   state.countryIds.push(key)
      //   state.countryMaster[key] = newValue.country_name
      // }
      state.countryMaster = {}
      state.countryIds = newValue.map(v => {
        state.countryMaster[v.country_id] = v.country_name

        return v.country_id
      })
    },
    updateCountryNames(state, newValue) {
      // const key = newValue.country_name
      // if (state.countryNames.indexOf(key) === -1) {
      //   state.countryNames.push(key)
      // }
      state.countryNames = newValue.map(v => v.country_name)
    },

    // filterCountries(state, newValue) {
    //   state.f_countries = state.countries.filter(co => {
    //     const cId = newValue.countryId ? co.country_id.toString() === newValue.countryId : true
    //     const cName = newValue.countryName ? co.country_name.toString() === newValue.countryName : true

    //     return cId && cName
    //   })
    // },
  },

  actions: {
    async loadCountries(context, query) {
      try {
        const result = await agent.Country.all(query)
        context.commit('updateCountries', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadCountry(context, id) {
      const result = await agent.Country.detail(id)
      context.commit('updateSelectedCountry', result.data)
    },

    async loadCountryIds(context) {
      try {
        const result = await agent.Country.getids()
        context.commit('updateCountryMaster', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async loadCountryNames(context) {
      try {
        const result = await agent.Country.getids()
        context.commit('updateCountryNames', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async createCountry(context, country) {
      await agent.Country.add(country)
    },

    async editCountry(context, country) {
      await agent.Country.update(country)
    },

    async deleteCountry(context, id) {
      await agent.Country.delete(id)

      // context.dispatch('loadCountries')
    },
  },
}

export default countryStore
