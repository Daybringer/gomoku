import axios from "axios";
import Vue from "vue";

const state = { status: "", profile: {} };

const getters = {
  getProfile: (state) => state.profile,
  isProfileLoaded: (state) => !!state.profile.name,
};

const actions = {
  getUserProfile({ commit, dispatch }) {
    commit("setLoading");

    axios
      .get("api/users/me", {})
      .then((resp) => {
        commit("saveProfile", resp);
      })
      .catch(() => {
        commit("setError");

        dispatch("authLogOut");
      });
  },
  setProfile({ commit, profile }) {
    commit("saveProfile", profile);
  },
};

const mutations = {
  setLoading(state) {
    state.status = "loading";
  },
  saveProfile(state, profile) {
    state.status = "success";
    Vue.set(state, "profile", profile);
  },
  setError(state) {
    state.status = "error";
  },
  authLogOut(state) {
    state.profile = {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
