<template>
  <section style="width: 100%" v-if="$root.masterData.qemuServers == null">
    <div class="dp-page-loading-spinner"></div>
  </section>
  <section class="dp-qemu-root" v-else>
    <div
      class="vps-noservers-root"
      v-if="$root.masterData.qemuServers.length == 0"
    >
      <div class="vps-noservers-title">No servers</div>
      <div class="vps-noservers-subtitle">
        It looks like you dont have any servers – create your first one now.
      </div>
      <button
        class="dp-button-primary vps-noservers-btn"
        @click="openOrderWindow()"
      >
        CREATE SERVER
      </button>
    </div>

    <div class="vps-table-root" v-else>
      <div class="vps-table-header table-grid">
        <div class="vps-table-header-item"></div>
        <div class="vps-table-header-item">Name</div>
        <div class="vps-table-header-item vps-location">Location</div>
        <div class="vps-table-header-item vps-billingdate">Billing Date</div>
        <div class="vps-table-header-item vps-network">IPv4/IPv6</div>
        <div class="vps-table-header-item vps-action">Price</div>

        <div class="vps-table-header-item"></div>
      </div>

      <div
        class="vps-table-item table-grid"
        v-for="(vps, index) of $root.masterData.qemuServers"
        :key="index"
        @click="openVpsManager(vps)"
      >
        <div class="vps-table-item-item" style="position: relative">
          <div
            :class="`ring-container ${vpsStateIconColor(vps)}`"
            v-if="vps.state > 1"
          >
            <div class="ringring"></div>
            <div class="circle">
              <tooltip :text="vps.stateText"
                ><div style="min-width: 15px !important">&nbsp;</div></tooltip
              >
            </div>
          </div>
          <tooltip :text="vps.stateText" v-else>
            <div class="dp-vps-install-spinner"></div>
          </tooltip>
        </div>
        <div class="vps-table-item-item server-name">
          <div class="dp-vps-name-title">
            {{ vps.name }}
          </div>

          <div v-if="vps.specs" class="dp-vps-name-subtitle">
            {{ vps.specs.cpu || 0 }} CPU |
            {{
              vps.specs.ram > 1023
                ? `${vps.specs.ram / 1024} GB`
                : `${vps.specs.ram} MB` || 0
            }}
            RAM |
            {{
              vps.specs.disk > 1023
                ? `${vps.specs.disk / 1024} GB`
                : `${vps.specs.disk} MB`
            }}
            DISK
          </div>
        </div>
        <div class="vps-table-item-item vps-location">
          <img :src="vps.location.flag_url" class="dp-vps-location-flag" />
          <tooltip :text="`Server location code: ${vps.location.code}`">
            <span class="dp-vps-location-text item-location">{{
              vps.location.name
            }}</span>
          </tooltip>
        </div>
        <div class="vps-table-item-item vps-billingdate">
          <tooltip
            :text="`
            Local: ${convertUtcBillingDate(vps.renew_cancel_date)}<br>
            UTC: ${vps.renew_cancel_date}`"
          >
            {{ convertUtcBillingDate(vps.renew_cancel_date) }}
          </tooltip>
        </div>

        <div class="vps-table-item-item vps-network">
          <tooltip
            :text="`
            IPv4: ${vps.network.ipv4}<br>
            IPv6: ${vps.network.ipv6}<small>/112</small>
            `"
          >
            <div class="vps-network-ipv4">
              {{ vps.network.ipv4 }}
            </div>
            <div class="vps-network-ipv6">
              {{ vps.network.ipv6 }}
            </div>
          </tooltip>
        </div>
        <div class="vps-table-item-item">
          <tooltip
            :text="`€${floatPriceToString(vps.price)}<small>/month</small>`"
          >
            <div class="dp-servers-table-item-item item-price">
              €{{ floatPriceToString(vps.price) }}
            </div>
          </tooltip>
        </div>
        <div class="vps-table-item-item vps-action" v-if="vps.state > 2">
          <tooltip
            :text="`Destroy the server at<br>the next billing date.<br>(${convertUtcBillingDate(
              vps.renew_cancel_date
            )})`"
            v-if="vps.renewal == true"
            style="
              width: fit-content !important;
              height: fit-content !important;
              margin-right: 0px;
            "
          >
            <button
              class="dp-button-primary vps-actionbtn"
              style="margin-right: 10px"
              @click="cancelServer(vps)"
            >
              CANCEL
            </button>
          </tooltip>

          <tooltip
            text="Your server will <br>be deleted instantly. <br>You will not get <br>any credit back."
            v-else
            style="
              width: fit-content !important;
              height: fit-content !important;
              margin-right: 0px;
            "
          >
            <button
              class="dp-button-primary vps-actionbtn"
              style="margin-right: 10px"
              @click="deleteServer(vps)"
            >
              DELETE
            </button>
          </tooltip>
        </div>
        <div class="vps-table-item-item vps-action" v-else>
          <div class="dp-servers-table-progressbar-root">
            <div
              class="dp-servers-table-progressbar-progress"
              :style="`width:${vps.status.installProgress}%`"
            >
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dp-servers-table-progressbar-progress {
  background-color: var(--color-primary);
  z-index: 1000;
  border-radius: 4px;
  height: 19px;
}
.dp-servers-table-progressbar-root {
  width: 100%;
  background-color: var(--color-background--layer-0);
  border-radius: 4px;
  height: 19px;
  margin-top: 20px;
}

.dp-qemu-root {
  padding: 20px;
  padding-bottom: 0px;
  width: 100%;
}

.vps-noservers-title,
.vps-noservers-subtitle {
  word-wrap: break-word;
  white-space: pre-line;
  text-align: center;
}
.vps-noservers-title {
  font-weight: 700;
  text-align: center;
  font-size: 32px;
  margin-bottom: 10px;
}
.vps-noservers-root {
  position: relative;
  padding-bottom: 60px;
}
.vps-noservers-btn {
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
.dp-qemu-root {
  width: calc(100% - 40px);
  max-width: calc(100% - 40px);
}

.table-grid {
  display: grid;
  grid-template-columns:
    30px minmax(0, 2fr) minmax(0, 2fr) minmax(0, 2fr)
    minmax(0, 2fr) minmax(0, 1fr) minmax(80px, 220px);
  grid-gap: 20px;
  padding: 20px;
}

.vps-table-root {
  padding: 30px;
}

.vps-table-item {
  background-color: var(--color-background--layer-20);
  margin-top: 25px;
  cursor: pointer;
  user-select: none;
  font-size: 17px;
  padding-top: 0px;
  padding-bottom: 0px;
  line-height: 59px;
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
  top: 4px;
  left: 3px;
}

.ring-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 18px;
  margin: auto;
  width: 15px;
}

.ringring {
  border-radius: 30px;
  height: 25px;
  width: 25px;
  position: absolute;
  left: -5px;
  top: -4px;
  animation: pulsate 2.5s ease-out;
  animation-iteration-count: infinite;
  opacity: 0;
}
.dp-vps-location-flag {
  height: 14px;
  margin-top: 22px;
}
.dp-vps-location-text {
  margin-left: 10px;
}

.dp-vps-name-subtitle {
  width: 100%;
  font-size: 10px;
  filter: opacity(0.6);
}

.server-name {
  display: block;
  position: relative;
  line-height: 14px;
  margin-top: 15px;
}
.vps-location {
  display: inline-flex;
}

.vps-network {
  display: block;
  line-height: 14px;
  height: fit-content;
  margin-top: 16px;
}

.vps-network-ipv4,
.vps-network-ipv6,
.dp-vps-name-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dp-vps-name-title {
  margin-bottom: 4px;
}

.vps-actionbtn {
  padding: 6px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 14px;
}

.dp-vps-install-spinner,
.dp-vps-install-spinner:after {
  border-radius: 50%;
  width: 15px;
  height: 15px;
}
.dp-vps-install-spinner {
  font-size: 10px;
  border-top: 5px solid rgba(255, 255, 255, 0.2);
  border-right: 5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 5px solid rgba(255, 255, 255, 0.2);
  border-left: 5px solid var(--color-primary);
  animation: load8 0.8s infinite linear;
  margin-top: 17px;
  max-width: 15px;
  max-height: 15px;
}

@media only screen and (max-width: 1600px) {
  .table-grid {
    grid-template-columns:
      30px
      minmax(0, 2fr) minmax(0, 2fr) minmax(0, 2fr) 0 minmax(0, 1fr) minmax(80px, 220px);
  }
  .vps-network {
    visibility: hidden;
  }
}

@media only screen and (max-width: 1300px) {
  .table-grid {
    grid-template-columns:
      30px
      minmax(0, 2fr) 0 minmax(0, 2fr) 0 minmax(0, 1fr) minmax(80px, 150px);
  }
  .vps-location {
    visibility: hidden;
  }
}

@media only screen and (max-width: 1200px) {
  .table-grid {
    grid-gap: 0px;
  }
  .server-name {
    margin-left: 10px;
  }
}

@media only screen and (max-width: 800px) {
  .table-grid {
    grid-template-columns:
      30px minmax(0, 2fr) 0 0 0
      minmax(0, 1fr) minmax(80px, 150px);
  }
  .vps-billingdate {
    visibility: hidden;
  }
}

@media only screen and (max-width: 700px) {
  .table-grid {
    grid-template-columns: 30px minmax(0, 2fr) 0px 0px 0px auto 0px;
  }
  .vps-action {
    visibility: hidden;
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
</style>

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
  mounted() {
    var vm = this;

    vm.$root.api.get(`/qemu/myservers`).then((req) => {
      vm.$root.masterData.qemuServers = req.data;
    });
  },
  methods: {
    deleteServer(server) {
      var vm = this;
      vm.ignoreManageOpen = true;
      setTimeout(() => {
        vm.ignoreManageOpen = false;
      }, 200);

      vm.$root.api.get(`/qemu/myservers/${server.code}/delete`).then((req) => {
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

      vm.$root.api.get(`/qemu/myservers/${server.code}/cancel`).then((req) => {
        if (req.data.msg && req.data.msg.length > 0)
          vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

        if (req.data.success == true) {
          //redirect to correct dashboard
        }
      });
    },
    openVpsManager(vps) {
      if (vps.state > 3 && this.ignoreManageOpen == false) {
        this.$router.push({
          path: `/vps/${vps.code}`,
        });
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
    openOrderWindow() {
      this.$router.push({
        path: "/order",
      });
    },
    vpsStateIconColor(vps) {
      if (vps.state == 2) return `gray`;
      if (vps.state == 3) return `red`;
      if (vps.state == 4) return `orange`;
      if (vps.state == 5) return `green`;
    },
  },
};
</script>
