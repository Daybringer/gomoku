<template>
  <div id="ober-container">
    <div class="page-container" :style="cssVars">
      <h1 class="page-title" :style="cssVars">Register</h1>
      <div class="form-footer" :style="cssVars">
        <form v-on:submit="register">
          <fieldset>
            <p id="successField"></p>
            <p id="errorField"></p>
            <label for="usernameRegister">Username</label>
            <input type="text" name="usernameRegister" id="usernameRegister" />
            <label for="emailRegister">Email</label>
            <input type="text" name="emailRegister" id="emailRegister" />
            <label for="passwordRegister">Password</label>
            <input
              type="password"
              name="passwordRegister"
              id="passwordRegister"
            />
            <label for="passwordRepeatRegister">Confirm Password</label>
            <input
              type="password"
              name="passwordRepeatRegister"
              id="passwordRepeatRegister"
              :style="cssVars"
            />
          </fieldset>
          <input
            id="form-footer-submit"
            type="submit"
            value="Register"
            :style="cssVars"
          />
          <router-link class="grad-link" to="login" :style="cssVars"
            >Log in</router-link
          >
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import router from "../router";
import axios from "axios";
export default {
  name: "Register",
  props: ["logged"],
  computed: {
    cssVars() {
      return {
        "--main": this.colorMain,
        "--second": this.colorSecond,
        "--mainDark": this.colorMainDark,
      };
    },
  },
  data() {
    return {
      colorMain: "#00b3fe",
      colorMainDark: "#00ABF5",
    };
  },
  methods: {
    register: (e) => {
      e.preventDefault();
      let username = document.getElementById("usernameRegister").value.trim();
      let email = document.getElementById("emailRegister").value.trim();
      let password = document.getElementById("passwordRegister").value.trim();
      let passwordRepeat = document
        .getElementById("passwordRepeatRegister")
        .value.trim();
      let register = () => {
        let data = {
          username: username,
          email: email,
          password: password,
          password2: passwordRepeat,
        };
        axios
          .post("/api/register", data)
          .then((response) => {
            if (response.status === 200) {
              document.getElementById("errorField").innerHTML = "";
              document.getElementById("successField").innerHTML = response.data;
              document.getElementById("errorField").style.display = "none";
              document.getElementById("successField").style.display = "block";
              document.getElementById("passwordRegister").value = "";
              document.getElementById("passwordRepeatRegister").value = "";
              document.getElementById("emailRegister").value = "";
              document.getElementById("usernameRegister").value = "";
            }
          })
          .catch((errors) => {
            document.getElementById("successField").innerHTML = "";
            document.getElementById("errorField").innerHTML =
              errors.response.data;
            document.getElementById("errorField").style.display = "block";
            document.getElementById("successField").style.display = "none";
            document.getElementById("passwordRegister").value = "";
            document.getElementById("passwordRepeatRegister").value = "";
          });
      };
      register();
    },
    resizeSkew() {
      let mDiv = document.getElementById("ober-container");
      let navHeight = document.getElementById("smallNav").clientHeight;

      let cornerHeight =
        (mDiv.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180);

      mDiv.style.top = cornerHeight + navHeight + "px";
    },
  },
  mounted() {
    this.resizeSkew();
    window.onresize = () => this.resizeSkew();
  },
};
</script>
<style scoped>
#ober-container {
  position: absolute;
  width: 100%;
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
  color: #2e4052;
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
  color: #2e4052;
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
  color: #2e4052;
  overflow: hidden;
  background: linear-gradient(
    to right,
    var(--main),
    var(--main) 50%,
    #2e4052 50%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
  background-position: 100%;
  transition: background-position 275ms ease;
}

#form-footer-submit::-moz-focus-inner {
  border: 0;
}
.grad-link:visited {
  color: black;
}
.grad-link:hover {
  background-position: 0 100%;
}
@media only screen and (max-width: 600px) {
  .page-title {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .form-footer {
    min-width: 90%;
    margin: 0px auto;
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
  .form-footer input[type="password"],
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
    color: #2e4052;
    -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
    margin-bottom: 5px;
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
</style>
