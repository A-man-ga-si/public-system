import ApiTwo from '../../services/ApiTwo.service';

const rabApi = new ApiTwo({
  basePath: 'rab',
});

const state = {
  rabs: [],
};

const getters = {
  getRabs: state => state.rabs,
};

const mutations = {
  setRabs(state, rabs) {
    state.rabs = rabs;
  },
  clearRabs(state) {
    state.rabs = [];
  },
};

const actions = {
  async fetchRab({ commit, state }, { projectId, query, queryCategory }) {
    const data = await rabApi
      .setPreviousPath(`project/${projectId}`)
      .get(
        '',
        query && queryCategory ? `q=${query}&category=${queryCategory}` : null
      );
    commit('setRabs', data.data.data.rabs);
    return data;
  },

  async destroyRab({ commit }, { projectId, rabId }) {
    await rabApi.setPreviousPath(`project/${projectId}`).get(`${rabId}/delete`);
  },

  async updateRab({ commit }, { projectId, rabId, form }) {
    const data = await rabApi
      .setPreviousPath(`project/${projectId}`)
      .post(rabId, form);
    return data;
  },

  async storeRab({ commit }, { projectId, form }) {
    const data = await rabApi
      .setPreviousPath(`project/${projectId}`)
      .post('', form);
    return data;
  },

  async importApendoRab(ctx, { projectId, formData }) {
    return await rabApi.post(`import-apendo-rab`, formData, null, {
      'Content-Type': 'multipart/formdata'
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
