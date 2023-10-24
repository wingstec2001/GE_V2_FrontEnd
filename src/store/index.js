import Vue from 'vue'
import Vuex from 'vuex'
import appConfigStoreModule from '@/core/app-config/appConfigStoreModule'
import materialStore from './materialStore'
import productStore from './productStore'
import productionStore from './productionStore'
import productionplanStore from './productionplanStore'
import countryStore from './countryStore'
import areaStore from './areaStore'
import customerStore from './customerStore'
import arrivalplanStore from './arrivalplanStore'
import arrivalactualStore from './arrivalactualStore'
import crushingplanStore from './crushingplanStore'
import crushingactualStore from './crushingactualStore'
import contractStore from './contractStore'
import vanningStore from './vanningStore'
import userStore from './userStore'
import roleStore from './roleStore'
import employeeStore from './employeeStore'
import dashboardStore from './dashboardStore'
import stockCrushingStore from './stockCrushingStore'
import stockedStore from './stockedStore'
import getsujiInfoStore from './getsujiInfoStore'
import monthlyStockStore from './monthlyStockStore'
import dailyStockStore from './dailyStockStore'
import blenderStore from './blenderStore'
import reserveStore from './reserveStore'
import reservedStore from './reservedStore'
import bidStore from './bidStore'
import getsujiProductStore from './getsujiProductStore'
import getsujiMaterialStore from './getsujiMaterialStore'
import getsujiCrushedStore from './getsujiCrushedStore'

import app from './app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    materialStore,
    productStore,
    productionStore,
    productionplanStore,
    countryStore,
    areaStore,
    customerStore,
    arrivalplanStore,
    arrivalactualStore,
    crushingplanStore,
    crushingactualStore,
    contractStore,
    vanningStore,
    userStore,
    roleStore,
    employeeStore,
    dashboardStore,
    stockCrushingStore,
    appConfig: appConfigStoreModule,
    stockedStore,
    getsujiInfoStore,
    getsujiProductStore,
    getsujiMaterialStore,
    getsujiCrushedStore,
    monthlyStockStore,
    dailyStockStore,
    blenderStore,
    reserveStore,
    reservedStore,
    bidStore,
    app,
  },
})
