import agent from '@/api/agent'

export default {
  namespaced: true,
  state: {
    OverlayStatus: false,
    shallContentShowOverlay: false,
    workstarttime: '00:00:00',
    workStartTimeMillisecond: 0,
    nextRefreshTime: 100000,
    todayWorkDate: new Date(),

    clientHeight: document.documentElement.clientHeight,

  },
  getters: {},
  mutations: {
    TOGGLE_CONTENT_OVERLAY(state, value) {
      state.shallContentShowOverlay = value !== undefined ? value : !state.shallContentShowOverlay
    },
    updateWorkStartTime(state, newValue) {
      state.workstarttime = newValue
      const time = newValue.split(':')
      const hour = time[0] * 60 * 60 * 1000
      const min = time[1] * 60 * 1000
      const sec = time[2] * 1000

      state.workStartTimeMillisecond = hour + min + sec
    },
    updateClientHeight(state, newValue) {
      state.clientHeight = newValue
    },
    refreshTime(state) {
      state.todayWorkDate = new Date(new Date().getTime() - state.workStartTimeMillisecond)
    },
    setOverlayStatus(state, newValue) {
      state.OverlayStatus = newValue
    },
  },
  actions: {
    async loadSetting(context) {
      try {
        const result = await agent.Setting.all()
        context.commit('updateWorkStartTime', result.data.workstarttime)
        context.commit('refreshTime')
      } catch (error) {
        console.log(error)
      }
    },

  },
}
