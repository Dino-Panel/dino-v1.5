<template>
  <section class="dp-admin-user-root">
    <div
      class="dp-admin-user-loading-spinner"
      v-if="isLoaded == false || userData == {}"
    >
      <div class="dp-page-loading-spinner"></div>
    </div>

    <div class="dp-admin-user-contentblocks" v-else>
      <div class="dp-admin-user-contentblock">
        <h1 class="dp-admin-contentblock-header">General</h1>
        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">Username:</div>
          <div class="dp-admin-data-value">{{ userData.username }}</div>
        </div>
        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">Email:</div>
          <div class="dp-admin-data-value">{{ userData.email }}</div>
        </div>
        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">First name:</div>
          <div class="dp-admin-data-value">{{ userData.firstName }}</div>
        </div>
        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">Last name:</div>
          <div class="dp-admin-data-value">{{ userData.lastName }}</div>
        </div>
        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">Balance:</div>
          <div class="dp-admin-data-value">
            €{{ floatPriceToString(userData.balance) }}
          </div>
        </div>

        <div class="dp-admin-name-data-value-row" style="margin-top: 10px">
          <div class="dp-admin-data-data">Owned servers:</div>
          <div class="dp-admin-data-value">
            {{ userData.servers.length }}
          </div>
        </div>

        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">Owned VPSs:</div>
          <div class="dp-admin-data-value">0</div>
        </div>

        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">Owned websites:</div>
          <div class="dp-admin-data-value">0</div>
        </div>

        <div class="dp-admin-name-data-value-row" style="margin-top: 10px">
          <div class="dp-admin-data-data">Admin:</div>
          <div class="dp-admin-data-value">
            {{ (userData.isAdmin || false) == true ? `Yes` : `No` }}
          </div>
        </div>
        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">Master Admin:</div>
          <div class="dp-admin-data-value">
            {{ (userData.isMasterAdmin || false) == true ? `Yes` : `No` }}
          </div>
        </div>

        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">Code:</div>
          <div class="dp-admin-data-value">{{ userData.code }}</div>
        </div>

        <div class="dp-admin-name-data-value-row">
          <div class="dp-admin-data-data">ID:</div>
          <div class="dp-admin-data-value">{{ userData._id }}</div>
        </div>

        <div class="dp-admin-owned-objects-navbtns">
          <button
            class="dp-button-primary"
            @click="openServerWindow(userData.code)"
          >
            VIEW SERVERS
          </button>
          <button
            class="dp-button-primary"
            style="margin-left: 10px"
            @click="openInvoiceWindow(userData.invoices)"
          >
            VIEW INVOICES
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLoaded: false,
      userData: {},
    };
  },
  mounted() {
    var vm = this;
    this.$root.api.get("admin/users").then((res) => {
      const userCode = vm.$route.params.userCode;
      vm.userData = res.data.find((u) => u.code == userCode);
      vm.isLoaded = true;

      console.log(vm.userData);
    });
  },
  methods: {
    openInvoiceWindow(invoices) {
      this.$router.push({
        path: `/invoices`,
        query: {
          invoices: JSON.stringify(invoices),
        },
      });
    },

    openServerWindow(userCode) {
      this.$router.push({
        path: `/admin/servers`,
        query: {
          filter_user: userCode,
        },
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
};
</script>

<style scoped>
.dp-admin-name-data-value-row {
  display: grid;
  grid-template-columns: 180px 400px;
}
.dp-admin-data-data {
  font-weight: bold;
}

.dp-admin-user-root {
  width: 100%;
}
.dp-admin-user-contentblocks {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

.dp-admin-user-contentblock {
  background-color: var(--color-background--layer-40);
  padding: 10px;
}
.dp-admin-contentblock-header {
  margin-top: 0px;
  font-size: 24px;
  margin-bottom: 5px;
  text-align: center;
}
.dp-admin-owned-objects-navbtns {
  display: inline-flex;
  margin-top: 20px;
}
</style>
