// import format from 'date-fns/format'
import agent from '../api/agent'

const arrivalactualStore = {
  namespaced: true,
  state: {
    arrivalactuals: [],
    actuals: [],

    arrivalactual: undefined,
    selectedArrivalActual: undefined,
    selectedOrderByDetail: undefined,
    selectedArrivalDetail: undefined,
    selectedArrivalPellet: undefined,
    f_arrivalactuals: [],
    arrivaldetails: [], // 2022.04.18
    arrivalPellets: [],
  },

  getters: {},

  mutations: {
    updateArrivalActuals(state, newValue) {
      state.arrivalactuals = newValue
    },

    updateActuals(state, newValue) {
      state.actuals = newValue
    },

    updateArrivalDetails(state, newValue) {
      state.arrivaldetails = newValue
    },

    // ペレット
    updateArrivalPellets(state, newValue) {
      state.arrivalPellets = newValue
    },

    updateSelectedArrivalActual(state, newValue) {
      state.selectedArrivalActual = newValue

      state.selectedArrivalActual.actual_date = newValue.actual_date.substring(0, 16)

      state.selectedArrivalActual.details = newValue.details.map((ad, index) => {
        const detail = {}
        detail.aad_id = ad.aad_id
        detail.detail_id = index + 1
        detail.product_id = ad.product_id
        detail.arrival_weight = ad.arrival_weight.toString()
        detail.arrival_goods_name = ad.product[0].product_name
        detail.crushing_status = ad.crushing_status
        detail.arrival_date = ad.arrival_date
        detail.state = 0

        return detail
      })
    },

    updateSelectedArrivalDetail(state, newValue) {
      state.selectedArrivalDetail = newValue
    },

    updateSelectedArrivalPellet(state, newValue) {
      state.selectedArrivalPellet = newValue
    },
    updateOrderByDetail(state, newValue) {
      state.selectedOrderByDetail = newValue.map(ad => {
        const rObj = {}
        rObj.aad_id = ad.aad_id
        rObj.product_id = ad.product_id
        rObj.arrival_weight = ad.arrival_weight
        rObj.arrival_goods_name = ad.product[0].product_name
        rObj.arrival_date = ad.arrival_date
        rObj.crushing_status = ad.crushing_status === 0 ? '未粉砕' : '粉砕済'

        return rObj
      })
    },

    filterArrivalActuals(state, newValue) {
      state.f_arrivalactuals = state.actuals.filter(aa => {
        const cId = newValue.customerId ? aa.customer_id.toString() === newValue.customerId : true
        const sDate = newValue.startDate ? new Date(aa.actual_date) >= new Date(newValue.startDate) : true
        const eDate = newValue.endDate ? new Date(aa.actual_date) <= new Date(newValue.endDate) : true

        return cId && sDate && eDate
      })
    },
  },

  actions: {
    // PC側 入荷実績を取る
    async loadArrivalAll(context, query) {
      try {
        const result = await agent.ArrivalActual.all(query)
        context.commit('updateArrivalActuals', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    // Mobile側 入荷実績を取る
    async loadArrivalActuals(context, query) {
      try {
        const result = await agent.ArrivalActual.all(query)
        context.commit('updateArrivalActuals', result.data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadActuals(context, params) {
      try {
        const result = await agent.ArrivalActual.ArrivalActuals(params)
        const data = result.data.map(k => {
          const rObj = {}

          rObj.arrival_id = k.arrival_id
          rObj.customer_id = k.customer_id
          rObj.customer_name = k.customer[0].customer_name
          rObj.actual_date = k.actual_date.substring(0, 16)
          rObj.arrival_note = k.arrival_note

          return rObj
        })
        context.commit('updateActuals', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadArrivalDetails(context, query) {
      try {
        const result = await agent.ArrivalDetail.all(query)
        const data = result.data.map(k => {
          const rObj = {}
          rObj.aad_id = k.aad_id
          rObj.arrival_id = k.arrival_id
          rObj.material_id = k.material_id
          rObj.material_name = k.material_name
          rObj.arrival_date = k.arrival_date.substring(0, 16)
          rObj.arrival_weight = k.arrival_weight
          rObj.crushing_status = k.crushing_status
          rObj.customer_id = k.customer_id
          rObj.rowno = k.rowno
          rObj.note = k.note
          rObj.blended = k.blended

          return rObj
        })
        context.commit('updateArrivalDetails', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadArrivalActual(context, id) {
      const result = await agent.ArrivalActual.detail(id)
      context.commit('updateSelectedArrivalActual', result.data)
    },

    async loadArrivalActualDetail(context, id) {
      const result = await agent.ArrivalActual.ArrivalActualDetail(id)
      context.commit('updateSelectedArrivalDetail', result.data)
    },

    // 2022.04.20
    async loadArrivalDetail(context, id) {
      const result = await agent.ArrivalActual.ArrivalActualDetail(id)
      context.commit('updateSelectedArrivalDetail', result.data)
    },

    // 2022.11.24
    async loadArrivalPellets(context, query) {
      try {
        const result = await agent.ArrivalPellet.all(query)
        const data = result.data.map(k => {
          const rObj = {}
          rObj.aad_id = k.aad_id
          rObj.product_id = k.product_id

          // rObj.material_name = k.material_name
          rObj.arrival_date = k.arrival_date.substring(0, 16)
          rObj.arrival_weight = k.arrival_weight

          rObj.customer_id = k.customer_id
          rObj.note = k.note

          return rObj
        })
        context.commit('updateArrivalPellets', data)
      } catch (error) {
        console.log(error)
      }
    },

    async loadArrivalPellet(context, id) {
      console.log('store loadArrivalPellet:', id)
      const result = await agent.ArrivalPellet.detail(id)
      console.log('result:', result.data)
      context.commit('updateSelectedArrivalPellet', result.data)
    },

    async loadOrderByDetail(context, id) {
      const result = await agent.ArrivalActual.OrderByDetail(id)
      context.commit('updateOrderByDetail', result.data)
    },

    async createArrivalActual(context, arrivalactual) {
      await agent.ArrivalActual.add(arrivalactual)
    },

    async createArrivalPellet(context, arrivalpellet) {
      await agent.ArrivalPellet.add(arrivalpellet)
    },

    async editArrivalActual(context, arrivalactual) {
      await agent.ArrivalActual.update(arrivalactual)
    },

    async editArrivalPellet(context, arrivalPellet) {
      await agent.ArrivalPellet.update(arrivalPellet)
    },

    async deleteArrivalActual(context, id) {
      await agent.ArrivalActual.delete(id)
    },

    // 2022.04.20
    async deleteArrivalDetail(context, id) {
      await agent.ArrivalActual.deleteDetail(id)
    },

    async deleteTodayArrivalActual(context, id) {
      await agent.ArrivalActual.delete(id)
    },

    // ペレット入荷 削除
    async deleteArrivalPellet(context, id) {
      await agent.ArrivalPellet.delete(id)
    },
    async deleteTodayArrivalDetails(context, id) {
      await agent.ArrivalActual.deleteDetail(id)
    },

    async editTodayArrivalActual(context, arrivalactual) {
      await agent.ArrivalActual.updateArrivalActual(arrivalactual)
    },

    async editTodayArrivalDetail(context, arrivalactual) {
      await agent.ArrivalActual.UpdateArrivalDetail(arrivalactual)
    },

    // 2022.04.22
    async editArrivalDetail(context, arrivaldetal) {
      await agent.ArrivalActual.UpdateArrivalDetail(arrivaldetal)
    },

    async createTodayArrivalActual(context, arrivalactual) {
      await agent.ArrivalActual.addArrivalActual(arrivalactual)
    },

    async createTodayArrivalDetail(context, arrivalactual) {
      await agent.ArrivalActual.addArrivalDetail(arrivalactual)
    },
  },
}

export default arrivalactualStore
