<template>
  <section class="dp-admin-users-root">
    <div class="dp-admin-users-loading-spinner" v-if="isLoaded == false">
      <div class="dp-page-loading-spinner"></div>
    </div>

    <div class="dp-admin-users-table-root" v-else>
      <div class="dp-admin-users-table-header admin-users-table">
        <div class="dp-users-table-item">Username</div>
        <div class="dp-users-table-item">First name</div>
        <div class="dp-users-table-item">Last name</div>
        <div class="dp-users-table-item">Balance</div>
        <div class="dp-users-table-item">Servers</div>
        <div class="dp-users-table-item">VPSs</div>
        <div class="dp-users-table-item">Websites</div>
      </div>

      <div
        class="dp-admin-users-table-item admin-users-table"
        v-for="(user, index) of userList"
        :key="index"
        @click="gotoUser(user.code)"
      >
        <div class="dp-users-table-item">{{ user.username }}</div>
        <div class="dp-users-table-item">{{ user.firstName }}</div>
        <div class="dp-users-table-item">{{ user.lastName }}</div>
        <div class="dp-users-table-item">
          €{{ floatPriceToString(user.balance) }}
        </div>
        <div class="dp-users-table-item">{{ user.servers.length }}</div>
        <div class="dp-users-table-item">0</div>
        <div class="dp-users-table-item">0</div>
      </div>
    </div>
    <div style="padding-bottom: 20px; width: 20px">&nbsp;</div>
  </section>
</template>

<style scoped>
.admin-users-table {
  display: grid;
  padding: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 0.5fr) repeat(
      3,
      minmax(0, 0.4fr)
    );
}
.dp-admin-users-root {
  width: 100%;
}
.dp-admin-users-table-item {
  margin-top: 10px;
  background-color: var(--color-background--layer-40);
  cursor: pointer;
}

.dp-admin-users-table-item:hover {
  background-color: var(--color-background--layer-20);
}
.dp-admin-users-table-header {
  font-size: 20px;
  font-weight: bolder;
}

.dp-admin-users-table-root {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>

<script>
//const moment = require("moment");

export default {
  data() {
    return {
      userList: [],
      isLoaded: false,
    };
  },
  methods: {
    gotoUser(code) {
      this.$router.push({
        path: `/admin/user/${code}`,
      });
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
  },
  mounted() {
    var vm = this;
    this.$root.api.get("admin/users").then((res) => {
      vm.userList = res.data;
      vm.isLoaded = true;
    });
  },
};
</script>
