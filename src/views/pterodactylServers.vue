<template>
  <section
    style="width: 100%"
    v-if="$root.masterData.pterodactylServers == null"
  >
    <div class="dp-page-loading-spinner"></div>
  </section>
  <section
    class="dp-servers-root"
    :style="
      $root.masterData.pterodactylServers.length == 0 ? `height: 500px` : ``
    "
    v-else
  >
    <div
      class="dp-servers-addserver-btn-root"
      v-if="$root.masterData.pterodactylServers.length > 0"
    >
      <button
        class="dp-button-primary dp-servers-addserver-btn"
        style="margin-right: 50px; margin-top: 25px"
        @click="openOrderWindow()"
      >
        CREATE SERVER
      </button>
    </div>

    <div
      class="dp-servers-noserver-root"
      v-if="$root.masterData.pterodactylServers.length == 0"
    >
      <div class="dp-servers-noserver-server-title">No servers</div>
      <div class="dp-servers-noserver-server-subtitle">
        It looks like you dont have any servers – create your first one now.
      </div>
      <div class="dp-servers-noserver-server-actionbtn-root">
        <button
          class="dp-button-primary dp-servers-addserver-btn"
          @click="openOrderWindow()"
        >
          CREATE SERVER
        </button>
      </div>
    </div>

    <div class="dp-servers-table-root" v-else>
      <div class="dp-servers-table-header-root">
        <div class="dp-servers-table-header-item"></div>
        <div class="dp-servers-table-header-item">Name</div>
        <div class="dp-servers-table-header-item item-location">Location</div>
        <div class="dp-servers-table-header-item item-billingdate">
          Billing Date
        </div>
        <div class="dp-servers-table-header-item item-suspended">Suspended</div>
        <div class="dp-servers-table-header-item item-price">Price</div>
        <div class="dp-servers-table-header-item item-actions"></div>
      </div>

      <div
        v-for="(server, index) of $root.masterData.pterodactylServers"
        :key="index"
        @click="manage(server)"
        class="dp-servers-table-item-root"
      >
        <div class="dp-servers-table-item-item" style="width: 100%">
          <div class="dp-servers-table-item-powerstatus">
            <div
              v-if="
                server.state == 0 ||
                server.state == 1 ||
                (hasExpired(server.renewal_cancel_date) == true &&
                  server.renewal == false)
              "
              class="dp-server-install-spinner"
            ></div>
            <div v-if="server.state == 2" class="ring-container gray">
              <div class="ringring"></div>
              <div class="circle">
                <tooltip :text="server.stateText"
                  ><div style="min-width: 15px !important">&nbsp;</div></tooltip
                >
              </div>
            </div>

            <div
              v-if="
                server.state == 3 &&
                (hasExpired(server.renewal_cancel_date) == false ||
                  server.renewal == true)
              "
              class="ring-container red"
            >
              <div class="ringring"></div>
              <div class="circle">
                <tooltip :text="server.stateText"
                  ><div style="min-width: 15px !important">&nbsp;</div></tooltip
                >
              </div>
            </div>
            <div
              v-if="
                server.state == 4 &&
                (hasExpired(server.renewal_cancel_date) == false ||
                  server.renewal == true)
              "
              class="ring-container orange"
            >
              <div class="ringring"></div>

              <div class="circle">
                <tooltip :text="server.stateText"
                  ><div style="min-width: 15px !important">&nbsp;</div></tooltip
                >
              </div>
            </div>

            <div
              v-if="
                server.state == 5 &&
                (hasExpired(server.renewal_cancel_date) == false ||
                  server.renewal == true)
              "
              class="ring-container green"
            >
              <div class="ringring"></div>
              <div class="circle">
                <tooltip :text="server.stateText"
                  ><div style="min-width: 15px !important">&nbsp;</div></tooltip
                >
              </div>
            </div>
          </div>
        </div>
        <div class="dp-servers-table-item-item">
          <span class="dp-servers-table-item-item-name-title">{{
            server.name
          }}</span
          ><span
            v-if="server.specs"
            class="dp-servers-table-item-item-name-subtitle"
          >
            {{ server.specs.cpu || 0 }} CPU |
            {{
              server.specs.ram >= 1
                ? `${server.specs.ram} GB`
                : `${server.specs.ram * 1024} MB` || 0
            }}
            RAM |
            {{ server.specs.disk || 0 }}GB DISK |
          </span>
        </div>
        <div class="dp-servers-table-item-item item-location">
          <img
            :src="server.location.flag_url"
            class="dp-servers-table-item-location-flag"
          />
          <tooltip :text="`Server location code: ${server.location.code}`">
            <span class="dp-servers-table-item-location-text item-location">{{
              server.location.name
            }}</span>
          </tooltip>
        </div>

        <div class="dp-servers-table-item-item item-billingdate">
          <tooltip
            :text="`Local: ${convertUtcBillingDate(
              server.renewal_cancel_date
            )}<br>
            UTC: ${server.renewal_cancel_date}`"
          >
            {{ convertUtcBillingDate(server.renewal_cancel_date) }}
          </tooltip>
        </div>

        <div class="dp-servers-table-item-item item-suspended">
          {{ server.suspended == true ? "Yes" : "No" }}
        </div>

        <tooltip
          :text="`€${floatPriceToString(server.price)}<small>/month</small>`"
        >
          <div class="dp-servers-table-item-item item-price">
            €{{ floatPriceToString(server.price) }}
          </div>
        </tooltip>
        <div
          v-if="server.state == 0"
          class="dp-servers-table-item-item item-actions"
          style="width: calc(100% - 15px)"
        >
          <div class="dp-servers-table-progressbar-root">
            <div
              class="dp-servers-table-progressbar-progress"
              :style="`width:${server.install_progress}%`"
            >
              &nbsp;
            </div>
          </div>
        </div>
        <div
          v-else
          class="dp-servers-table-item-item item-actions"
          style="width: calc(100% - 15px)"
        >
          <div class="dp-servers-table-item-actionbtns">
            <tooltip
              :text="`Destroy the server at<br>the next billing date.<br>(${convertUtcBillingDate(
                server.renewal_cancel_date
              )})`"
            >
              <button
                v-if="server.renewal == true"
                class="dp-button-primary dp-home-addbalance-btn"
                style="margin-right: 10px"
                @click="cancelServer(server)"
              >
                CANCEL
              </button>
            </tooltip>

            <tooltip
              text="Reinstall the base image of<br>your server, your uploaded<br>files will be kept."
            >
              <div>
                <button
                  v-if="
                    server.suspended == false &&
                    hasExpired(server.renewal_cancel_date) == false
                  "
                  class="dp-button-primary dp-home-addbalance-btn"
                >
                  REINSTALL
                </button>
              </div>
            </tooltip>

            <tooltip
              text="Your server will <br>be deleted instantly. <br>You will not get <br>any credit back."
            >
              <button
                v-if="
                  server.renewal == false &&
                  server.suspended == false &&
                  hasExpired(server.renewal_cancel_date) == false
                "
                class="dp-button-primary dp-home-addbalance-btn"
                style="margin-left: 10px"
                @click="deleteNow(server)"
              >
                DELETE
              </button>
            </tooltip>
          </div>
        </div>
      </div>
    </div>
    <div style="padding-bottom: 20px; width: 20px">&nbsp;</div>
  </section>
</template>

<script>
const moment = require("moment");

import tooltip from "@/components/tooltip.vue";
export default {
  components: {
    tooltip,
  },
  data() {
    return {
      ignoreManageOpen: false,
    };
  },
  methods: {
    deleteNow(server) {
      var vm = this;
      vm.ignoreManageOpen = true;
      setTimeout(() => {
        vm.ignoreManageOpen = false;
      }, 200);

      vm.$root.api
        .get(`/pterodactyl/myservers/${server.uuid}/delete`)
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

          if (req.data.success == true) {
            //redirect to correct dashboard
          }
        });
    },
    cancelServer(server) {
      var vm = this;
      vm.ignoreManageOpen = true;
      setTimeout(() => {
        vm.ignoreManageOpen = false;
      }, 200);

      vm.$root.api
        .get(`/pterodactyl/myservers/${server.uuid}/cancel`)
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

          if (req.data.success == true) {
            //redirect to correct dashboard
          }
        });
    },
    reinstallServer(server) {
      var vm = this;
      vm.ignoreManageOpen = true;
      setTimeout(() => {
        vm.ignoreManageOpen = false;
      }, 200);

      vm.$root.api
        .get(`/pterodactyl/myservers/${server.uuid}/reinstall`)
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

          if (req.data.success == true) {
            //redirect to correct dashboard
          }
        });
    },
    convertUtcBillingDate(date) {
      if (date == "---") {
        return "---";
      }

      date = new Date(
        moment.utc(`${date} UTC`, "YYYY-MM-DD HH:mm:ss [UTC]").local()
      );
      date =
        date.getFullYear() +
        "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getDate()).slice(-2) +
        " " +
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2);
      return date;
    },
    hasExpired(date) {
      date = new Date(`${date} UTC`);

      var currentDate = new Date();

      return date.getTime() <= currentDate.getTime();
    },
    manage(server) {
      var vm = this;
      if (server.manage_url) {
        setTimeout(() => {
          if (vm.ignoreManageOpen == false) {
            window.open(server.manage_url, "MANAGE_WINDOW");
          }
        }, 100);
      }
    },
    floatPriceToString(input) {
      if (input == undefined) return;

      if (input.toString().includes(".")) {
        var returnStr = (Math.round(input * 100) / 100)
          .toString()
          .replace(".", ",");
        if (returnStr.split(",")[1] && returnStr.split(",")[1].length == 1)
          returnStr += `0`;

        if (returnStr.split(",")[1] == null) returnStr += `${","}00`;

        return returnStr;
      } else {
        return input + `${","}00`;
      }
    },
    openOrderWindow() {
      this.$router.push({
        path: "/order",
      });
    },
  },
  mounted() {
    var vm = this;

    vm.$root.api
      .get("/pterodactyl/myservers")
      .then((req) => {
        vm.$root.masterData.pterodactylServers = req.data;
      })
      .catch((e) => {
        console.log(e);
      });
  },
};
</script>

<style scoped>
.dp-server-install-spinner,
.dp-server-install-spinner:after {
  border-radius: 50%;
  width: 15px;
  height: 15px;
}
.dp-server-install-spinner {
  font-size: 10px;
  border-top: 5px solid rgba(255, 255, 255, 0.2);
  border-right: 5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 5px solid rgba(255, 255, 255, 0.2);
  border-left: 5px solid var(--color-primary);
  animation: load8 0.8s infinite linear;
  margin-top: 4px;
  max-width: 15px;
  max-height: 15px;
}

.dp-servers-table-item-actionbtns {
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  top: -6px;
}
.dp-button-primary {
  font-family: Montserrat, Roboto, sans-serif;
  font-weight: bolder;
  cursor: pointer;
  padding: 6px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 14px;
  border-style: none;
  border-radius: 5px;
  background-color: var(--color-primary);
  color: var(--color-text);
}
.dp-button-primary:hover {
  background-color: var(--color-primary--hover);
}

.gray .circle {
  background-color: #b8b8b8;
}
.gray .ringring {
  display: none;
}

.orange .circle {
  background-color: #ffa500;
}
.orange .ringring {
  display: none;
}

.red .circle {
  background-color: #f2183c;
}
.red .ringring {
  display: none;
}

.green .circle {
  background-color: #7bea7b;
}
.green .ringring {
  border: 3px solid #7bea7b;
}

.circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  left: 6px;
}

.ring-container {
  position: relative;
}

.ringring {
  border-radius: 30px;
  height: 25px;
  width: 25px;
  position: absolute;
  left: -2px;
  top: 0px;
  animation: pulsate 2.5s ease-out;
  animation-iteration-count: infinite;
  opacity: 0;
}

.dp-servers-table-item-powerstatus {
  position: absolute;
  width: 10px;
  top: -5px;
  left: 0;
  right: 0;
  margin: auto;
}

.dp-servers-table-progressbar-progress {
  background-color: var(--color-primary);
  z-index: 1000;
  border-radius: 4px;
}
.dp-servers-table-progressbar-root {
  width: 100%;
  background-color: var(--color-background--layer-0);
  border-radius: 4px;
}
.dp-servers-root {
  width: 100vw;
}
.dp-servers-table-root {
  margin-top: 75px;
  margin-left: 50px;
  margin-right: 50px;
  width: calc(100% - 100px);
}
.dp-servers-table-header-root {
  display: grid;
  grid-template-columns:
    minmax(0, 0.5fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 2fr)
    minmax(0, 2fr) minmax(0, 1fr) minmax(0, 2fr);
  grid-gap: 20px;
  user-select: none;
}
.dp-servers-table-item-root {
  display: grid;
  grid-template-columns:
    minmax(0, 0.5fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 2fr)
    minmax(0, 2fr) minmax(0, 1fr) minmax(0, 2fr);
  grid-gap: 20px;
  background-color: var(--color-background--layer-20);
  margin-top: 25px;
  padding-top: 20px;
  padding-bottom: 20px;
  cursor: pointer;
  user-select: none;
}
.dp-servers-table-item-root:hover {
  background-color: var(--color-background--layer-40);
}

.dp-servers-table-header-item,
.dp-servers-table-item-item {
  display: flex;
  font-size: 16px;
  width: 14.27%;
  position: relative;
}
.dp-servers-table-item-item-name-title {
  position: absolute;
  top: -5px;
}
.dp-servers-table-item-item-name-subtitle {
  width: 100%;
  font-size: 10px;
  filter: opacity(0.6);
  position: absolute;
  top: 13px;
}
.dp-servers-table-item-location-flag {
  height: 14px;
  margin-top: 2px;
}
.dp-servers-table-item-location-text {
  margin-left: 10px;
}
.dp-servers-noserver-root {
  position: absolute;
  width: fit-content;
  left: 0;
  right: 0;
  margin: auto;
  margin-top: 20px;
  width: calc(100vw - 100px);
}
.dp-servers-noserver-server-title,
.dp-servers-noserver-server-subtitle {
  word-wrap: break-word;
  white-space: pre-line;
  text-align: center;
}
.dp-servers-noserver-server-title {
  font-weight: 700;
  text-align: center;
  font-size: 32px;
  margin-bottom: 10px;
}
.dp-servers-addserver-btn {
  position: absolute;
  width: fit-content;
  left: 0;
  right: 0;
  margin: auto;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 20px;
  margin-top: 10px;
}

@keyframes pulsate {
  0% {
    -webkit-transform: scale(0.1, 0.1);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  40% {
    -webkit-transform: scale(1, 1);
    opacity: 0;
  }
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
@media only screen and (max-width: 1350px) {
  .item-suspended {
    visibility: hidden;
  }

  .dp-servers-table-item-root,
  .dp-servers-table-header-root {
    grid-template-columns:
      minmax(0, 0.5fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 0fr)
      minmax(0, 2fr) minmax(0, 1fr) minmax(0, 2fr);
  }
}

@media only screen and (max-width: 1150px) {
  .item-location,
  .dp-servers-table-item-location-flag {
    visibility: hidden;
    max-width: 0;
    width: 0;
  }
  .item-location .dp-tooltip {
    display: none;
  }

  .dp-servers-table-item-root,
  .dp-servers-table-header-root {
    grid-template-columns:
      minmax(0, 0.5fr) minmax(0, 2fr) minmax(0, 0fr) minmax(0, 0fr)
      minmax(0, 2fr) minmax(0, 1fr) minmax(0, 2fr);
  }
}

@media only screen and (max-width: 930px) {
  .item-billingdate {
    visibility: hidden;
  }
  .item-billingdate .dp-tooltip {
    display: none;
  }

  .dp-servers-table-item-root,
  .dp-servers-table-header-root {
    grid-template-columns:
      minmax(0, 0.5fr) minmax(0, 0fr) minmax(0, 0fr) minmax(0, 0fr)
      minmax(0, 2fr) minmax(0, 1fr) minmax(0, 2fr);
  }
}

@media only screen and (max-width: 750px) {
  .item-price {
    visibility: hidden;
  }
  .dp-servers-table-item-root,
  .dp-servers-table-header-root {
    grid-template-columns:
      minmax(0, 0.5fr) minmax(0, 0fr) minmax(0, 0fr) minmax(0, 0fr)
      minmax(0, 0fr) minmax(0, 1fr) minmax(0, 2fr);
  }
}

@media only screen and (max-width: 560px) {
  .item-actions {
    visibility: hidden;
  }
  .dp-servers-table-item-root,
  .dp-servers-table-header-root {
    grid-template-columns:
      minmax(0, 0.5fr) minmax(0, 0fr) minmax(0, 0fr) minmax(0, 0fr)
      minmax(0, 0fr) minmax(0, 1fr) minmax(0, 0fr);
  }
}
</style>
