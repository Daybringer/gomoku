import axios from "axios";

const state = () => ({
  token: localStorage.getItem("user-token") || "",
  googleIDToken: "",
  refreshToken: "",
  status: "",
});

const getters = {
  isAuthenticated: (state) => !!state.token,
  authStatus: (state) => state.status,
  getGoogleIDToken: (state) => state.googleIDToken,
};

const actions = {
  authenticate({ commit, dispatch }, { usernameOrEmail, password }) {
    return new Promise((resolve, reject) => {
      commit("setLoading");

      axios
        .post("api/auth/login", { usernameOrEmail, password })
        .then((res) => {
          const data = res.data.data;

          const token = data.payload.token;

          localStorage.setItem("user-token", token);
          axios.defaults.headers.common["Authorization"] = token;
          dispatch("setProfile", data.user);
          commit("setSuccess", token);
          resolve(res);
        })
        .catch((err) => {
          commit("setError");
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },
  authenticateGoogle({ commit, dispatch }, { token }) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/auth/google", {
          id_token: token,
        })
        .then((res) => {
          const data = res.data.data;
          if (res.data.success) {
            // Full pledged Google user exists
            const token = data.payload.token;
            localStorage.setItem("user-token", token);
            axios.defaults.headers.common["Authorization"] = token;
            dispatch("setProfile", data.user);
            commit("setSuccess", token);
            resolve({ success: true, data: res });
          } else {
            // Nameless Google User exists => showing modal
            if (data) {
              const id_token = data.id_token;
              commit("setGoogleIDToken", id_token);
              resolve({ success: false, data: id_token });
            } else {
              commit("authLogOut");
              localStorage.removeItem("user-token");
              reject(res.data.errors);
            }
          }
        })
        .catch((err) => {
          commit("authLogOut");
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },
  requsetUsername({ commit, dispatch }, { username, token }) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/auth/setUsername", {
          username,
          id_token: token,
        })
        .then((res) => {
          const data = res.data.data;
          if (res.data.success) {
            const token = data.payload.token;
            localStorage.setItem("user-token", token);
            axios.defaults.headers.common["Authorization"] = token;
            dispatch("setProfile", data.user);
            commit("setSuccess", token);
            resolve(res);
          } else {
            commit("authLogOut");
            localStorage.removeItem("user-token");
            reject(res.data.errors);
          }
        })
        .catch((err) => {
          commit("authLogOut");
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
  setGoogleIDToken(state, id_token) {
    state.googleIDToken = id_token;
  },
  setSuccess(state, token) {
    state.status = "success";
    state.token = token;
  },
  setError(state) {
    state.status = "error";
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
