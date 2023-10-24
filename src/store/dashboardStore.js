import format from 'date-fns/format'
import agent from '../api/agent'

const dashboardStore = {
  namespaced: true,
  state: {
    productiondetails: [],
    productionsum: [],
    arrivalSum: [],
    crushingactualdetails: [],
    arrivalplandetails: [],
    dashboards: [],
    selectedDashboard: undefined,
    crushingDaySum: [],
    blendedDaySum: [],
  },
  getters: {},
  mutations: {
    updateProductiondetails(state, newValue) {
      state.productiondetails = newValue
    },

    updateProductionsum(state, newValue) {
      state.productionsum = newValue
    },

    updateArrivalSum(state, newValue) {
      state.arrivalSum = newValue
    },

    updateCrushingActualdetails(state, newValue) {
      state.crushingactualdetails = newValue
    },

    // 粉砕実績当日集計
    updateCrushingDaySum(state, newValue) {
      state.crushingDaySum = newValue
    },

    updateBlendedDaySum(state, newValue) {
      state.blendedDaySum = newValue
    },
    updateArrivalPlandetails(state, newValue) {
      state.arrivalplandetails = newValue
    },
    updateDashboards(state, newValue) {
      state.dashboards = newValue
    },
    updateSelectedDashboard(state, newValue) {
      state.selectedDashboard = newValue
    },
    clearProductiondetails(state) {
      state.productiondetails = []
    },
    clearProductionsum(state) {
      state.productionsum = []
    },
    clearCrushingActualdetails(state) {
      state.crushingactualdetails = []
    },
    clearArrivalPlandetails(state) {
      state.arrivalplandetails = []
    },
    clearDashboards(state) {
      state.dashboards = []
    },
    clearSelectedDashboard(state) {
      state.selectedDashboard = {}
    },
  },
  actions: {
    async loadProductiondetails(context, routeId) {
      context.commit('app/refreshTime', {}, { root: true })
      const curDate = context.rootState.app.todayWorkDate
      const result = await agent.Production.details({ router: routeId, date: format(curDate, 'yyyy-MM-dd') })

      const data = result.data.map(k => {
        const rObj = {}
        rObj.id = k.id
        rObj.route_id = k.route_id
        rObj.product_id = k.product_id
        rObj.product_name = k.product[0].product_name
        rObj.produced_dt = k.produced_dt.substring(10, 16)

        // rObj.produced_dt = format(new Date(k.produced_dt), 'HH:mm')
        rObj.produced_weight = k.produced_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        rObj.color = 'success'

        return rObj
      })

      context.commit('updateProductiondetails', data)
    },

    // 2022.04.23 入荷実績集計
    async loadArrivalDetailDaySum(context) {
      const result = await agent.ArrivalDetail.sum()

      const data = result.data.map(k => {
        const rObj = {}
        rObj.material_id = k.material_id
        rObj.crushing_status = k.crushing_status
        rObj.arrival_weight = k.arrival_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

        return rObj
      })

      context.commit('updateArrivalSum', data)
    },

    // 2022.04.25  粉砕実績集計取得
    async loadCrushingDaySum(context) {
      const result = await agent.CrushedInfo.DaySum({ wuf: 'mobile' })
      const data = result.data.map(k => {
        const rObj = {}
        rObj.material_id = k.material_id
        rObj.actual_weight = k.actual_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

        return rObj
      })
      context.commit('updateCrushingDaySum', data)
    },

    // 2022.04.30
    async loadBlendedDaySum(context) {
      const result = await agent.Blender.DaySum({ wuf: 'mobile' })
      const data = result.data.map(k => {
        const rObj = {}
        rObj.material_id = k.material_id
        rObj.blended_weight = k.blended_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

        return rObj
      })
      context.commit('updateBlendedDaySum', data)
    },

    async loadProductionsum(context, routeId) {
      context.commit('app/refreshTime', {}, { root: true })
      const curDate = context.rootState.app.todayWorkDate
      const result = await agent.Production.sum({ router: routeId, date: format(curDate, 'yyyy-MM-dd') })

      const data = result.data.map(k => {
        const rObj = {}
        rObj.product_id = k.product_id
        rObj.product_name = k.product[0].product_name
        rObj.produced_weight = k.produced_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

        return rObj
      })

      context.commit('updateProductionsum', data)
    },

    async loadCrushingActualdetails(context) {
      // context.commit('app/refreshTime', {}, { root: true })
      // const curDate = context.rootState.app.todayWorkDate
      // const result = await agent.CrushedInfo.Day({ actual_date: format(curDate, 'yyyy-MM-dd') })
      const result = await agent.CrushedInfo.DayDetails({ wuf: 'mobile' })
      const data = result.data.map(k => {
        const rObj = k

        rObj.actual_date = k.actual_date
        rObj.note = k.note ? k.note : ''
        rObj.actual_weight = k.actual_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

        return rObj
      })
      context.commit('updateCrushingActualdetails', data)
    },

    async loadArrivalDetailsForDS(context) {
      context.commit('app/refreshTime', {}, { root: true })
      const curDate = context.rootState.app.todayWorkDate
      const result = await agent.ArrivalDetail.all({ arrival_date: format(curDate, 'yyyy-MM-dd') })
      const data = result.data.map(k => {
        const rObj = k

        // rObj.actual_date = format(new Date(k.actual_date), 'HH:mm')
        rObj.arrival_date = k.arrival_date.substring(10, 16)
        rObj.note = k.note ? k.note : ''

        // rObj.produced_dt = k.produced_dt.substring(10, 16)
        rObj.arrival_weight = k.arrival_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

        return rObj
      })
      context.commit('updateCrushingActualdetails', data)
    },

    async loadArrivalPlandetails(context, datestr) {
      const result = await agent.ArrivalPlan.details({ date: datestr })

      const data = result.data.map(k => {
        const rObj = {}
        rObj.id = k.id
        rObj.material_id = k.material_id
        rObj.material_name = k.material[0].material_name
        rObj.customer_id = k.customer_id
        rObj.customer_name = k.customer[0].customer_name
        rObj.plan_date = k.plan_date

        rObj.plan_ampm = k.plan_ampm
        rObj.plan_weight = k.plan_weight
        if (rObj.plan_weight !== null) {
          rObj.plan_weight = k.plan_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        }

        return rObj
      })

      context.commit('updateArrivalPlandetails', data)
    },

    async deleteProduction(context, id) {
      await agent.Production.delete(id)
    },

    async deleteCrushingActual(context, id) {
      await agent.CrushingActual.delete(id)
    },
    async loadDashboards(context) {
      context.commit('clearDashboards')
      const result = await agent.Dashboard.all()
      context.commit('updateDashboards', result.data)
    },

    async loadDashboard(context, id) {
      context.commit('clearSelectedDashboard')

      const result = await agent.Dashboard.detail(id)
      context.commit('updateSelectedDashboard', result.data)
    },

    async createDashborad(context, dashboard) {
      const obj = { ...dashboard }
      if (obj.dashboard_image !== '') {
        await agent.Dashboard.uploadPhoto(obj.dashboard_image).then(data => {
          // eslint-disable-next-line no-param-reassign
          obj.dashboard_image = data.data
        })
      } else {
        // eslint-disable-next-line no-param-reassign
        obj.dashboard_image = ''
      }

      await agent.Dashboard.add(obj)
    },
    async editDashborad(context, dashboard) {
      const obj = { ...dashboard }
      if (obj.dashboard_image != null) {
        await agent.Dashboard.uploadPhoto(obj.dashboard_image).then(data => {
          obj.dashboard_image = data.data
        })
      } else {
        delete obj.dashboard_image
      }
      await agent.Dashboard.update(obj)
    },
    async deleteDashborad(context, id) {
      await agent.Dashboard.delete(id)

      // context.dispatch('loadDashboards')
    },
  },
}

export default dashboardStore
