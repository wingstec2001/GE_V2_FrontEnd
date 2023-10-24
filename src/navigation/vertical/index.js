/* eslint-disable no-unused-vars */
import {
  mdiFileOutline,
  mdiCogOutline,
  mdiBriefcase,
  mdiAccountGroup,
  mdiCube,
  mdiViewList,
  mdiMessageTextClockOutline,
  mdiFileDocumentEdit,
  mdiFileClockOutline,
  mdiClipboardListOutline,
  mdiClipboardArrowUpOutline,
  mdiEarth,
  mdiMapMarkerMultiple,
  mdiDrawingBox,
  mdiClipboardCheckMultipleOutline,
  mdiClipboardFlowOutline,
  mdiAccount,
  mdiCart,
  mdiBadgeAccount,
  mdiCarLiftedPickup,
} from '@mdi/js'

// import others from './others'

export default [
  {
    title: 'Dashboard',

    // to: { name: 'dashboard' },
    icon: mdiCube,

    // resource: '',
    children: [
      {
        title: '当日',
        to: { name: 'mobile-dashboard' },
        icon: mdiCube,
        resource: 'dashboard',
        action: 'read',
      },

      {
        title: '編集',
        to: { name: 'dashboard-list' },
        icon: mdiViewList,
        resource: 'mobileDashboard',
        action: 'create',
      },
    ],
  },

  {
    title: '生産管理',
    icon: mdiClipboardListOutline,
    children: [

      {
        title: '材料入荷',
        to: { name: 'arrivalmaterial-list' },
        icon: mdiClipboardCheckMultipleOutline,
        resource: 'arrivalMaterial',
        action: 'read',
      },

      {
        title: 'ペレット入荷',
        to: { name: 'arrivalpellet-list' },
        icon: mdiClipboardFlowOutline,
        resource: 'arrivalPellet',
        action: 'read',
      },
      {
        title: '粉砕実績',
        to: { name: 'crushingactual-list' },
        icon: mdiClipboardCheckMultipleOutline,
        resource: 'crushingActual',
        action: 'read',
      },
      {
        title: 'ブレンド実績',
        to: { name: 'blender-list' },
        icon: mdiClipboardCheckMultipleOutline,
        resource: 'blender',
        action: 'read',
      },

      // {
      //   title: '生産計画',
      //   to: { name: 'productionplan-list' },
      //   icon: mdiClipboardFlowOutline,
      //   resource: 'productionPlan',
      //   action: 'read',
      // },

      {
        title: 'ペレット実績',
        to: { name: 'productionactual-list' },
        icon: mdiClipboardCheckMultipleOutline,
        resource: 'production',
        action: 'read',
      },
    ],
  },
  {
    title: '在庫',
    icon: mdiCart,
    children: [
      {
        title: '現在在庫',
        to: { name: 'stock-list', query: { selTab: 'product' } },
        icon: mdiViewList,
        resource: 'stock',
        action: 'read',
      },
      {
        title: '月末繰越',
        to: {
          name: 'monthlystocked-list',
          params: {
            // month: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 7).replace('-', ''),
            // time go back 8 hours
            month: new Date(Date.now() - new Date().getTimezoneOffset() * 60000 - 28800000).toISOString().substring(0, 7).replace('-', ''),
          },
          query: { selTab: 'product' },
        },
        icon: mdiViewList,
        resource: 'stock',
        action: 'read',
      },
      {
        title: '月次入出庫',
        to: {
          name: 'monthlytransferred-list',
          params: {
            // month: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 7).replace('-', ''),
            // time go back 8 hours
            month: new Date(Date.now() - new Date().getTimezoneOffset() * 60000 - 28800000).toISOString().substring(0, 7).replace('-', ''),
          },
          query: { selTab: 'product' },
        },
        icon: mdiViewList,
        resource: 'stock',
        action: 'read',
      },
    ],
  },

  {
    title: '契約',
    icon: mdiFileOutline,
    children: [
      {
        title: '未粉砕',
        to: { name: 'contract-material-list' },
        icon: mdiViewList,
        resource: 'contract-material',
        action: 'read',
      },
      {
        title: '粉砕済',
        to: { name: 'contract-crushed-list' },
        icon: mdiViewList,
        resource: 'contract-crushed',
        action: 'read',
      },

      {
        title: 'ペレット',
        to: { name: 'contract-pellet-list' },
        icon: mdiViewList,
        resource: 'contract-pellet',
        action: 'read',
      },

      // {
      //   title: '出荷準備',
      //   to: { name: 'shipping-list' },
      //   icon: mdiViewList,
      //   resource: 'shipping',
      //   action: 'read',
      // },
      // {
      //   title: '出荷済',
      //   to: { name: 'shipped-list' },
      //   icon: mdiViewList,
      //   resource: 'shipped',
      //   action: 'read',
      // },

      // {
      //   title: '出荷済一覧',
      //   to: { name: 'contracted-list' },
      //   icon: mdiViewList,
      //   resource: 'contracted',
      //   action: 'read',
      // },
    ],
  },

  // {
  //   title: '出荷管理',
  //   icon: mdiCarLiftedPickup,
  //   children: [
  //     {
  //       title: '出荷準備',
  //       to: { name: 'shipping-list' },
  //       icon: mdiViewList,
  //       resource: 'shipping',
  //       action: 'read',
  //     },
  //     {
  //       title: '出荷済',
  //       to: { name: 'shipped-list' },
  //       icon: mdiViewList,
  //       resource: 'shipped',
  //       action: 'read',
  //     },
  //   ],
  // },
  {
    title: '各種設定',
    icon: mdiCogOutline,
    children: [
      {
        title: '材料登録',
        to: { name: 'material-list' },
        icon: mdiCube,
        resource: 'material',
        action: 'read',
      },
      {
        title: 'ペレット登録',
        to: { name: 'productmaster-list' },
        icon: mdiDrawingBox,
        resource: 'product',
        action: 'read',
      },
      {
        title: '取引先',
        to: { name: 'customer-list' },
        icon: mdiBriefcase,
        resource: 'customer',
        action: 'read',
      },
      {
        title: '社員',
        to: { name: 'employee-list' },
        icon: mdiAccountGroup,
        resource: 'employee',
        action: 'read',
      },
      {
        title: 'ユーザー',
        to: { name: 'user-list' },
        icon: mdiAccount,
        resource: 'user',
        action: 'read',
      },
      {
        title: '権限',
        to: { name: 'role-list' },
        icon: mdiBadgeAccount,
        resource: 'role',
        action: 'read',
      },
      {
        title: '国・地域',
        to: { name: 'country-list' },
        icon: mdiEarth,
        resource: 'country',
        action: 'read',
      },
      {
        title: '都市',
        to: { name: 'area-list' },
        icon: mdiMapMarkerMultiple,
        resource: 'area',
        action: 'read',
      },
    ],
  },
]

// Array of sections
// export default [...others]
