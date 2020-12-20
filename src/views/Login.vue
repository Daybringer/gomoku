<template>
  <div id="ober-container" :style="cssVars">
    <div class="page-container">
      <h1 class="page-title" id="page-title">Login</h1>
      <div class="form-footer">
        <form @submit="login">
          <fieldset>
            <p id="successField">You have been succesfully logged in</p>
            <p id="errorField">Invalid email or password</p>
            <label for="usernameLogin">Email</label>
            <input
              type="text"
              name="emailLogin"
              id="emailLogin"
              v-model="usernameOrEmail"
            />
            <label for="passwordLogin">Password</label>
            <input
              type="password"
              name="passwordLogin"
              id="passwordLogin"
              v-model="password"
            />
          </fieldset>
          <input
            id="form-footer-submit"
            type="submit"
            value="Log in"
            :style="cssVars"
          />
          <router-link :style="cssVars" class="grad-link" to="register"
            >No account yet?</router-link
          >
        </form>
      </div>
      <a href="/api/auth/google">Google</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: ["logged"],
  components: {},
  data() {
    return {
      colorMain: "#00b3fe",
      colorMainDark: "#00ABF5",
      isInit: false,
      usernameTaken: false,
      usernameModal: false,
      googleMail: null,
      isSignIn: false,
      usernameOrEmail: "",
      password: "",
    };
  },
  computed: {
    cssVars() {
      return {
        "--main": this.colorMain,
        "--mainDark": this.colorMainDark,
      };
    },
  },
  methods: {
    login(e) {
      e.preventDefault();

      const { usernameOrEmail, password } = this.$data;

      console.log(usernameOrEmail, password);

      this.$store
        .dispatch("authenticate", { usernameOrEmail, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch((err) => {});
    },
    googleLogin(e) {
      e.preventDefault();
      this.$store
        .dispatch("authenticateGoogle")
        .then(() => {
          // this.$router.push("/");
        })
        .catch((err) => {});
    },
    // onSuccess(googleUser) {
    //   axios
    //     .post("/api/googleLogin", { email: googleUser.tt.bu })
    //     .then((response) => {
    //       this.googleMail = googleUser.tt.bu;
    //       const { registered, username } = response.data;
    //       if (registered) {
    //         window.localStorage.setItem(
    //           "jwtToken",
    //           response.headers["auth-token"]
    //         );
    //         this.$emit("loggedIn", true, username);
    //         router.push("/");
    //       } else {
    //         // show username modal
    //         this.usernameModal = true;
    //       }
    //     })
    //     .catch((err) => {
    //       if (err) console.log(err);
    //     });
    // },
    // onFailure(err) {
    //   console.log(err);
    // },
    // registerModal() {
    //   let username = document.getElementById("usernameInp").value;
    //   let trimmedUsername = username.trim();
    //   axios
    //     .post("/api/googleRegister", {
    //       email: this.googleMail,
    //       username: trimmedUsername,
    //     })
    //     .then(() => {
    //       this.$emit("loggedIn", true, trimmedUsername);
    //       router.push("/");
    //     })
    //     .catch((err) => {
    //       if (err) console.log(err);
    //     });
    // },
    // closeModal() {
    //   this.usernameModal = false;
    //   this.usernameTaken = false;
    // },
  },
  mounted() {},
};
</script>
<style scoped>
#ober-container {
  position: relative;
  width: 100%;
  height: 100%;
}
#successField {
  display: none;
  color: white;
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  margin: 0;
  outline: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  background-color: #07a301c0;
  -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
  margin-bottom: 30px;
}
#errorField {
  display: none;
  color: white;
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  margin: 0;
  outline: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  background-color: #da3636c0;
  -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
  margin-bottom: 30px;
}
.page-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}
.page-title {
  margin-top: 6vh;
  text-align: center;
  font-weight: 800;
  color: #363636;
  font-size: 3em;
}
.form-footer {
  max-width: 30%;
  padding: 10px 20px;
  background: #f4f7f8;
  margin: 10px auto;
  padding: 20px;
  background: #f4f7f8;
  border-radius: 8px;
  font-family: "Roboto", sans-serif;
}
.form-footer fieldset {
  border: none;
}
.form-footer legend {
  font-size: 1.4em;
  margin-bottom: 10px;
}
.form-footer label {
  display: block;
  margin-bottom: 2px;
  font-weight: 700;
  font-size: 1rem;
  color: var(--main);
}
.form-footer input[type="text"],
.form-footer input[type="date"],
.form-footer input[type="password"],
.form-footer input[type="datetime"],
.form-footer input[type="email"],
.form-footer input[type="number"],
.form-footer input[type="search"],
.form-footer input[type="time"],
.form-footer input[type="url"],
.form-footer textarea,
.form-footer select {
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  font-size: 15px;
  margin: 0;
  outline: 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  background-color: #e8eeef;
  color: #363636;
  -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
  margin-bottom: 30px;
}
.form-footer textarea {
  resize: none;
}
.form-footer input[type="text"]:focus,
.form-footer input[type="date"]:focus,
.form-footer input[type="datetime"]:focus,
.form-footer input[type="email"]:focus,
.form-footer input[type="number"]:focus,
.form-footer input[type="search"]:focus,
.form-footer input[type="time"]:focus,
.form-footer input[type="url"]:focus,
.form-footer textarea:focus,
.form-footer select:focus {
  background: #d2d9dd;
}
.form-footer select {
  -webkit-appearance: menulist-button;
  height: 35px;
}
.form-footer input[type="submit"],
.form-footer input[type="button"] {
  position: relative;
  display: block;
  padding: 0.5rem 0.5rem;
  color: #fff;
  margin: 0 auto;
  background: var(--main);
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  font-style: normal;
  width: 80%;
  border: 1px solid var(--mainDark);
  border-width: 1px 1px 3px;
  border-radius: 1em;
  margin-bottom: 10px;
  cursor: pointer;
}
.form-footer input[type="submit"]:hover,
.form-footer input[type="button"]:hover {
  background: var(--mainDark);
}
.grad-link {
  padding-left: 0.5rem;
  text-decoration: none;
  position: relative;
  display: inline;
  font-size: 1.5em;
  font-weight: 800;
  color: #363636;
  overflow: hidden;
  background: linear-gradient(
    to right,
    var(--main),
    var(--main) 50%,
    #363636 50%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
  background-position: 100%;
  transition: background-position 275ms ease;
}
.grad-link:visited {
  color: black;
}
.grad-link:hover {
  background-position: 0 100%;
}

#form-footer-submit::-moz-focus-inner {
  border: 0;
}

.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.modalBox {
  position: relative;
  background-color: #fefefe;
  margin: 20% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 40%; /* Could be more or less, depending on screen size */
  text-align: center;
}
.modalLabel {
  font-size: 1.5rem;
  color: #363636;
}
.modalInput {
  margin: 0 auto;
  border: 3px #363636 solid;
  line-height: 1.5rem;
  font-size: 1.5rem;
  margin-top: 1rem;
  display: block;
  width: 60%;
  text-align: center;
}
.errorMess {
  color: red;
  display: block;
  margin-top: 0.5rem;
}
.closeModal {
  position: absolute;
  top: 0;
  right: 0.25rem;
  display: block;
  color: #363636;
  cursor: pointer;
}
.modalBtn {
  color: #fff;
  margin: 0 auto;
  background: var(--main);
  text-align: center;
  font-style: normal;
  border: 1px solid var(--mainDark);
  border-width: 1px 1px 3px;
  cursor: pointer;

  margin: 0 auto;
  margin-top: 1rem;
  display: block;
  width: 40%;
  padding: 0.25rem 1rem;
  font-weight: 600;
  border-radius: 4px;
  font-size: 1.5rem;
}

.modalBtn:hover {
  background: var(--mainDark);
}
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .page-title {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .form-footer {
    min-width: 90%;
    margin: 30px auto;
    margin-top: 0px;
    padding: 10px;
    border-radius: 10px;
    font-family: "Roboto", sans-serif;
  }
  .form-footer fieldset {
    border: none;
  }
  .form-footer legend {
    font-size: 1.4em;
    margin-bottom: 10px;
  }
  .form-footer label {
    display: block;
    margin-bottom: 5px;
    font-weight: 700;
    color: var(--main);
  }
  .form-footer input[type="text"],
  .form-footer input[type="date"],
  .form-footer input[type="datetime"],
  .form-footer input[type="email"],
  .form-footer input[type="number"],
  .form-footer input[type="search"],
  .form-footer input[type="time"],
  .form-footer input[type="url"],
  .form-footer textarea,
  .form-footer select {
    font-family: "Roboto", sans-serif;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    font-size: 15px;
    margin: 0;
    outline: 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    background-color: #e8eeef;
    color: #363636;
    -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
    margin-bottom: 15px;
  }

  .form-footer input[type="submit"],
  .form-footer input[type="button"] {
    padding: 0.25rem 1rem;
    font-weight: 600;
    width: 80%;
    border-radius: 4px;
    font-size: 1.5rem;
  }

  #successField {
    margin-bottom: 15px;
  }
  #errorField {
    margin-bottom: 15px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) and (max-width: 1200px) {
  .form-footer {
    min-width: 60%;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .form-footer {
    min-width: 40%;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>
