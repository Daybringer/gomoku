import axios from "axios";

const state = () => ({
  token: localStorage.getItem("user-token") || "",
  status: "",
  hasLoadedOnce: false,
});

const getters = {
  isAuthenticated: (state) => !!state.token,
  authStatus: (state) => state.status,
};

const actions = {
  authenticate({ commit, dispatch }, { usernameOrEmail, password }) {
    return new Promise((resolve, reject) => {
      commit("setLoading");

      axios
        .post("api/auth/login", { usernameOrEmail, password })
        .then((resp) => {
          const data = resp.data.data;

          const token = data.payload.token;

          localStorage.setItem("user-token", token);
          axios.defaults.headers.common["Authorization"] = token;
          dispatch("setProfile", data.user);
          commit("setSuccess", token);
          resolve(resp);
        })
        .catch((err) => {
          commit("setError");
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },
  saveToken({ commit }, token) {
    localStorage.setItem("user-token", token);
    axios.defaults.headers.common["Authorization"] = token;
    commit("setSuccess", token);
  },
  authLogOut({ commit }) {
    return new Promise((resolve) => {
      commit("authLogOut");
      localStorage.removeItem("user-token");
      resolve();
    });
  },
};

const mutations = {
  setLoading(state) {
    state.status = "loading";
  },
  setSuccess(state, token) {
    state.status = "success";
    state.token = token;
    state.hasLoadedOnce = true;
  },
  setError(state) {
    state.status = "error";
    state.hasLoadedOnce = true;
  },
  authLogOut(state) {
    state.token = "";
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
