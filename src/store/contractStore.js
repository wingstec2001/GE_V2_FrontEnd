import agent from '../api/agent'

const contractStore = {
  namespaced: true,
  state: {
    materialContracts: [],
    crushedContracts: [],
    pelletContracts: [],

    // contractings: [],
    // contracteds: [],
    selectedContract: '',
    selectedPelletContract: '',
    selectedCrushedContract: '',
    selectedMaterialContract: '',
    contractIds: [],
    contractMaster: {},
  },

  getters: {},

  mutations: {
    updateMaterialContracts(state, newValue) {
      state.materialContracts = newValue

      // state.contractings = state.contractCrusheds.filter(c => c.contract_status === 2)
      // state.contracteds = state.contractCrusheds.filter(c => c.contract_status === 4)
    },

    updateCrushedContracts(state, newValue) {
      state.crushedContracts = newValue

      // state.contractings = state.contractCrusheds.filter(c => c.contract_status === 2)
      // state.contracteds = state.contractCrusheds.filter(c => c.contract_status === 4)
    },

    updatePelletContracts(state, newValue) {
      state.pelletContracts = newValue

      // state.contractings = state.contracts.filter(c => c.contract_status === 2)
      // state.contracteds = state.contracts.filter(c => c.contract_status === 4)
    },

    updateMaterialContract(state, newValue) {
      state.selectedMaterialContract = newValue
    },

    updateCrushedContract(state, newValue) {
      state.selectedCrushedContract = newValue
    },

    updatePelletContract(state, newValue) {
      state.selectedPelletContract = newValue
    },

    updateContactMaster(state, newValue) {
      state.contractMaster = {}
      state.contractIds = newValue.map(v => {
        state.contractMaster[v.contract_id] = v.contract_name

        return v.contract_id
      })
    },

    clearMaterial(state) {
      state.materialContracts = []

      // state.contractings = []
      // state.contracteds = []
      state.selectedMaterialContract = ''
    },

    clearCrushed(state) {
      state.crushedContracts = []
      state.contractings = []
      state.contracteds = []
      state.selectedCrushedContract = ''
    },

    clearPellet(state) {
      state.pelletContracts = []

      // state.contractings = []
      // state.contracteds = []
      state.selectedPelletContract = ''
    },
  },

  actions: {
    // 未粉砕
    async loadMaterialContracts(context, query) {
      context.commit('clearMaterial')
      console.log('loadMaterialContracts')
      const result = await agent.ContractMaterial.all(query)
      context.commit('updateMaterialContracts', result.data)
    },

    // 粉砕済
    async loadCrushedContracts(context, query) {
      context.commit('clearCrushed')
      const result = await agent.ContractCrushed.all(query)
      context.commit('updateCrushedContracts', result.data)
    },

    async loadCrushedContract(context, id) {
      context.commit('clearCrushed')

      const result = await agent.ContractCrushed.detail(id)

      context.commit('updateCrushedContract', result.data)
    },

    async loadMaterialContract(context, id) {
      context.commit('clearMaterial')

      const result = await agent.ContractMaterial.detail(id)

      context.commit('updateMaterialContract', result.data)
    },

    async createMaterialContract(context, contract) {
      await agent.ContractMaterial.add(contract)
    },

    async deleteMaterialContract(context, id) {
      await agent.ContractMaterial.delete(id)
    },

    async createCrushedContract(context, contract) {
      await agent.ContractCrushed.add(contract)
    },

    async editCrushedContract(context, contract) {
      await agent.ContractCrushed.update(contract)
    },

    async deleteCrushedContract(context, id) {
      await agent.ContractCrushed.delete(id)
    },

    async loadPelletContracts(context, query) {
      context.commit('clearPellet')
      const result = await agent.ContractPellet.all(query)
      context.commit('updatePelletContracts', result.data)
    },

    async loadPelletContract(context, id) {
      context.commit('clearPellet')
      const result = await agent.ContractPellet.detail(id)
      context.commit('updatePelletContract', result.data)
    },

    async loadPelletContractIds(context) {
      const result = await agent.ContractPellet.getids()
      context.commit('updateContactMaster', result.data)
    },

    async createPelletContract(context, contract) {
      await agent.ContractPellet.add(contract)
    },

    async editPelletContract(context, contract) {
      await agent.ContractPellet.update(contract)
    },

    async deletePelletContract(context, id) {
      await agent.ContractPellet.delete(id)
    },
  },
}

export default contractStore
