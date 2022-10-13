<template>
  <section class="dp-root">
    <div class="dp-header dp-header-root">
      <div class="dp-header-brand">
        <img
          src="https://preview.diskcraft.xyz/img/diskcraft3.75fea036.png"
          class="dp-header-brand-logo"
        />
        <div class="dp-header-brand-text">DiskCraft</div>
      </div>
      <div class="dp-header-nav-root">
        <div class="dp-header-nav">
          <router-link
            to="/home"
            class="dp-header-nav-link"
            :active="isActiveLink('/home')"
            >Home</router-link
          >
          <router-link
            to="/servers"
            class="dp-header-nav-link"
            :active="isActiveLink('/servers')"
            >Servers</router-link
          >
          <router-link
            to="/vps"
            class="dp-header-nav-link"
            :active="isActiveLink('/vps')"
            >VPS</router-link
          >
          <router-link
            to="/websites"
            class="dp-header-nav-link"
            style="display: none"
            :active="isActiveLink('/websites')"
            >Websites</router-link
          >
          <router-link
            to="/order"
            class="dp-header-nav-link"
            :active="isActiveLink('/order')"
            >Order</router-link
          >
          <router-link
            to="/admin/dashboard"
            :active="isActiveLink('/admin')"
            class="dp-header-nav-link"
            style="display: none"
            >Admin</router-link
          >
        </div>
      </div>
      <div class="dp-nav-right">
        <div class="dp-nav-right-admincenter">
          <i
            class="fa-solid fa-user-gear icon-admincenter"
            @click="
              toggleMenu();
              showMenu2 = false;
            "
          ></i>
        </div>

        <div
          class="dp-nav-right-admincenter"
          v-if="masterData?.account?.isAdmin == true || false"
        >
          <i
            class="fa-solid fa-screwdriver-wrench icon-admincenter"
            @click="
              toggleMenu2();
              showMenu = false;
            "
          ></i>
        </div>

        <div
          class="dp-nav-dropdown-menu dropdown-admin"
          v-if="showMenu2 == true"
        >
          <div
            class="dp-nav-dropdown-menu-item"
            @click="
              $router.push({
                path: `/admin/users`,
              });
              showMenu2 = false;
            "
          >
            <div class="dp-nav-dropdown-menu-item-icon">
              <i class="fa-light fa-users" style="font-size: 25px"></i>
            </div>
            <div class="dp-nav-dropdown-menu-item-text">Users</div>
          </div>

          <div
            class="dp-nav-dropdown-menu-item"
            @click="
              $router.push({
                path: `/admin/servers`,
              });
              showMenu2 = false;
            "
          >
            <div class="dp-nav-dropdown-menu-item-icon">
              <i class="fa-light fa-server" style="font-size: 25px"></i>
            </div>
            <div class="dp-nav-dropdown-menu-item-text">Servers</div>
          </div>
        </div>

        <div class="dp-nav-dropdown-menu" v-if="showMenu == true">
          <div
            class="dp-nav-dropdown-menu-item"
            @click="
              openAccountWindow();
              showMenu2 = false;
            "
          >
            <div class="dp-nav-dropdown-menu-item-icon">
              <i class="fa-light fa-wrench dp-nav-icon1"></i>
            </div>
            <div class="dp-nav-dropdown-menu-item-text">My Account</div>
          </div>
          <div
            class="dp-nav-dropdown-menu-item"
            @click="
              openInvoicesWindow();
              showMenu2 = false;
            "
          >
            <div class="dp-nav-dropdown-menu-item-icon">
              <i class="fa-light fa-file-invoice dp-nav-icon1"></i>
            </div>
            <div class="dp-nav-dropdown-menu-item-text">Invoices</div>
          </div>

          <div class="dp-nav-dropdown-menu-item" @click="logout()">
            <div class="dp-nav-dropdown-menu-item-icon">
              <i class="fa-light fa-door-open dp-nav-icon1"></i>
            </div>
            <div class="dp-nav-dropdown-menu-item-text">Logout</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dp-msg-holder">
      <div class="dp-msg" v-for="(msg, index) of messages" :key="index + 99">
        <div class="dp-msg-icon-red" v-if="msg.status == 0">
          <svg class="dp-msg-icon-svg" width="35" height="30">
            <image
              xlink:href="/img/icons/x.svg"
              width="35"
              height="30"
              src="/img/icons/x.svg"
            />
          </svg>
        </div>

        <div class="dp-msg-icon-green" v-if="msg.status == 1">
          <svg class="dp-msg-icon-svg" width="35" height="35">
            <image
              xlink:href="/img/icons/check.svg"
              width="35"
              height="35"
              src="/img/icons/check.svg"
            />
          </svg>
        </div>

        <div class="dp-msg-text">
          <div class="dp-msg-text-title">{{ msg.title }}</div>
          <div class="dp-msg-text-body">
            {{ msg.body }}
          </div>
        </div>
      </div>
    </div>
    <router-view class="dp-content" />
    <div
      class="dp-server-tooltip1"
      v-if="tooltip.show && tooltip.tooltipId == 1"
      :style="`top: ${tooltip.y}px; left: ${tooltip.x}px`"
      v-html="tooltip.text"
    ></div>
    <div
      class="dp-server-tooltip2"
      v-if="tooltip.show && tooltip.tooltipId == 2"
      :style="`top: ${tooltip.y}px; left: ${tooltip.x}px`"
      v-html="tooltip.text"
    ></div>
    <div
      class="dp-server-tooltip3"
      v-if="tooltip.show && tooltip.tooltipId == 3"
      :style="`top: ${tooltip.y}px; left: ${tooltip.x}px`"
      v-html="tooltip.text"
    ></div>
  </section>
</template>

<script>
const axios = require("axios");

export default {
  data() {
    return {
      tooltip: {
        show: false,
        x: 0,
        y: 0,
      },
      masterData: {
        pterodactylServers: null,
        qemuServers: null,
        account: null,
        servicesCount: null,
      },
      adminData: {
        users: null,
        pterodactylServers: null,
        qemuServers: null,
      },
      messages: [],
      msgInterval: null,
      showMenu: false,
      showMenu2: false,
      api: null,
    };
  },
  async mounted() {
    var vm = this;
    var newJwt = null;

    const urlHash = window.location.hash;
    if (urlHash.startsWith("#id_token=")) {
      var jwt = urlHash.substr(10, urlHash.length);
      window.localStorage.access_token = jwt;
      window.localStorage.setItem("access_token", jwt);
      newJwt = jwt;
      console.log("Added new access token");

      vm.$router.push({
        path: "/",
      });
    }

    vm.api = axios.create({
      baseURL: `https://billing.yourdomain.com/api`,
      timeout: 60000,
      headers: {
        Authorization: `Bearer ${
          newJwt ||
          window.localStorage.access_token ||
          window.localStorage.getItem("access_token") ||
          "INVALIDTOKEN"
        }`,
        "Content-Type": "application/json",
      },
    });

    clearInterval(vm.msgInterval);
    vm.msgInterval = setInterval(() => {
      for (var msg of vm.messages) {
        var msgIndex = vm.messages.indexOf(msg);

        if (msg.displayTime < 0) {
          vm.messages.splice(msgIndex, 1);
          return;
        }

        msg.displayTime = msg.displayTime - 1;
        vm.messages[msgIndex] = msg;
      }
    }, 1000);

    vm.api.interceptors.response.use(
      (response) => {
        return response;
      },
      function (error) {
        // Do something with response error
        if (error.response.status === 401) {
          const authUrl = error.response.data.redirect_url;
          vm.authRedirect(authUrl);
        }

        console.log(error);
        //return Promise.reject(error.response);
      }
    );

    var jwtData;
    var access_token =
      newJwt ||
      window.localStorage.access_token ||
      window.localStorage.getItem("access_token");
    if (access_token) {
      jwtData = access_token.split(".");
      jwtData = atob(jwtData[1]);
      jwtData = JSON.parse(jwtData);
    }

    this.sockets.subscribe("pterodactylServersUpdate", (data) => {
      vm.masterData.pterodactylServers = data;
      vm.$forceUpdate();
      setTimeout(() => {
        vm.$forceUpdate();
      }, 500);
    });

    this.sockets.subscribe("qemuServersUpdate", (data) => {
      vm.masterData.qemuServers = data;
      vm.$forceUpdate();
      setTimeout(() => {
        vm.$forceUpdate();
      }, 500);
    });

    this.sockets.subscribe("notifications", (data) => {
      vm.messages = [...data, ...vm.messages];
      vm.$forceUpdate();
    });

    this.sockets.subscribe("connectNotification", () => {
      this.$socket.emit("registerAsClient", {
        jwt: window.localStorage.access_token,
        sub: jwtData.sub,
      });
    });

    vm.api.get(`/account`).then((req) => {
      if (req.status == 200) {
        vm.masterData.account = req.data;

        if (req.data.isAdmin == true) {
          this.sockets.subscribe("pterodactylServersUpdate.admin", (data) => {
            vm.adminData.pterodactylServers = data;
            vm.$forceUpdate();
            setTimeout(() => {
              vm.$forceUpdate();
            }, 500);
          });
        }
      }
    });

    vm.api.get(`/account/servers`).then((req) => {
      if (req.status == 200) {
        vm.masterData.servicesCount = req.data;
      }
    });

    setInterval(() => {
      vm.api.get(`/account`).then((req) => {
        if (req.status == 200) {
          vm.masterData.account = req.data;
        }
      });

      vm.api.get(`/account/servers`).then((req) => {
        if (req.status == 200) {
          vm.masterData.servicesCount = req.data;
        }
      });
    }, 10000);
  },
  methods: {
    openInvoicesWindow() {
      this.showMenu = false;
      this.$router.push({
        path: "/invoices",
      });
    },
    openAccountWindow() {
      this.showMenu = false;
      this.$router.push({
        path: "/account",
      });
    },
    emptyFunction() {},
    tooltipShow(e, text, offsetX = 0, offsetY = 0, tooltipId = 1) {
      const boundBox = e.srcElement.getBoundingClientRect();

      if (tooltipId == 2) {
        this.$root.tooltip = {
          show: true,
          tooltipId: tooltipId,
          x: boundBox.x + offsetX,
          y: boundBox.y - boundBox.height - 18 + offsetY,
          text: text || "TOOLTIP",
        };
      }

      if (tooltipId == 3) {
        this.$root.tooltip = {
          show: true,
          tooltipId: tooltipId,
          x: boundBox.x + offsetX,
          y: boundBox.y - boundBox.height - 18 + offsetY,
          text: text || "TOOLTIP",
        };
      }

      if (tooltipId == 1) {
        this.$root.tooltip = {
          show: true,
          tooltipId: tooltipId,
          x: boundBox.x + offsetX,
          y: boundBox.y - boundBox.height - 18 + offsetY,
          text: text || "TOOLTIP",
        };
      }
    },

    tooltipHide() {
      this.$root.tooltip = {
        show: false,
        x: 0,
        y: 0,
      };
    },
    logout() {
      window.localStorage.removeItem("access_token");
      this.api = axios.create({
        baseURL: `https://billing.yourdomain.com/api`,
        timeout: 6000,
        headers: {
          Authorization: `Bearer ${
            window.localStorage.access_token || "INVALIDTOKEN"
          }`,
          "Content-Type": "application/json",
        },
      });
      this.api.get(`/account`);
      window.location.reload();
    },
    authRedirect(URL) {
      window.location.href = URL;
    },
    sleep(timeout) {
      return new Promise((res) => {
        setTimeout(() => {
          res();
        }, timeout);
      });
    },
    authenticate() {
      //would redirect
    },
    toggleMenu() {
      if (this.showMenu == true) {
        this.showMenu = false;
      } else {
        this.showMenu = true;
      }
      this.$forceUpdate();
    },

    toggleMenu2() {
      if (this.showMenu2 == true) {
        this.showMenu2 = false;
      } else {
        this.showMenu2 = true;
      }
      this.$forceUpdate();
    },
    isActiveLink(ROOTPATH) {
      var isActive = this.$route.fullPath.includes(ROOTPATH);
      return isActive;
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #1a1a1a;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #303030;
  border-radius: 2px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #3d3d3d;
}

.dp-nav-icon1 {
  font-size: 28px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: fit-content;
}

.dp-nav-right {
  display: inline-flex;
}

.icon-admincenter {
  color: white;
  font-size: 25px;
  margin-top: 1px;
  margin-left: 20px;
  cursor: pointer;
}

.dropdown-admin {
  height: fit-content !important;
}

.dp-btn-spinner,
.dp-btn-spinner:after {
  border-radius: 50%;
  width: 15px;
  height: 15px;
}
.dp-btn-spinner {
  font-size: 10px;
  border-top: 5px solid rgba(255, 255, 255, 0.2);
  border-right: 5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 5px solid rgba(255, 255, 255, 0.2);
  border-left: 5px solid white;
  animation: load8 0.8s infinite linear;
  margin-top: 4px;
  max-width: 15px;
  max-height: 15px;

  margin-left: auto;
  margin-right: auto;
}

.dp-page-loading-spinner,
.dp-page-loading-spinner:after {
  border-radius: 50%;
  width: 35px;
  height: 35px;
}
.dp-page-loading-spinner {
  font-size: 10px;
  border-top: 5px solid rgba(255, 255, 255, 0.2);
  border-right: 5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 5px solid rgba(255, 255, 255, 0.2);
  border-left: 5px solid white;
  animation: load8 0.8s infinite linear;
  margin-top: 40px;
  margin-bottom: 40px;
  max-width: 40px;
  max-height: 40px;

  margin-left: auto;
  margin-right: auto;
}

.dp-server-tooltip1 {
  position: fixed;
  z-index: 999999;
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 6px;
  background-color: #595959;
  border-radius: 4px;
  transition: visibility 0s linear 0.15s, opacity 0.15s;
  /* transform: translate(calc(-100% - 5px), -100%); */
}
.dp-server-tooltip1::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 8px;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #595959 transparent transparent transparent;
}

.dp-server-tooltip2 {
  position: fixed;
  z-index: 999999;
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 6px;
  background-color: #595959;
  border-radius: 4px;
  transition: visibility 0s linear 0.15s, opacity 0.15s;
  direction: lrt;
  /* transform: translate(calc(-100% - 5px), -100%); */
}
.dp-server-tooltip2::after {
  content: "";
  position: absolute;
  top: 100%;
  left: calc(100% - 8px);
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #595959 transparent transparent transparent;
}

.dp-server-tooltip3 {
  position: fixed;
  z-index: 999999;
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 6px;
  background-color: #595959;
  border-radius: 4px;
  transition: visibility 0s linear 0.15s, opacity 0.15s;
  direction: lrt;
  /* transform: translate(calc(-100% - 5px), -100%); */
}
.dp-server-tooltip3::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #595959 transparent transparent transparent;
}

.dp-msg-icon-svg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.dp-msg {
  color: var(--color-text);
  background-color: var(--color-background--layer-20);
  border-radius: 4px;
  display: grid;
  height: fit-content;
  grid-template-columns: 70px 320px;
  margin-top: 10px;
}
.dp-msg-icon-green {
  padding: 5px;
  line-height: 40px;
  background-color: #62b862;
  border-radius: 4px 0px 0px 4px;
  text-align: center;
  position: relative;
}

.dp-msg-icon-red {
  padding: 5px;
  line-height: 40px;
  background-color: #f2183c;
  border-radius: 4px 0px 0px 4px;
  text-align: center;
  position: relative;
}
.dp-msg-text {
  padding: 10px;
}
.dp-msg-text-title {
  font-weight: bold;
  font-size: 18px;
}

.dp-msg-text-body {
  font-size: 14px;
  overflow: hidden;
  word-wrap: break-word;
  white-space: pre-line;
}

.dp-msg-holder {
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 999;
}
.dp-nav-right {
  margin-top: 18px;
  margin-right: 30px;
  z-index: 1000;
  position: absolute;
  right: 0px;
}
.dp-nav-right-usericon {
  cursor: pointer;
}
body {
  margin: 0px;
  font-family: Montserrat, Roboto, sans-serif;
  font-size: 1.125rem;
  font-weight: 500;
  white-space: nowrap;
  background-color: var(--color-background--layer-0);
  overflow-x: hidden;
}
.dp-nav-dropdown-menu {
  position: absolute;
  background-color: var(--color-background--layer-40);
  top: 48px;
  right: -30px;
  height: 138px;
  width: 300px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: var(--color-background--layer-10);
  user-select: none;
}
.dp-nav-dropdown-menu-item {
  padding-left: 10px;
  padding-right: 10px;
  height: 45px;
  max-height: 45px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: var(--color-background--layer-10);
  color: var(--color-text);
  display: grid;
  grid-template-columns: 40px 260px;
  cursor: pointer;
}
.dp-nav-dropdown-menu-item:hover {
  background-color: var(--color-background--layer-30);
}
.dp-nav-dropdown-menu-item-text,
.dp-nav-dropdown-menu-item-icon {
  height: 45px;
  line-height: 45px;
  position: relative;
}
.dp-nav-dropdown-menu-item-icon {
  margin-right: 10px;
}
.dp-root {
  height: 100vh;
  min-width: 100vw;
  background-color: var(--color-background--layer-0);
}
.dp-content {
  z-index: 1;
  position: absolute;
  top: 65px;
  left: 0;
  overflow: hidden;
  overflow-y: auto;
  color: var(--color-text);
}
.dp-header {
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100vw;
  height: 65px;
  background-color: var(--color-background--layer-40);
  box-shadow: 0 2px 1px var(--color-shadow);
  z-index: 100;
  display: inline-flex;
  user-select: none;
}
.dp-header-brand {
  color: var(--color-text);
  font-size: 25px;

  margin-left: 10px;
  display: inline-flex;
}
.dp-header-brand-logo {
  height: 50px;
  margin-top: 7.5px;
}
.dp-header-brand-text {
  line-height: 65px;
  margin-left: 10px;
  font-weight: 600;
}
.dp-header-nav-root {
  position: relative;
  left: -248px;
  min-width: calc(100vw - 20px);
  display: flex;
  justify-content: center;
}
.dp-header-nav {
  line-height: 65px;
  color: var(--color-text);
}

.dp-header-nav-link {
  color: var(--color-text);
  text-decoration: none;
  line-height: 15px;
  font-size: 16px;
  margin-left: 8px;
  margin-right: 8px;
}
.dp-header-nav-link:hover {
  color: var(--color-back-link--hover);
}

.dp-header-nav-link[active="true"] {
  color: var(--color-primary--link);
  text-decoration: none;
  position: relative;
}

.dp-header-nav-link[active="true"]::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
}

.dp-button-primary {
  font-family: Montserrat, Roboto, sans-serif;
  font-weight: bolder;
  cursor: pointer;
  padding: 10px;
  padding-left: 16px;
  padding-right: 16px;
  font-size: 16px;
  border-style: none;
  border-radius: 5px;
  background-color: var(--color-primary);
  color: var(--color-text);
}
.dp-button-primary:hover {
  background-color: var(--color-primary--hover);
}
.dp-button-primary:disabled {
  background-color: #595959;
  cursor: not-allowed;
}

@media only screen and (max-width: 750px) {
  .dp-header-nav-root {
    position: relative;
    left: 0px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .dp-nav-right {
    display: none;
  }
  .dp-header-root {
    display: block;
    height: 125px;
    width: 100vw;
  }
  .dp-header-nav-link {
    line-height: 15px;
    font-size: 14px;
    margin-left: 3.5px;
    margin-right: 3.5px;
  }
  .dp-content {
    position: absolute;
    top: 120px;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    padding-bottom: 20px;
  }
}

:root {
  --color-primary: #5c7cfa;
  --color-primary--link: #4f70f3e1;
  --color-primary--hover: rgba(92, 124, 250, 0.61);
  --color-text: #ededed;
  --color-text--disabled: #8a8a8a;
  --color-back-link--hover: #a8a8a8;

  --color-background--layer-0: #141414;
  --color-background--layer-10: #262626;
  --color-background--layer-20: #2b2b2b;
  --color-background--layer-30: #303030;
  --color-background--layer-40: #383838;

  --color-background--gradient-card-0: rgba(38, 38, 38, 0);
  --color-background--gradient-card-15: rgba(38, 38, 38, 0.08);
  --color-background--overlay: rgba(0, 0, 0, 0.7);
  --color-card-background: #262626;
  --color-card-background--hover: #2b2b2b;
  --color-card-footer--background: #303030;
  --color-card-footer--disabled-background: #1a1a1a;
  --color-card-footer--disabled-text: #3d3d3d;
  --card-bg-gradiant-start: #303030;
  --card-bg-gradiant-end: #171717;

  --color-shadow: rgba(0, 0, 0, 0.35);
  --color-shadow--hover: rgba(0, 0, 0, 0.4);
}

@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
