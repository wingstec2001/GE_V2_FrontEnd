import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function isMobile() {
  const flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  )

  return flag
}
const routes = [
  {
    path: '/',
    redirect: to => {
      const userData = JSON.parse(localStorage.getItem('userData'))
      const userRole = userData && userData.roles[0] ? userData.roles[0] : null
      if (!userRole) {
        return { name: 'auth-login', query: to.query }
      }
      if (userRole === 'normal' || userRole === 'Staff') {
        return { name: 'mobile-dashboard' }
      }
      if (isMobile()) {
        return { name: 'mobile-dashboard' }
      }

      return { name: 'dashboard-list' }
    },
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Dashboard.vue'),
  },
  {
    path: '/dashboard-list',
    name: 'dashboard-list',
    component: () => import('@/views/dashboard/DashboardList/DashboardList.vue'),
  },
  {
    path: '/dashboard-create',
    name: 'dashboard-create',
    component: () => import('@/views/dashboard/DashboardCreate/DashboardCreate.vue'),
  },
  {
    path: '/dashboard-edit/:id',
    name: 'dashboard-edit',
    component: () => import('@/views/dashboard/DashboardEdit/DashboardEdit.vue'),
  },

  // contract-material
  {
    path: '/contract-material-list',
    name: 'contract-material-list',
    component: () => import('@/views/contract/Material/List.vue'),
  },
  {
    path: '/contract-material-create',
    name: 'contract-material-create',
    component: () => import('@/views/contract/Material/Create.vue'),
  },
  {
    path: '/contract-material-edit/:id',
    name: 'contract-material-edit',
    component: () => import('@/views/contract/Material/Edit.vue'),
  },
  {
    path: '/material-confirm/:id',
    name: 'material-confirm',
    component: () => import('@/views/contract/Material/Edit.vue'),
  },
  {
    path: '/monthlytransferred-list/:month',
    name: 'monthlytransferred-list',
    component: () => import('@/views/stock/MonthlyTransferred/MonthlyTransferredList.vue'),
  },
  {
    path: '/perettogetsujiinfo/:id',
    name: 'perettogetsujiinfo',
    component: () => import('@/views/stock/MonthlyStocked/PerettoGetsujiInfo.vue'),
  },
  {
    path: '/dailystocked-list/:month',
    name: 'dailystocked-list',
    component: () => import('@/views/stock/DailyStocked/DailyStockedList.vue'),
  },
  {
    path: '/proudctdailydetails/:id',
    name: 'proudctdailydetails',
    component: () => import('@/views/stock/DailyStocked/ProductDailyStocked.vue'),
  },
  {
    path: '/materialdailydetails/:id',
    name: 'materialdailydetails',
    component: () => import('@/views/stock/DailyStocked/MaterialDailyStocked.vue'),
  },
  {
    path: '/crusheddailydetails/:id',
    name: 'crusheddailydetails',
    component: () => import('@/views/stock/DailyStocked/CrushedDailyStocked.vue'),
  },
  {
    path: '/monthlystocked-edit/:month/:id',
    name: 'monthlystocked-edit',
    component: () => import('@/views/stock/MonthlyStocked/MonthlyStockedEdit_old.vue'),
  },
  {
    path: '/monthlystocked-list/:month',
    name: 'monthlystocked-list',
    component: () => import('@/views/stock/MonthlyStocked/MonthlyStockedList.vue'),
  },

  // contract-crushed
  {
    path: '/contract-crushed-list',
    name: 'contract-crushed-list',
    component: () => import('@/views/contract/Crushed/List.vue'),
  },
  {
    path: '/contract-crushed-create',
    name: 'contract-crushed-create',
    component: () => import('@/views/contract/Crushed/Create.vue'),
  },
  {
    path: '/contract-crushed-edit/:id',
    name: 'contract-crushed-edit',
    component: () => import('@/views/contract/Crushed/Edit.vue'),
  },
  {
    path: '/crushed-confirm/:id',
    name: 'crushed-confirm',
    component: () => import('@/views/contract/Crushed/Edit.vue'),
  },

  // contract-pellet
  {
    path: '/contract-pellet-list',
    name: 'contract-pellet-list',
    component: () => import('@/views/contract/Pellet/ContractListV2.vue'),
  },
  {
    path: '/contract-pellet-create',
    name: 'contract-pellete-create',
    component: () => import('@/views/contract/Pellet/Create.vue'),
  },
  {
    path: '/contract-pellet-edit/:id',
    name: 'contract-pellet-edit',
    component: () => import('@/views/contract/Pellet/ContractEdit.vue'),
  },

  // shipping
  {
    path: '/shipping-list',
    name: 'shipping-list',
    component: () => import('@/views/shipping/Shipping/ShippingList.vue'),
  },
  {
    path: '/shipping-create',
    name: 'shipping-create',
    component: () => import('@/views/shipping/Shipping/ShippingCreate.vue'),
  },
  {
    path: '/shipping-edit/:id',
    name: 'shipping-edit',
    component: () => import('@/views/shipping/Shipping/ShippingEdit.vue'),
  },

  // shipped
  {
    path: '/shipped-list',
    name: 'shipped-list',
    component: () => import('@/views/shipping/Shipped/ShippedList.vue'),
  },

  // 材料入荷 一覧
  {
    path: '/arrivalmaterial-list',
    name: 'arrivalmaterial-list',

    component: () => import('@/views/arrival/Material/MaterialList.vue'),
  },

  // 材料入荷 新規
  {
    path: '/arrivalmaterial-create',
    name: 'arrivalmaterial-create',
    component: () => import('@/views/arrival/Material/MaterialCreate.vue'),
  },

  // 材料入荷 変更
  {
    path: '/arrivalmaterial-edit/:id',
    name: 'arrivalmaterial-edit',
    component: () => import('@/views/arrival/Material/MaterialEdit.vue'),
  },

  // ペレット入荷 一覧
  {
    path: '/arrivalpellet-list',
    name: 'arrivalpellet-list',

    component: () => import('@/views/arrival/Pellet/PelletList.vue'),
  },

  // 材料入荷 新規
  {
    path: '/arrivalpellet-create',
    name: 'arrivalpellet-create',
    component: () => import('@/views/arrival/Pellet/PelletCreate.vue'),
  },

  // 材料入荷 変更
  {
    path: '/arrivalpellet-edit/:id',
    name: 'arrivalpellet-edit',
    component: () => import('@/views/arrival/Pellet/PelletEdit.vue'),
  },

  // stock
  {
    path: '/stock-list',
    name: 'stock-list',
    component: () => import('@/views/stock/StockList.vue'),
  },

  // crushingactual
  {
    path: '/crushingactual-list',
    name: 'crushingactual-list',
    component: () => import('@/views/crushing/CrushingActualListV2.vue'),

    // component: () => import('@/views/crushing/CrushingActual/CrushingActualList.vue'),
  },
  {
    path: '/crushingactual-create',
    name: 'crushingactual-create',
    component: () => import('@/views/crushing/CrushingActual/CrushingActualCreate.vue'),
  },
  {
    path: '/crushingactual-edit/:id',
    name: 'crushingactual-edit',
    component: () => import('@/views/crushing/CrushingActual/CrushingActualEdit.vue'),
  },

  // product
  {
    path: '/productmaster-list',
    name: 'productmaster-list',
    component: () => import('@/views/setting/product/ProductMasterList.vue'),
  },

  {
    path: '/productmaster-create',
    name: 'productmaster-create',
    component: () => import('@/views/setting/product/ProductMasterCreate.vue'),
  },
  {
    path: '/productmaster-edit/:id',
    name: 'productmaster-edit',
    component: () => import('@/views/setting/product/ProductMasterEdit.vue'),
  },

  // {
  //   path: '/produce-report',
  //   name: 'produce-report',
  //   component: () => import('@/views/production/ProduceReport/ProduceReport.vue'),
  // },

  // productionactual
  {
    path: '/productionactual-list',
    name: 'productionactual-list',
    component: () => import('@/views/production/ProductionActual/ProductionActualList.vue'),
  },
  {
    path: '/productionactual-create',
    name: 'productionactual-create',
    component: () => import('@/views/production/ProductionActual/ProductionActualCreate.vue'),
  },
  {
    path: '/productionactual-edit/:id',
    name: 'productionactual-edit',
    component: () => import('@/views/production/ProductionActual/ProductionActualEdit.vue'),
  },

  // productionplan
  {
    path: '/productionplan-list',
    name: 'productionplan-list',
    component: () => import('@/views/production/ProductionPlan/ProductionPlanList.vue'),
  },
  {
    path: '/productionplan-create',
    name: 'productionplan-create',
    component: () => import('@/views/production/ProductionPlan/ProductionPlanCreate.vue'),
  },
  {
    path: '/productionplan-edit/:id',
    name: 'productionplan-edit',
    component: () => import('@/views/production/ProductionPlan/ProductionPlanEdit.vue'),
  },

  // reservation
  {
    path: '/reservation-list',
    name: 'reservation-list',
    component: () => import('@/views/reservation/ReservationList/ReservationList.vue'),
  },
  {
    path: '/reservation-create',
    name: 'reservation-create',
    component: () => import('@/views/reservation/ReservationList/ReservationCreate.vue'),
  },
  {
    path: '/reservation-edit/:id',
    name: 'reservation-edit',
    component: () => import('@/views/reservation/ReservationList/ReservationEdit.vue'),
  },
  {
    path: '/reserved-list',
    name: 'reserved-list',
    component: () => import('@/views/reservation/ReservedList/ReservedList.vue'),
  },
  {
    path: '/reserved-edit/:id',
    name: 'reserved-edit',
    component: () => import('@/views/reservation/ReservedList/ReservedEdit.vue'),
  },
  {
    path: '/reserved-contract',
    name: 'reserved-contract',
    component: () => import('@/views/reservation/ReservedContract/ReservedContract.vue'),
  },

  // blender
  {
    path: '/blender-list',
    name: 'blender-list',
    component: () => import('@/views/blender/BlenderList.vue'),
  },

  {
    path: '/blender-create',
    name: 'blender-create',
    component: () => import('@/views/blender/BlenderCreate.vue'),
  },

  {
    path: '/form-layouts',
    name: 'form-layouts',
    component: () => import('@/views/form-layouts/FormLayouts.vue'),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    component: () => import('@/views/pages/account-settings/AccountSettings.vue'),
  },
  {
    path: '/mobile-dashboard',
    name: 'mobile-dashboard',
    component: () => import('@/views/mobile/MobileDashboard.vue'),
    meta: {
      layout: 'mobile',
      title: 'Dashboard',
    },
  },
  {
    path: '/mobile-router/:num',
    name: 'mobile-router',
    component: () => import('@/views/mobile/route/MobileProductionRoute.vue'),
    meta: {
      layout: 'mobile',
      title: 'ルーター',
    },
  },
  {
    path: '/mobile-crushing',
    name: 'mobile-crushing',
    component: () => import('@/views/mobile/crushing/MobileCrushing.vue'),
    meta: {
      layout: 'mobile',
      title: '粉砕',
    },
  },
  {
    path: '/mobile-blender',
    name: 'mobile-blender',
    component: () => import('@/views/mobile/blender/MobileBlender.vue'),
    meta: {
      layout: 'mobile',
      title: 'ブレンダー',
    },
  },

  {
    path: '/mobile-arrivaldetails',
    name: 'mobile-arrivaldetails',
    component: () => import('@/views/mobile/arrivalDetail/MobileArrival.vue'),
    meta: {
      layout: 'mobile',
      title: '入荷',
    },
  },

  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/pages/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },

  // material
  {
    path: '/material-list',
    name: 'material-list',
    component: () => import('@/views/setting/Material/MaterialList.vue'),
    meta: {
      resource: 'material',
      action: 'read',
    },
  },
  {
    path: '/material-create',
    name: 'material-create',
    component: () => import('@/views/setting/Material/MaterialCreate.vue'),
  },
  {
    path: '/material-edit/:id',
    name: 'material-edit',
    component: () => import('@/views/setting/Material/MaterialEdit.vue'),
  },

  // country
  {
    path: '/country-list',
    name: 'country-list',
    component: () => import('@/views/setting/Country/CountryList.vue'),
  },
  {
    path: '/country-create',
    name: 'country-create',
    component: () => import('@/views/setting/Country/CountryCreate.vue'),
  },
  {
    path: '/country-edit/:id',
    name: 'country-edit',
    component: () => import('@/views/setting/Country/CountryEdit.vue'),
  },

  // area
  {
    path: '/area-list',
    name: 'area-list',
    component: () => import('@/views/setting/Area/AreaList.vue'),
  },
  {
    path: '/area-create',
    name: 'area-create',
    component: () => import('@/views/setting/Area/AreaCreate.vue'),
  },
  {
    path: '/area-edit/:id',
    name: 'area-edit',
    component: () => import('@/views/setting/Area/AreaEdit.vue'),
  },

  // customer
  {
    path: '/customer-list',
    name: 'customer-list',
    component: () => import('@/views/setting/Customer/CustomerList.vue'),
  },
  {
    path: '/customer-create',
    name: 'customer-create',
    component: () => import('@/views/setting/Customer/CustomerCreate.vue'),
  },
  {
    path: '/customer-edit/:id',
    name: 'customer-edit',
    component: () => import('@/views/setting/Customer/CustomerEdit.vue'),
  },

  // employee
  {
    path: '/employee-list',
    name: 'employee-list',
    component: () => import('@/views/setting/Employee/EmployeeList.vue'),
  },
  {
    path: '/employee-create',
    name: 'employee-create',
    component: () => import('@/views/setting/Employee/EmployeeCreate.vue'),
  },
  {
    path: '/employee-edit/:id',
    name: 'employee-edit',
    component: () => import('@/views/setting/Employee/EmployeeEdit.vue'),
  },

  // user
  {
    path: '/user-list',
    name: 'user-list',
    component: () => import('@/views/setting/User/UserList.vue'),
  },
  {
    path: '/user-create',
    name: 'user-create',
    component: () => import('@/views/setting/User/UserCreate.vue'),
  },
  {
    path: '/user-edit/:id',
    name: 'user-edit',
    component: () => import('@/views/setting/User/UserEdit.vue'),
  },
  {
    path: '/user-edit-pwd/:id',
    name: 'user-edit-pwd',
    component: () => import('@/views/setting/User/UserEditPwd.vue'),
  },

  // role
  {
    path: '/role-list',
    name: 'role-list',
    component: () => import('@/views/setting/Role/RoleList.vue'),
  },
  {
    path: '/role-create',
    name: 'role-create',
    component: () => import('@/views/setting/Role/RoleCreate.vue'),
  },
  {
    path: '/role-edit/:id',
    name: 'role-edit',
    component: () => import('@/views/setting/Role/RoleEdit.vue'),
  },

  {
    path: '/pages/register',
    name: 'pages-register',
    component: () => import('@/views/pages/Register.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/Error.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// Resolve route duplication
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
