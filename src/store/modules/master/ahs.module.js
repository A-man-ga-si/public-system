import ApiTwo from '../../../services/ApiTwo.service';

const masterAhsApi = new ApiTwo({
  previousPath: 'master',
  basePath: 'ahs',
});

const state = {
  ahs: [],
  ahsCount: 0,
  ahsIds: [],
};

const getters = {
  getAhs: (state) => state.ahs,
  getAhsIds: (state) => {
    state.ahsIds.map((d) => {
      d.id_name = `${d.id} | ${d.name}`;
      return d;
    });
    return state.ahsIds;
  },
  getMappedAhsIds: (state) => {
    const groupedAhs = {};
    for (const ahs of state.ahsIds) {
      ahs.id_name = `${ahs.id} | ${ahs.name}`;
      if (!groupedAhs[ahs.groups]) {
        groupedAhs[ahs.groups] = [ahs];
      } else {
        groupedAhs[ahs.groups].push(ahs);
      }
    }
    return groupedAhs;
  },
  getAhsCount: (state) => state.ahsCount,
};

const mutations = {
  setAhs(state, ahs) {
    state.ahs = ahs;
  },

  setAhsIds(state, ahsIds) {
    state.ahsIds = ahsIds;
  },

  setAhsCount(state, ahsCount) {
    state.ahsCount = ahsCount;
  },

  emptyAhs(state) {
    state.ahs = [];
  },
};

const actions = {
  async fetchAhs(
    { commit },
    { province, page, perPage, selectedAhsGroup, searchQuery },
  ) {
    let params = new URLSearchParams({
      arrange: true,
      province: province,
      page: page || 1,
      per_page: perPage || 10,
    });
    const optionalParams = {
      q: searchQuery,
      selected_ahs_group: selectedAhsGroup,
    };
    for (const [key, value] of Object.entries(optionalParams)) {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    }
    const data = await masterAhsApi.get('', decodeURIComponent(params));
    commit('setAhs', data.data.data.ahs);
    commit('setAhsCount', data.data.data.pagination_attribute.total_rows);
    return data;
  },

  async storeAhs(ctx, payload) {
    return await masterAhsApi.post('', payload);
  },

  async destroyAhs(ctx, ahsId) {
    return await masterAhsApi.get(`${ahsId}/delete`);
  },

  async updateAhs(ctx, { ahsId, form }) {
    return await masterAhsApi.post(`${ahsId}/update`, form);
  },

  async fetchAhsIds({ commit }) {
    const data = await masterAhsApi.get(`ids`);
    commit('setAhsIds', data.data.data.ahses);
    return data;
  },

  async exportMasterAhs(ctx) {
    return await masterAhsApi.download(`export`);
  },

  async importMasterAhs(ctx, { formData }) {
    return await masterAhsApi.post('import', formData, null, {
      'Content-Type': 'multipart/formdata',
    });
  },

  async fetchMasterAhsProject(_, { q, limit, group }) {
    const response = await masterAhsApi.get(
      'project',
      `q=${q}&limit=${limit}&group=${group}`,
    );
    return response.data;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
