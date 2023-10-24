import axios from 'axios'
import axiosRetry from 'axios-retry'

import fileDownload from 'js-file-download'
import router from '@/router'

axiosRetry(axios, {
  retries: 1,
  retryCondition: error => error.response.status === 503,
})
axios.defaults.baseURL = '/api/v1'
const responseBody = response => response.data
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    const accessToken = localStorage.getItem('accessToken')

    // eslint-disable-next-line no-param-reassign
    if (accessToken) config.headers.Authorization = `${accessToken}`

    return config
  },
  error => Promise.reject(error),
)
axios.interceptors.response.use(
  async response => {
    const accessToken = response.headers.authorization

    if (accessToken !== undefined) {
      localStorage.setItem('accessToken', accessToken)
    }

    return response
  },
  error => {
    const { status, config } = error.response

    const accessToken = localStorage.getItem('accessToken')
    switch (status) {
      case 422:
        break
      case 401:
        if (config.headers.Authorization && accessToken !== config.headers.Authorization) {
          config.headers.Authorization = accessToken

          return axios(config)
        }

        router.push({ name: 'auth-login' })
        break
      default:
        break
    }

    return Promise.reject(error)
  },
)

const Auth = {
  login: user => axios.post('/auth/login', user),
  authInfo: () => axios.get('/auth/user-profile'),
  logout: () => axios.post('/auth/logout'),
  uploadPhoto: img => {
    const formData = new FormData()
    formData.append('material_img', img)

    return axios
      .post('/materials/photo', formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody)
  },
  update: material => axios.put(`/materials/${material.id}`, material),
  delete: id => axios.delete(`/materials/${id}`),
  detail: id => axios.get(`/materials/${id}`).then(responseBody),
}

const User = {
  all: query => axios.get('/users', { params: query }).then(responseBody),
  createInfo: () => axios.get('/users/create').then(responseBody),
  add: user => axios.post('/users', user),
  update: user => axios.put(`/users/${user.id}`, user),
  updateInfo: id => axios.get(`/users/${id}/edit`).then(responseBody),
  delete: id => axios.delete(`/users/${id}`),
  detail: id => axios.get(`/users/${id}/edit`).then(responseBody),
}
const Role = {
  all: query => axios.get('/roles', { params: query }).then(responseBody),
  createInfo: () => axios.get('/roles/create').then(responseBody),
  add: role => axios.post('/roles', role),
  update: role => axios.put(`/roles/${role.id}`, role),
  updateInfo: id => axios.get(`/roles/${id}/edit`).then(responseBody),
  delete: id => axios.delete(`/roles/${id}`),
  detail: id => axios.get(`/roles/${id}/edit`).then(responseBody),
}
const Material = {
  all: query => axios.get('/materials', { params: query }).then(responseBody),
  getids: () => axios.get('/materialIds').then(responseBody),
  add: material => axios.post('/materials', material),
  uploadPhoto: img => {
    const formData = new FormData()
    formData.append('material_img', img)

    return axios
      .post('/materials/photo', formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody)
  },
  update: material => axios.put(`/materials/${material.id}`, material),
  delete: id => axios.delete(`/materials/${id}`),
  detail: id => axios.get(`/materials/${id}`).then(responseBody),
}

const Product = {
  all: query => axios.get('/products', { params: query }).then(responseBody),
  add: product => axios.post('/products', product),
  uploadPhoto: img => {
    const formData = new FormData()
    formData.append('product_img', img)

    return axios
      .post('/products/photo', formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody)
  },
  getids: () => axios.get('/productIds').then(responseBody),
  update: product => axios.put(`/products/${product.id}`, product),
  delete: id => axios.delete(`/products/${id}`),
  detail: id => axios.get(`/products/${id}`).then(responseBody),
}

const Production = {
  all: query => axios.get('/productions', { params: query }).then(responseBody),
  details: query => axios.get('/productions/details', { params: query }).then(responseBody),
  sum: query => axios.get('/production/daysum', { params: query }).then(responseBody),
  add: production => axios.post('/productions', production),
  update: production => axios.put(`/productions/${production.id}`, production),
  delete: id => axios.delete(`/productions/${id}`),
  detail: id => axios.get(`/productions/${id}`).then(responseBody),
}

const ProductionPlan = {
  all: query => axios.get('/productionplans', { params: query }).then(responseBody),
  add: productionplan => axios.post('/productionplans', productionplan),
  update: productionplan => axios.put(`/productionplans/${productionplan.id}`, productionplan),
  delete: id => axios.delete(`/productionplans/${id}`),
  detail: id => axios.get(`/productionplans/${id}`).then(responseBody),
}

const Country = {
  all: query => axios.get('/countries', { params: query }).then(responseBody),
  getids: () => axios.get('/countryIds').then(responseBody),
  add: country => axios.post('/countries', country),
  update: country => axios.put(`/countries/${country.id}`, country),
  delete: id => axios.delete(`/countries/${id}`),
  detail: id => axios.get(`/countries/${id}`).then(responseBody),
}

const Area = {
  all: query => axios.get('/areas', { params: query }).then(responseBody),
  getids: () => axios.get('/areaIds').then(responseBody),
  add: area => axios.post('/areas', area),
  update: area => axios.put(`/areas/${area.id}`, area),
  delete: id => axios.delete(`/areas/${id}`),
  detail: id => axios.get(`/areas/${id}`).then(responseBody),
}

const Customer = {
  all: query => axios.get('/customers', { params: query }).then(responseBody),
  getids: () => axios.get('/customerIds').then(responseBody),
  getsids: () => axios.get('./supplierIds').then(responseBody),
  getMobileNums: () => axios.get('/mobileNums').then(responseBody),
  add: customer => axios.post('/customers', customer),
  update: customer => axios.put(`/customers/${customer.id}`, customer),
  delete: id => axios.delete(`/customers/${id}`),
  detail: id => axios.get(`/customers/${id}`).then(responseBody),
}

const ArrivalActual = {
  all: query => axios.get('/arrivalactuals', { params: query }).then(responseBody),
  add: arrivalactual => axios.post('/arrivalactuals', arrivalactual),
  update: arrivalactual => axios.put(`/arrivalactuals/${arrivalactual.arrival_id}`, arrivalactual),
  delete: id => axios.delete(`/arrivalactuals/${id}`),
  detail: id => axios.get(`/arrivalactuals/${id}`).then(responseBody),
  deleteDetail: id => axios.delete(`/arrivalactualdetails/${id}`),
  OrderByDetail: id => axios.get(`/orderbydetail/${id}`).then(responseBody),
  ArrivalActuals: () => axios.get('/arrivalactual').then(responseBody),
  ArrivalActualDetail: id => axios.get(`/arrivalactualdetails/${id}`).then(responseBody),
  updateArrivalActual: arrivalactual => axios.put(`/arrivalactual/${arrivalactual.arrival_id}`, arrivalactual),

  // UpdateArrivalDetail: arrivalactual => axios.put(`/arrivalactualdetails/${arrivalactual.aad_id}`, arrivalactual),

  UpdateArrivalDetail: arrivalDetail => axios.put(`/arrivalactualdetails/${arrivalDetail.aad_id}`, arrivalDetail),
  addArrivalActual: arrivalactual => axios.post('/arrivalactual', arrivalactual),
  addArrivalDetail: arrivalactual => axios.post('/arrivalactualdetails', arrivalactual),
}

// ペレット入荷
const ArrivalPellet = {
  all: query => axios.get('/arrivalpellets', { params: query }).then(responseBody),
  add: arrivalpellet => axios.post('/arrivalpellets', arrivalpellet),
  update: arrivalpellet => axios.put(`/arrivalpellets/${arrivalpellet.aad_id}`, arrivalpellet),
  delete: id => axios.delete(`/arrivalpellets/${id}`),
  detail: id => axios.get(`/arrivalpellets/${id}`).then(responseBody),
}

const CrushingPlan = {
  all: query => axios.get('/crushingplans', { params: query }).then(responseBody),
  add: crushingplan => axios.post('/crushingplans', crushingplan),
  update: crushingplan => axios.put(`/crushingplans/${crushingplan.id}`, crushingplan),
  delete: id => axios.delete(`/crushingplans/${id}`),
  detail: id => axios.get(`/crushingplans/${id}`).then(responseBody),
}

const CrushingActual = {
  all: query => axios.get('/crushingactuals', { params: query }).then(responseBody),
  createInfo: () => axios.get('/crushingactuals/create').then(responseBody),
  details: query => axios.get('/crushingactuals/details', { params: query }).then(responseBody),
  add: crushingactual => axios.post('/crushingactuals', crushingactual),
  update: crushingactual => axios.put(`/crushingactuals/${crushingactual.crushed_id}`, crushingactual),
  delete: id => axios.delete(`/crushingactuals/${id}`),
  detail: id => axios.get(`/crushingactuals/${id}`).then(responseBody),
}

const Blender = {
  all: query => axios.get('/blenders', { params: query }).then(responseBody),
  detail: id => axios.get(`/blenders/${id}`).then(responseBody),
  add: blender => axios.post('/blenders', blender),
  delete: id => axios.delete(`/blenders/${id}`),
  DaySum: query => axios.get('/blender/daysum', { params: query }).then(responseBody),
  addbyweight: info => axios.post('/blender/addbyweight', info),
}

// 未粉砕契約
const ContractMaterial = {
  all: query => axios.get('/contractmaterial', { params: query }).then(responseBody),
  add: contract => axios.post('/contractmaterial', contract),

  // getids: () => axios.get('/contractIds').then(responseBody),
  update: contract => axios.put(`/contractmaterial/${contract.id}`, contract),
  delete: id => axios.delete(`/contractmaterial/${id}`),
  detail: id => axios.get(`/contractmaterial/${id}`).then(responseBody),
}

// 粉砕済契約
const ContractCrushed = {
  all: query => axios.get('/contractcrushed', { params: query }).then(responseBody),
  add: contract => axios.post('/contractcrushed', contract),

  // getids: () => axios.get('/contractIds').then(responseBody),
  update: contract => axios.put(`/contractcrushed/${contract.did}`, contract),
  delete: id => axios.delete(`/contractcrushed/${id}`),
  detail: id => axios.get(`/contractcrushed/${id}`).then(responseBody),
}

// ペレット契約
const ContractPellet = {
  all: query => axios.get('/contracts', { params: query }).then(responseBody),
  add: contract => axios.post('/contracts', contract),
  getids: () => axios.get('/contractIds').then(responseBody),
  update: contract => axios.put(`/contracts/${contract.id}`, contract),
  delete: id => axios.delete(`/contracts/${id}`),
  detail: id => axios.get(`/contracts/${id}`).then(responseBody),
}

const Vanning = {
  all: query => axios.get('/vannings', { params: query }).then(responseBody),
  add: vanning => axios.post('/vannings', vanning),
  detail: id => axios.get(`/vannings/${id}`).then(responseBody),
  update: vanning => axios.put(`/vannings/${vanning.vanning_id}`, vanning),
}

const Dashboard = {
  all: () => axios.get('/dashboard').then(responseBody),
  add: dashboard => axios.post('/dashboard', dashboard),
  uploadPhoto: img => {
    const formData = new FormData()
    formData.append('dashboard_image', img)

    return axios
      .post('/dashboard/photo', formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then(responseBody)
  },
  update: dashboard => axios.put(`/dashboard/${dashboard.id}`, dashboard),
  detail: id => axios.get(`/dashboard/${id}`).then(responseBody),
  delete: id => axios.delete(`/dashboard/${id}`),
}

const Employee = {
  all: query => axios.get('/employees', { params: query }).then(responseBody),
  add: employee => axios.post('/employees', employee),
  getids: () => axios.get('/employeeIds').then(responseBody),
  update: employee => axios.put(`/employees/${employee.id}`, employee),
  delete: id => axios.delete(`/employees/${id}`),
  detail: id => axios.get(`/employees/${id}`).then(responseBody),
}
const StockCrushing = {

  allWithCrushed: query => axios.get('/stock-crushed', { params: query }).then(responseBody),
  inhouse: () => axios.get('/stock-crushed/inhouse').then(responseBody),
  arrived: () => axios.get('/stock-crushed/arrived').then(responseBody),

  createInfo: () => axios.get('/stock-crushed/create').then(responseBody),

  // add: role => axios.post('/stock-crushed', role),
  // update: role => axios.put(`/stock-crushed/${role.id}`, role),
  updateInfo: id => axios.get(`/stock-crushed/${id}/edit`).then(responseBody),
  delete: id => axios.delete(`/stock-crushed/${id}`),
  detail: id => axios.get(`/stock-crushed/${id}/edit`).then(responseBody),
}
const Perform = {
  performCrushing: request => axios.post('/perform-curshing', request),
  Blending: request => axios.post('/perform-blending', request),
}
const Setting = {
  all: query => axios.get('/setting', { params: query }).then(responseBody),
}
const CrushedInfo = {
  DayDetails: query => axios.get('/crushed-info', { params: query }).then(responseBody),
  DaySum: query => axios.get('/crushed-info/daysum', { params: query }).then(responseBody),
}
const Stocked = {
  allMaterials: query => axios.get('/stock-material', { params: query }).then(responseBody),
  allProducts: query => axios.get('/stock-product', { params: query }).then(responseBody),
  allCrushed: query => axios.get('/view-stock-crushed', { params: query }).then(responseBody),
}
const Report = {
  /**
   * Assign the project to an employee.
   * @param {Object} info - The employee who is responsible for the project.
   * @param {string} info.date - report month i.e.202112
   * @param {string} info.data - post body
   */
  /*eslint-disable*/
  monthlyReportDownload: info =>
    axios.post(`/monthlyreport/${info.date}`, info.data, { responseType: 'arraybuffer' }).then(res => {
      const content = res.headers['content-disposition']
      let filename = 'report.xlsx'
      if (content) {
        let name1 = content.match(/filename=(.*);/)[1] // filename
        let name2 = content.match(/filename\*=(.*)/)[1] // filename*
        name1 = decodeURIComponent(name1.replaceAll('"', ''))
        name2 = decodeURIComponent(name2.substring(7)) //
        filename = name2 || name1
      }
      fileDownload(res.data, filename)
    }),
  crushedStockReportDownload: () =>
    axios.get('/crushedstockreport', { responseType: 'arraybuffer' }).then(res => {
      const content = res.headers['content-disposition']
      let filename = 'report.xlsx'
      if (content) {
        let name1 = content.match(/filename=(.*);/)[1] // filename
        let name2 = content.match(/filename\*=(.*)/)[1] // filename*
        name1 = decodeURIComponent(name1.replaceAll('"', ''))
        name2 = decodeURIComponent(name2.substring(7)) //
        filename = name2 || name1
      }
      fileDownload(res.data, filename)
    }),
  /*eslint-disable*/
}
const GetsujiInfo = {
  all: query => axios.get('/getsuji-info', { params: query }).then(responseBody),
  detail: id => axios.get(`/getsuji-info/${id}`).then(responseBody),
  update: info => axios.put(`/getsuji-info/${info.id}`, info),
}

const GetsujiProduct = {
  all: query => axios.get('/getsuji-product', { params: query }).then(responseBody),
  detail: id => axios.get(`/getsuji-product/${id}`).then(responseBody),
  update: product => axios.put(`/getsuji-product/${product.id}`, product),
  updatelastmonth: product=> axios.put(`/getsuji-product/bymonth`, product),
}

const GetsujiMaterial = {
  all: query => axios.get('/getsuji-material', { params: query }).then(responseBody),
  detail: id => axios.get(`/getsuji-material/${id}`).then(responseBody),
  update: material => axios.put(`/getsuji-material/${material.id}`, material),
}

const GetsujiCrushed = {
  all: query => axios.get('/getsuji-crushed', { params: query }).then(responseBody),
  detail: id => axios.get(`/getsuji-crushed/${id}`).then(responseBody),
  update: crushed => axios.put(`/getsuji-crushed/${crushed.id}`, crushed),
}

const MonthlyStock = {
  allProduct: query => axios.get('/monthly-stock', { params: query }).then(responseBody),
  allMaterial: query => axios.get('/monthly-stock', { params: query }).then(responseBody),
  allCrushed: query => axios.get('/monthly-stock', { params: query }).then(responseBody),
}

const DailyStock = {
  allProduct: query => axios.get('/dailystock-product', { params: query }).then(responseBody),
  allMaterial: query => axios.get('/dailystock-material', { params: query }).then(responseBody),
  allCrushed: query => axios.get('/dailystock-crushed', { params: query }).then(responseBody),
  recalMaterial:query => axios.get('/recalculate-material', { params: query }).then(responseBody),
  recalCrushed:query => axios.get('/recalculate-crushed', { params: query }).then(responseBody),
  recalPellet:query => axios.get('/recalculate-product', { params: query }).then(responseBody),
}

const ArrivalDetail = {
  // 2022.04.19
  all: query => axios.get('/arrivaldetails', { params: query }).then(responseBody),
  sum: query => axios.get('/arrivaldetails/daysum', { params: query }).then(responseBody),
}

// const Reserve = {
//   all: query => axios.get('/reserve', { params: query }).then(responseBody),
//   add: reserve => axios.post('/reserve', reserve),
//   uploadPhoto: imgs => {
//     const formData = new FormData()
//     for (let i = 0; i < imgs.length; i += 1) {
//       // if (typeof imgs[i] === 'object') {
//       formData.append('reserve_images[]', imgs[i])

//       // }
//     }

//     return axios
//       .post('/reserve/photo', formData, {
//         headers: { 'Content-type': 'multipart/form-data' },
//       })
//       .then(responseBody)
//   },
//   update: reserve => axios.put(`/reserve/${reserve.id}`, reserve),
//   detail: id => axios.get(`/reserve/${id}`).then(responseBody),
//   delete: id => axios.delete(`/reserve/${id}`),
// }

// const Reserved = {
//   all: query => axios.get('/reserved', { params: query }).then(responseBody),
//   detail: id => axios.get(`/reserved/${id}`).then(responseBody),
//   update: reserved => axios.put(`/reserved/${reserved.id}`, reserved),
// }

// const Bid = {
//   all: query => axios.get('/bid', { params: query }).then(responseBody),
//   add: bid => axios.post('/bid', bid),
//   uploadPhoto: imgs => {
//     const formData = new FormData()
//     for (let i = 0; i < imgs.length; i += 1) {
//       // if (typeof imgs[i] === 'object') {
//       formData.append('bid_images[]', imgs[i])

//       // }
//     }

//     return axios
//       .post('/bid/photo', formData, {
//         headers: { 'Content-type': 'multipart/form-data' },
//       })
//       .then(responseBody)
//   },
//   update: bid => axios.put(`/bid/${bid.id}`, bid),
//   detail: id => axios.get(`/bid/${id}`).then(responseBody),
//   delete: id => axios.delete(`/bid/${id}`),
// }

const agent = {
  Material,
  Product,
  Production,
  ProductionPlan,
  Country,
  Area,
  Customer,

  ArrivalActual,
  ArrivalDetail,
  ArrivalPellet,
  CrushingPlan,
  CrushingActual,
  ContractMaterial,
  ContractCrushed,
  ContractPellet,
  Vanning,
  Auth,
  User,
  Role,
  Employee,
  Dashboard,
  StockCrushing,
  Perform,
  Setting,
  CrushedInfo,
  Stocked,
  Report,
  GetsujiInfo,
  MonthlyStock,
  DailyStock,
  Blender,
  GetsujiProduct,
  GetsujiMaterial,
  GetsujiCrushed,
}

export default agent
