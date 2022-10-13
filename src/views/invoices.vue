<template>
  <section class="dp-invoices-root">
    <div class="dp-invoices-loading-spinner" v-if="isLoaded == false">
      <div class="dp-page-loading-spinner"></div>
    </div>
    <div
      class="dp-invoices-noinvoices-root"
      v-if="invoiceList.length == 0 && isLoaded == true"
    >
      <div class="dp-invoices-noinvoices-title">No invoices :)</div>
      <div class="dp-invoices-noinvoices-subtitle">
        Invoices will only be created at the end of each month.
      </div>
    </div>
    <div
      class="dp-invoices-list-table-root"
      v-if="invoiceList.length != 0 && isLoaded == true"
    >
      <div class="dp-invoices-list-table-header dp-invoices-table">
        <div class="dp-invoices-list-table-header-item">#</div>
        <div class="dp-invoices-list-table-header-item item-date">
          Invoice date
        </div>
        <div class="dp-invoices-list-table-header-item item-amount">
          Invoice amount
        </div>
        <div class="dp-invoices-list-table-header-item item-download"></div>
      </div>

      <div
        class="dp-invoices-list-table-item dp-invoices-table"
        v-for="(invoice, index) of invoiceList"
        :key="index"
      >
        <div class="dp-invoices-list-table-header-item">
          {{
            invoice.internalFilePath.split("/")[
              invoice.internalFilePath.split("/").length - 1
            ]
          }}
        </div>
        <div class="dp-invoices-list-table-header-item item-date">
          {{ convertUtcBillingDate(invoice.date) }}
        </div>
        <div class="dp-invoices-list-table-header-item item-amount">
          €{{ floatPriceToString(invoice.total) }}
        </div>
        <div
          class="dp-invoices-list-table-header-item item-download"
          style="height: 39px"
        >
          <button
            v-if="downloadingInvoice == invoice._id"
            class="dp-button-primary"
            style="width: 209px; height: 39px; padding-top: 9px"
          >
            <div
              class="dp-btn-spinner"
              style="
                width: 12px;
                height: 12px;
                border-width: 3px;
                margin-top: 3px;
              "
            ></div>
          </button>

          <button
            v-else
            class="dp-button-primary"
            style="margin-top: 0px"
            @click="
              downloadInvoice(
                invoice._id,
                invoice.internalFilePath.split(`/`)[
                  invoice.internalFilePath.split(`/`).length - 1
                ]
              )
            "
          >
            DOWNLOAD INVOICE
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const moment = require("moment");

export default {
  data() {
    return {
      invoiceList: [],
      downloadingInvoice: null,
      isLoaded: false,
    };
  },
  mounted() {
    var vm = this;
    if (!vm?.$route?.query?.invoices) {
      this.$root.api.get("account/invoices").then((res) => {
        vm.invoiceList = res.data;
        vm.isLoaded = true;
      });
    } else {
      vm.invoiceList = JSON.parse(vm.$route.query.invoices);
      vm.isLoaded = true;
    }
  },
  methods: {
    downloadInvoice(id, filename) {
      var vm = this;

      vm.downloadingInvoice = id;
      this.$root.api
        .get(`account/invoices/${id}`, {
          responseType: "blob",
        })
        .then((blob) => {
          var url = window.URL.createObjectURL(blob.data);
          var a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
          vm.downloadingInvoice = null;
          //
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
.dp-invoices-list-table-root {
  margin-top: 20px;
}

.dp-invoices-list-table-header-item {
  line-height: 39px;
}
.dp-invoices-list-table-item {
  margin-top: 10px;
  background-color: var(--color-background--layer-40);
}
.dp-invoices-list-table-root {
  margin-left: 20px;
  margin-right: 20px;
}
.dp-invoices-table {
  display: grid;
  padding: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.dp-invoices-list-table-header {
  font-size: 20px;
  font-weight: bolder;
}

.dp-invoices-root,
.dp-invoices-noinvoices-root {
  width: 100%;
}
.dp-invoices-noinvoices-root {
  margin-top: 20px;
  margin-right: 10px;
  margin-left: 0px;

  word-wrap: break-word;
  white-space: pre-line;
}
.dp-invoices-noinvoices-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
}

.dp-invoices-noinvoices-subtitle {
  text-align: center;
  font-size: 20px;
  font-weight: normal;
}

@media only screen and (max-width: 950px) {
  .dp-invoices-table {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0) minmax(
        0,
        1fr
      );
  }
  .item-amount {
    display: none;
  }
}

@media only screen and (max-width: 750px) {
  .dp-invoices-table {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0) minmax(0, 0) minmax(
        0,
        1fr
      );
  }
  .item-date {
    display: none;
  }
}

@media only screen and (max-width: 500px) {
  .dp-invoices-table {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0) minmax(0, 0) minmax(0, 0);
  }
  .item-download {
    display: none;
  }
}
</style>
