import ApiTwo from './../../services/ApiTwo.service';

const CustomImplementationSchedule = new ApiTwo({
  basePath: 'implementation-schedules',
});

const state = {
  implementationDurationSetting: null,
  implementationSchedules: [],
};

const getters = {
  getImplementationDurationSetting: (state) =>
    state.implementationDurationSetting,
};

const mutations = {
  setImplementationDurationSetting(state, implementationDurationSetting) {
    state.implementationDurationSetting = implementationDurationSetting;
  },
};

const actions = {
  async updateImplementationScheduleDuration(
    { commit },
    { projectId, implementationScheduleDuration },
  ) {
    const data = await CustomImplementationSchedule.setPreviousPath(
      `project/${projectId}`,
    ).post('update-project-duration', {
      implementation_duration: implementationScheduleDuration,
    });
    commit('setImplementationDurationSetting', implementationScheduleDuration);
    return data.data;
  },
  async getImplementationScheduleDuration({ commit }, { projectId }) {
    const data = await CustomImplementationSchedule.setPreviousPath(
      `project/${projectId}`,
    ).get('implementation-schedule-duration');
    commit(
      'setImplementationDurationSetting',
      data?.data?.data?.projectDuration || null,
    );
    return data?.data?.data;
  },
  async updateImplementationSchedule(
    { commit },
    { projectId, implementationScheduleData },
  ) {
    const data = await CustomImplementationSchedule.setPreviousPath(
      `project/${projectId}`,
    ).post('', implementationScheduleData);
    return data.data;
  },
  async deleteImplementationSchedule({ commit }, { rabItemId, projectId }) {
    const data = await CustomImplementationSchedule.setPreviousPath(
      `project/${projectId}`,
    ).delete(rabItemId);
    return data.data;
  },
  async downloadSCurve(_, { projectId }) {
    return await CustomImplementationSchedule
        .setPreviousPath(`project/${projectId}`)
        .download('download-s-curve');
  },
  async showSCurve(_, { projectId }) {
    return await CustomImplementationSchedule
        .setPreviousPath(`project/${projectId}`)
        .download('show-s-curve');
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
