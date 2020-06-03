<template>
  <div>
    <h1 class="page-title" :style="cssVars">Contact</h1>
    <div class="form-footer" :style="cssVars">
      <form v-on:submit="contact">
        <fieldset>
          <p id="successField" :style="cssVars"></p>
          <p id="errorField" :style="cssVars"></p>
          <label for="nickname">Name</label>
          <input type="text" name="nickname" id="nickname" placeholder="Your Name or Nickname *" />
          <label for="email">Email</label>
          <input type="email" name="email" id="email" placeholder="Your Email *" />
          <label for="message">Message</label>
          <textarea name="message" id="message" placeholder="Your message *" :style="cssVars"></textarea>
        </fieldset>
        <input id="form-footer-submit" type="submit" value="Send" />
      </form>
    </div>
    <footer class="footer" :style="cssVars">
      <a class="grad-link" :style="cssVars" href="https://daybringer.github.io/">Michal Vaňata</a>
      <p class="footer-text" :style="cssVars">©2020</p>
    </footer>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Footer",
  components: {},
  props: ["logged", "username", "colorMain", "colorSecond", "colorMainDark"],
  computed: {
    cssVars() {
      return {
        "--main": this.colorMain,
        "--second": this.colorSecond,
        "--mainDark": this.colorMainDark
      };
    }
  },
  methods: {
    contact: e => {
      e.preventDefault();
      let nickname = document.getElementById("nickname").value.trim();
      let email = document.getElementById("email").value.trim();
      let message = document.getElementById("message").value.trim();

      let contact = () => {
        let data = {
          nickname,
          email,
          message
        };

        axios
          .post("/api/contact", data)
          .then(response => {
            if (response.status === 200) {
              document.getElementById("nickname").value = "";
              document.getElementById("email").value = "";
              document.getElementById("message").value = "";
              document.getElementById("errorField").innerHTML = "";
              document.getElementById("successField").innerHTML = response.data;
              document.getElementById("errorField").style.display = "none";
              document.getElementById("successField").style.display = "block";
            }
          })
          .catch(errors => {
            document.getElementById("successField").innerHTML = "";
            document.getElementById("errorField").innerHTML =
              errors.response.data;
            document.getElementById("errorField").style.display = "block";
            document.getElementById("successField").style.display = "none";
          });
      };
      contact();
    }
  }
};
</script>
<style scoped>
.page-title {
  text-align: center;
  font-weight: 800;
  color: #2e4052;
  font-size: 3em;
}
.grad-link {
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
.grad-link:visited {
  color: black;
}
.grad-link:hover {
  background-position: 0 100%;
}
.footer {
  position: absolute;
  bottom: 0;
  text-align: center;
  width: 100%;
  color: var(--main);
  font-size: large;
  font-weight: 500;
  background-color: #fafefcff;
  padding: 1rem;
}
.footer-text {
  display: inline;
  position: relative;
  font-size: 1.5em;
  margin-left: 1rem;
  font-weight: 800;
  color: #2e4052;
}
.form-footer {
  width: 50%;
  max-width: 90%;
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
  margin-bottom: 8px;
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
  padding: 1rem 1rem;
  color: #fff;
  margin: 0 auto;
  background: var(--main);
  font-size: 1.5rem;
  font-weight: 400;
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

#form-footer-submit::-moz-focus-inner {
  border: 0;
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

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .page-title {
    text-align: center;
    font-weight: 800;
    color: #2e4052;
    font-size: 3em;
    margin-top: -1rem;
    margin-bottom: 0.5rem;
  }
  .footer {
    font-size: medium;
    font-weight: 500;
    padding: 0.25rem;
  }
  .footer-text {
    display: inline;
    position: relative;
    font-size: 1.5em;
    margin-left: 1rem;
    font-weight: 800;
    color: #2e4052;
  }
  .form-footer {
    width: 90%;
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
    color: #2e4052;
    -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
    margin-bottom: 15px;
  }

  .form-footer input[type="submit"],
  .form-footer input[type="button"] {
    padding: 0.75rem 1rem;
    font-weight: 600;
    width: 80%;
    border-radius: 0.5em;
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
    width: 90%;
    margin: 30px auto;
    margin-top: 0px;
    padding: 10px;
    border-radius: 10px;
    font-family: "Roboto", sans-serif;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .page-title {
    text-align: center;
    font-weight: 800;
    color: #2e4052;
    font-size: 3em;
    margin-top: -3rem;
    margin-bottom: 0.5rem;
  }
  .form-footer input[type="submit"],
  .form-footer input[type="button"] {
    padding: 0.75rem 1rem;
    font-weight: 600;
    width: 80%;
    border-radius: 0.5em;
  }
  #successField {
    margin-bottom: 15px;
  }
  #errorField {
    margin-bottom: 15px;
  }
  .footer {
    font-size: medium;
    font-weight: 500;
    padding: 0.5rem;
  }
}
</style>
