import ApiTwo from './../../services/ApiTwo.service';

const CustomAhsApi = new ApiTwo({
  basePath: 'custom-ahs',
  customAhs: []
});

const state = {
  customAhs: [],
};

const getters = {
  getCustomAhs: state => state.customAhs,
};

const mutations = {
  setCustomAhs(state, customAhs) {
    state.customAhs = customAhs;
  },
};

const actions = {
  async fetchCustomAhs({ commit, state }, { projectId, page, perPage }) {
    // prettier-ignore
    const data = await CustomAhsApi.setPreviousPath(`project/${projectId}`).get('', `arrange=true&page=${page}&per_page=${perPage}`);
    commit('setCustomAhs', data.data.data)
    return data;
  },

  async fetchCustomAhsIds(ctx, { projectId, q='', limit }) {
    let queryString = `q=${q}`;
    if (limit != null) {
      queryString = queryString.concat(`&limit=${limit}`)
    }
    const data = await CustomAhsApi
      .setPreviousPath(`project/${projectId}`)
      .get('ids', queryString);
    return data;
  },

  async storeCustomAhs(ctx, { projectId, form }) {
    // prettier-ignore
    const data = await CustomAhsApi.setPreviousPath(`project/${projectId}`).post('', form);
    return data;
  },

  async deleteCustomAhs(ctx, { projectId, customAhsId }) {
    const data = await CustomAhsApi.setPreviousPath(`project/${projectId}`).get(
      `${customAhsId}/delete`
    );
    return data;
  },

  async updateCustomAhs(ctx, { projectId, customAhsId, form }) {
    const data = await CustomAhsApi.setPreviousPath(
      `project/${projectId}`
    ).post(customAhsId, form);
    return data;
  },

  async queryCustomAhs(_, { projectId, query, category }) {
    const params = new URLSearchParams({
        q: query,
        category: category,
        arrange: true
    });
    const response = await CustomAhsApi
        .setPreviousPath(`project/${projectId}`)
        .get('query', decodeURIComponent(params));
    return response;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
