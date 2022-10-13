<template>
  <section class="dp-order-root">
    <div class="dp-order-step order-step1">
      <div class="dp-order-step-title">
        <div class="dp-order-step-number-root">
          <span class="dp-order-step-number-1">1</span>
        </div>
        <div class="dp-order-step-name">APPLICATION TYPE</div>
      </div>
      <div class="dp-order-step-content dp-order-step1-grid">
        <div
          class="dp-order-step1-item-root"
          :selected="chosenAppType == 'pterodactyl'"
          @click="setChosenApp('pterodactyl')"
        >
          <div class="dp-order-step1-item">
            <div class="dp-order-step1-item-logo">
              <img src="/img/logos/pterodactyl.svg" style="width: 100px" />
            </div>
            <div class="dp-order-step1-item-text">
              <div class="dp-order-step1-item-text-title">Pterodactyl</div>
              Open-source game <br />server management.
            </div>
          </div>
        </div>
        <tooltip
          style="width: 100% !important"
          text="Currently unavailable."
        >
        <div
          class="dp-order-step1-item-root"
          :selected="chosenAppType == 'qemu'"
          disabled="true"
        >
          <div class="dp-order-step1-item">
            <div class="dp-order-step1-item-logo">
              <img src="/img/logos/qemu.svg" style="width: 100px" />
            </div>
            <div class="dp-order-step1-item-text">
              <div class="dp-order-step1-item-text-title">VPS</div>
              High performance <br />virtual private servers.
            </div>
          </div>
        </div>
      </tooltip>

        <tooltip
          style="width: 100% !important"
          text="Currently unavailable. This feature will be<br> enabled somewhere in the near future."
        >
          <div
            class="dp-order-step1-item-root"
            :selected="chosenAppType == 'web'"
            disabled="true"
          >
            <div class="dp-order-step1-item">
              <div class="dp-order-step1-item-logo">
                <img src="/img/logos/cyberpanel.svg" style="width: 100px" />
              </div>
              <div class="dp-order-step1-item-text">
                <div class="dp-order-step1-item-text-title">Website</div>
                Simple, Fast and Secure <br />website hosting.
              </div>
            </div>
          </div>
        </tooltip>
      </div>
    </div>

    <div class="dp-order-step order-step2">
      <div class="dp-order-step-title">
        <div class="dp-order-step-number-root">
          <span class="dp-order-step-number-2">2</span>
        </div>
        <div class="dp-order-step-name">APPLICATION LOCATION</div>
      </div>
      <div class="dp-order-step-content dp-order-step2-grid">
        <div
          class="dp-order-step1-item-root"
          :selected="chosenLocation == 'de1'"
          @click="setChosenLocation('de1')"
        >
          <div class="dp-order-step2-item">
            <div class="dp-order-step1-item-logo">
              <img src="/img/flags-svg/de.svg" style="width: 50px" />
            </div>
            <div class="dp-order-step2-item-text">
              <div class="dp-order-step2-item-text-title">Germany</div>
              Falkenstein <br />
            </div>
          </div>
        </div>

        <div
          class="dp-order-step1-item-root"
          v-if="chosenAppType != 'qemu' && chosenAppType != 'web'"
          :selected="chosenLocation == 'fi1'"
          @click="setChosenLocation('fi1')"
        >
          <div class="dp-order-step2-item">
            <div class="dp-order-step1-item-logo">
              <img src="/img/flags-svg/fi.svg" style="width: 50px" />
            </div>
            <div class="dp-order-step2-item-text">
              <div class="dp-order-step2-item-text-title">Finland</div>
              Helsinki <br />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dp-order-step order-step2">
      <div class="dp-order-step-title">
        <div class="dp-order-step-number-root">
          <span class="dp-order-step-number-3">3</span>
        </div>
        <div class="dp-order-step-name">APPLICATION PACKAGE</div>
      </div>

      <div class="dp-order-step-content" v-if="chosenAppType == 'qemu'">
        <div
          class="dp-order-step3-grid-header grid-3-qemu"
          style="margin-top: 10px"
        >
          <div class="dp-order-step3-grid-header-item"></div>
          <div class="dp-order-step3-grid-header-item dp-vps-code">CODE</div>
          <div class="dp-order-step3-grid-header-item hide-on-small-screen">
            NAME
          </div>
          <div class="dp-order-step3-grid-header-item">CPU</div>
          <div class="dp-order-step3-grid-header-item">RAM</div>
          <div class="dp-order-step3-grid-header-item">DISK</div>
          <div class="dp-order-step3-grid-header-item dp-vps-images">
            Images
          </div>
          <div class="dp-order-step3-grid-header-item dp-vps-ipv4">IPv4</div>
          <div class="dp-order-step3-grid-header-item dp-vps-ipv6">IPv6</div>
          <div class="dp-order-step3-grid-header-item dp-vps-network">
            Network
          </div>
          <div class="dp-order-step3-grid-header-item">PRICE</div>
        </div>

        <div
          v-for="(pkg, index) in qemuPackages"
          :key="index"
          class="dp-order-step3-grid-row grid-3-qemu"
          :selected="isSelectedPackage(pkg.code)"
          :data-packageId="pkg.code"
          @click="setSelectedPackage($event)"
          style="margin-top: 15px"
        >
          <div class="dp-order-step3-grid-row-item" style="position: relative">
            <div class="dp-order-step3-selectdot"></div>
          </div>
          <div class="dp-order-step3-grid-row-item dp-vps-code">
            {{ pkg.code }}
          </div>
          <div class="dp-order-step3-grid-row-item">
            {{ pkg.name }}
          </div>

          <div class="dp-order-step3-grid-row-item">
            {{ pkg.specs.cpu }} CORE{{ pkg.specs.cpu != 1 ? "S" : "" }}
          </div>
          <div class="dp-order-step3-grid-row-item">
            {{
              pkg.specs.ram > 1023
                ? `${pkg.specs.ram / 1024} GB`
                : `${pkg.specs.ram} MB`
            }}
          </div>
          <div class="dp-order-step3-grid-row-item">
            {{
              pkg.specs.disk > 1023
                ? `${pkg.specs.disk / 1024} GB`
                : `${pkg.specs.disk} MB`
            }}
          </div>
          <div class="dp-order-step3-grid-row-item dp-vps-images">
            <span
              v-for="(image, index) of pkg.images"
              :key="index + 1000"
              style="margin-right: 10px"
            >
              {{ image }}
            </span>
          </div>

          <div class="dp-order-step3-grid-row-item dp-vps-ipv4">
            {{
              pkg.network.ipv4 == true ? `Yes, ${pkg.network.ipv4_type}` : `No`
            }}
          </div>

          <div class="dp-order-step3-grid-row-item dp-vps-ipv6">
            {{
              pkg.network.ipv6 == true ? `Yes, ${pkg.network.ipv6_type}` : `No`
            }}
          </div>

          <div class="dp-order-step3-grid-row-item dp-vps-network">
            {{ pkg.network.speed }}&sup2;
          </div>

          <div
            class="dp-order-step3-grid-row-item price-discounted"
            v-if="pkg.priceDiscounted"
          >
            <div class="dp-order-price-discount-original">€{{ pkg.price }}</div>
            <div class="dp-order-price-discount-discounted">
              €{{ pkg.priceDiscounted }}
            </div>
            <small class="dp-vps-price-month">/month</small>
          </div>

          <div class="dp-order-step3-grid-row-item" v-else>
            €{{ pkg.price }}<small class="dp-vps-price-month">/month</small>
          </div>
        </div>
      </div>

      <div class="dp-order-step-content" v-if="chosenAppType == 'pterodactyl'">
        <div class="dp-order-step3-grid2">
          <div
            class="dp-order-step3-grid2-item"
            v-for="(topCategory, index) of shownTopCategories()"
            :key="index * 9 + 100"
            @click="setchosenTopCategory(topCategory.code)"
            :active="chosenTopCategory == topCategory.code"
          >
            <div class="dp-order-step1-item-logo">
              <img :src="topCategory.image_url" style="height: 37.5px" />
            </div>
            <div class="dp-order-step2-item-text">
              <div class="dp-order-step2-item-text-title">
                {{ topCategory.title }}
              </div>
              {{ topCategory.subtitle }} <br />
            </div>
          </div>
        </div>
        <div class="dp-order-step3-grid-header" style="margin-top: 10px">
          <div class="dp-order-step3-grid-header-item"></div>
          <div class="dp-order-step3-grid-header-item hide-on-small-screen">
            CODE
          </div>
          <div class="dp-order-step3-grid-header-item hide-on-small-screen">
            NAME
          </div>
          <div class="dp-order-step3-grid-header-item">CPU</div>
          <div class="dp-order-step3-grid-header-item">RAM</div>
          <div class="dp-order-step3-grid-header-item">DISK</div>
          <div class="dp-order-step3-grid-header-item">PRICE</div>
        </div>

        <div
          v-for="(pkg, index) in pterodactylPackages.filter(
            (p) =>
              p.regions.includes(chosenLocation) &&
              p.categories.includes(chosenTopCategory)
          )"
          :key="index"
          class="dp-order-step3-grid-row"
          :selected="isSelectedPackage(pkg.code)"
          :data-packageId="pkg.code"
          @click="setSelectedPackage($event)"
          style="margin-top: 15px"
        >
          <div class="dp-order-step3-grid-row-item" style="position: relative">
            <div class="dp-order-step3-selectdot"></div>
          </div>
          <div class="dp-order-step3-grid-row-item hide-on-small-screen">
            {{ pkg.code }}
          </div>
          <div class="dp-order-step3-grid-row-item hide-on-small-screen">
            {{ pkg.name }}
          </div>
          <div class="dp-order-step3-grid-row-item">
            {{ pkg.specs.cpu }} CORE{{ pkg.specs.cpu != 1 ? "S" : "" }}
          </div>
          <div class="dp-order-step3-grid-row-item">{{ pkg.specs.ram }}</div>
          <div class="dp-order-step3-grid-row-item">{{ pkg.specs.disk }}</div>
          <div
            class="dp-order-step3-grid-row-item price-discounted"
            v-if="pkg.priceDiscounted"
          >
            <div class="dp-order-price-discount-original">€{{ pkg.price }}</div>
            <div class="dp-order-price-discount-discounted">
              €{{ pkg.priceDiscounted }}
            </div>
            <small class="hide-on-small-screen">/month</small>
          </div>

          <div class="dp-order-step3-grid-row-item" v-else>
            €{{ pkg.price }}<small class="hide-on-small-screen">/month</small>
          </div>
        </div>
      </div>
    </div>

    <div
      class="dp-order-step order-step2"
      v-if="chosenPackageId && chosenPackageId.startsWith('MCBUD')"
    >
      <div class="dp-order-step-title">
        <div class="dp-order-step-number-root">
          <span class="dp-order-step-number-4">4</span>
        </div>
        <div class="dp-order-step-name">APPLICATION PLATFORM</div>
      </div>
      <div class="dp-order-step-content dp-order-step2-grid">
        <div
          class="dp-order-step1-item-root"
          :selected="chosenRuntime == 'vanilla'"
          @click="setChosenRuntime('vanilla')"
        >
          <div class="dp-order-step2-item">
            <div class="dp-order-step1-item-logo">
              <img src="/img/logos/grass.png" height="37.5px" />
            </div>
            <div class="dp-order-step2-item-text">
              <div class="dp-order-step2-item-text-title">Vanilla</div>
              Vanilla Minecraft <br />
            </div>
          </div>
        </div>

        <div
          class="dp-order-step1-item-root"
          :selected="chosenRuntime == 'paper'"
          @click="setChosenRuntime('paper')"
          v-if="chosenPackageId != 'MCBUD1' && chosenPackageId != 'MCEX1'"
        >
          <div class="dp-order-step2-item">
            <div class="dp-order-step1-item-logo">
              <img src="/img/logos/paper.png" height="37.5px" />
            </div>
            <div class="dp-order-step2-item-text">
              <div class="dp-order-step2-item-text-title">Paper</div>
              Next generation of Minecraft<br />
            </div>
          </div>
        </div>
      </div>

        <div
          class="dp-order-step1-item-root"
          :selected="chosenRuntime == 'bedrock'"
          @click="setChosenRuntime('bedrock')"
          v-if="chosenPackageId != 'MCBUD1' && chosenPackageId != 'MCEX1'"
        >
          <div class="dp-order-step2-item">
            <div class="dp-order-step1-item-logo">
              <img src="/img/logos/bedrock.png" height="37.5px" />
            </div>
            <div class="dp-order-step2-item-text">
              <div class="dp-order-step2-item-text-title">Bedrock</div>
              Minecraft Bedrock <br />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dp-order-step order-step2">
      <div class="dp-order-step-title">
        <div class="dp-order-step-number-root">
          <span
            class="dp-order-step-number-5"
            v-if="chosenAppType == `pterodactyl`"
            >5</span
          >
          <span class="dp-order-step-number-4" v-if="chosenAppType == `qemu`"
            >4</span
          >
        </div>
        <div class="dp-order-step-name">APPLICATION CONFIGURATION</div>
      </div>
      <div class="dp-order-step-content">
        <div class="dp-order-app-config-container">
          <div style="text-align: center; font-weight: bold">
            Name your server{{ chosenServerCount != 1 ? "s" : "" }}
            <div
              class="dp-order-app-config-name-root"
              v-for="n in chosenServerCount"
              :key="n + 9 * 20"
            >
              <div class="dp-order-app-config-name-left">{{ n }}</div>
              <div class="dp-order-app-config-name-right">
                <input
                  type="text"
                  class="dp-order-app-config-name-input"
                  :value="chosenServerNames[n - 1] || `Server ${n}`"
                  maxlength="20"
                  @input="updateServerName(n, $event)"
                />
              </div>
            </div>
          </div>
          <div class="dp-order-servercount">
            <div>
              Servers to create
              <div class="dp-order-app-config-amount-root">
                <div
                  :disabled="chosenServerCount == 1"
                  class="dp-order-app-config-amount-left"
                  @click="removeServerCount()"
                >
                  -
                </div>
                <div class="dp-order-app-config-amount-center">
                  {{ chosenServerCount }}
                </div>
                <div
                  :disabled="
                    (chosenAppType == 'pterodactyl' &&
                      chosenServerCount == 9) ||
                    (chosenAppType == 'qemu' && chosenServerCount == 1)
                  "
                  class="dp-order-app-config-amount-right"
                  @click="addServerCount()"
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dp-order-underbar-root">
      <div class="dp-order-underbar-totalmonthly-root">
        <div class="dp-order-underbar-totalmonthly-text">Total:</div>
        <div class="dp-order-underbar-totalmonthly-price">
          €{{ calculateMonthlyTotal()
          }}<small class="dp-order-underbar-totalmonthly-price-small"
            >/month</small
          >
        </div>
      </div>
      <div
        class="dp-order-underbar-orderbtn"
        @click="createOrderObject()"
        v-if="isProcessingOrder == false"
      >
        <button class="dp-button-primary dp-dp-order-underbar-btnorder">
          BUY & DEPLOY
        </button>
      </div>

      <div class="dp-order-underbar-orderbtn" v-else>
        <button
          class="dp-button-primary dp-dp-order-underbar-btnorder"
          style="width: 199px; height: 47px; padding-top: 9px"
        >
          <div class="dp-btn-spinner"></div>
        </button>
      </div>
    </div>

    <div style="padding-bottom: 20px; width: 20px">&nbsp;</div>
  </section>
</template>

<script>
import tooltip from "@/components/tooltip.vue";

export default {
  components: {
    tooltip,
  },
  methods: {
    mouseOver(e) {
      console.log(e);
    },
    shownTopCategories() {
      var vm = this;
      var topCategories = [];
      var shownPackages = this.pterodactylPackages.filter((p) =>
        p.regions.includes(vm.chosenLocation)
      );

      for (var category of shownPackages) {
        for (var category1 of category.categories) {
          var category3 = topCategories.find((c) => c.code == category1);
          if (!category3) {
            var category2 = vm.pterodactylTopCategories.find(
              (c) => c.code == category1
            );
            topCategories.push(category2);
          }
        }
      }

      return topCategories;

      //
    },
    updateServerName(n, event) {
      this.chosenServerNames[n - 1] = event.target.value;
    },
    addServerCount() {
      this.chosenServerCount++;
      if (this.chosenAppType == "qemu") {
        if (this.chosenServerCount > 1) this.chosenServerCount = 1;
      }
      if (this.chosenAppType == "pterodactyl") {
        if (this.chosenServerCount > 9) this.chosenServerCount = 9;
      }
      this.$forceUpdate();
    },

    removeServerCount() {
      this.chosenServerCount--;
      if (this.chosenServerCount < 1) this.chosenServerCount = 1;
      this.$forceUpdate();
    },
    setChosenApp(app) {
      this.chosenAppType = app;
      this.chosenPackageId = null;
      this.setChosenLocation("de1");
      this.chosenServerCount = 1;
      this.$forceUpdate();
    },
    setChosenRuntime(runtime) {
      this.chosenRuntime = runtime;
      this.$forceUpdate();
    },
    setchosenTopCategory(topCategory) {
      var vm = this;
      this.chosenTopCategory = topCategory;

      if (this.chosenAppType == "pterodactyl") {
        var shownPackages = vm.pterodactylPackages.filter(
          (p) =>
            p.regions.includes(vm.chosenLocation) &&
            p.categories.includes(vm.chosenTopCategory)
        );
        var selectedPackageInNewLocation = shownPackages.find(
          (p) => p.code == vm.chosenPackageId
        );
        if (!selectedPackageInNewLocation) {
          vm.chosenPackageId = shownPackages[0].code;

          if (vm.chosenPackageId.startsWith("DC")) {
            vm.setChosenRuntime("nodejs");
          }
          if (vm.chosenPackageId.startsWith("MC")) {
            vm.setChosenRuntime("java");
          }
        }
      }

      this.$forceUpdate();
    },

    setChosenLocation(loc) {
      var vm = this;
      this.chosenLocation = loc;

      if (vm.chosenAppType == "pterodactyl") {
        var shownTopCategories = vm.shownTopCategories();
        if (shownTopCategories[0]) {
          vm.setchosenTopCategory(shownTopCategories[0].code);
        }
      }

      if (vm.chosenAppType == "qemu" && vm.qemuPackages[0]) {
        vm.chosenPackageId = vm.qemuPackages[0].code;
      }

      this.$forceUpdate();
    },
    isSelectedPackage(funcPackage) {
      var isChosen = this.chosenPackageId == funcPackage;
      return isChosen;
    },
    setSelectedPackage(event) {
      const path = event.path || (event.composedPath && event.composedPath());

      var object = path.find((ob) => ob.dataset.packageid != null);
      if (!object) {
        //gooi enge error neef
      }

      var packageId = object.dataset.packageid;

      if (packageId == "MCBUD1") {
        this.setChosenRuntime("java");
      }

      if (
        packageId.startsWith("DC") &&
        this.chosenPackageId.startsWith("DC") == false
      ) {
        this.setChosenRuntime("nodejs");
      }
      if (
        packageId.startsWith("MC") &&
        this.chosenPackageId.startsWith("MC") == false
      ) {
        this.setChosenRuntime("java");
      }

      this.chosenPackageId = packageId;

      this.$forceUpdate();
    },
    stringPriceToFloat(input) {
      if (input == undefined) return;
      input = input.replace(",", ".");
      input = parseFloat(input);
      return input;
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
    calculateMonthlyTotal() {
      var vm = this;
      if (vm.chosenAppType == "pterodactyl") {
        var pkg = vm.pterodactylPackages.find(
          (p) => p.code == vm.chosenPackageId
        );
        if (!pkg) return vm.floatPriceToString(0);
        var pkgPrice = vm.stringPriceToFloat(pkg.price);
        var priceTotalFloat = pkgPrice * vm.chosenServerCount;
        priceTotalFloat = Math.round(priceTotalFloat * 100) / 100;
        return vm.floatPriceToString(priceTotalFloat);
      } else if (vm.chosenAppType == "qemu") {
        pkg = vm.qemuPackages.find((p) => p.code == vm.chosenPackageId);

        if (!pkg) return vm.floatPriceToString(0);
        pkgPrice = vm.stringPriceToFloat(pkg.price);
        priceTotalFloat = pkgPrice * vm.chosenServerCount;
        priceTotalFloat = Math.round(priceTotalFloat * 100) / 100;
        return vm.floatPriceToString(priceTotalFloat);
      } else {
        return vm.floatPriceToString(0);
      }
    },
    createOrderObject() {
      var vm = this;
      vm.isProcessingOrder = true;
      var object = {
        appType: vm.chosenAppType,
        appLocation: vm.chosenLocation,
        appPackage: vm.chosenPackageId,
        appQuantity: vm.chosenServerCount,
        appNames: vm.chosenServerNames,
        appRuntime: vm.chosenRuntime,
      };
      console.log(object);

      vm.$root.api.post("/order", object).then((req) => {
        if (req.data.msg && req.data.msg.length > 0)
          vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

        vm.isProcessingOrder = false;

        if (req.data.success == true) {
          if (object.appType == "pterodactyl") {
            setTimeout(() => {
              vm.$router.push({
                path: "/servers",
              });
            }, 200);
          }
          if (object.appType == "qemu") {
            setTimeout(() => {
              vm.$router.push({
                path: "/vps",
              });
            }, 200);
          }

          //redirect to correct dashboard
        }
      });
    },
  },
  mounted() {
    //default config
    this.setChosenApp("pterodactyl");
    this.setChosenLocation("de1");
    this.setChosenRuntime("java");
  },

  data() {
    return {
      isProcessingOrder: false,
      chosenAppType: "",
      chosenRuntime: "",
      chosenLocation: "",
      chosenTopCategory: "mc1",
      chosenPackageId: "",
      chosenServerCount: 1,
      chosenServerNames: [""],
      qemuPackages: [
        {
        },
      ],
      pterodactylTopCategories: [
        {
          code: "mc1",
          title: "Minecraft",
          subtitle: "Cheap Servers",
          image_url: "/img/logos/minecraft.png",
        },
      ],
      pterodactylPackages: [
        {
          code: "MCBUD1",
          name: "Minecraft Bungee",
          regions: ["de1"],
          specs: {
            cpu: 1,
            ram: "512 MB",
            disk: "1 GB",
          },
          categories: ["mc1"],
          price: "0.60",
        },
      ],
    };
  },
};
</script>

<style scoped>
.dp-order-price-discount-original {
  text-decoration-color: var(--color-primary);
  text-decoration: line-through;
}

.dp-order-price-discount-discounted {
  color: var(--color-primary);
  margin-left: 5px;
}

.price-discounted {
  display: inline-flex;
}

.dp-dp-order-underbar-btnorder {
  font-size: 22px;
  font-weight: bold;
}
.dp-order-underbar-orderbtn {
  margin-left: auto;
}
.dp-order-underbar-root {
  margin-top: 20px;
  display: inline-flex;
  width: 100%;
}
.dp-order-underbar-totalmonthly-root {
  font-weight: bold;
  font-size: 26px;
}
.dp-order-underbar-totalmonthly-price {
  color: var(--color-primary);
}
.dp-order-underbar-totalmonthly-price-small {
  filter: opacity(0.7);
  font-size: 14px;
}

.dp-order-app-config-name-input {
  width: calc(100% - 15px);
  height: 30px;
  background-color: transparent;
  border-style: none;
  color: white;
  font-size: 16px;
  font-family: Montserrat, Roboto, sans-serif;
}
.dp-order-app-config-name-input:focus {
  outline: none;
}

.dp-order-app-config-amount-left[disabled="true"],
.dp-order-app-config-amount-right[disabled="true"] {
  background-color: var(--color-background--layer-30);
  cursor: not-allowed;
}

.dp-order-app-config-amount-left {
  background-color: var(--color-background--layer-10);
  line-height: 35px;
  font-size: 22px;
  font-weight: bolder;
  text-align: center;
  border-radius: 4px 0px 0px 4px;
  cursor: pointer;
  user-select: none;
}

.dp-order-app-config-name-left {
  background-color: var(--color-background--layer-10);
  line-height: 35px;
  font-size: 22px;
  font-weight: bolder;
  text-align: center;
  border-radius: 4px 0px 0px 4px;
  user-select: none;
}

.dp-order-app-config-name-right {
  background-color: var(--color-background--layer-10);
  line-height: 35px;
  font-size: 16px;
  font-weight: bolder;
  text-align: center;
  border-radius: 0px 4px 4px 0px;
  user-select: none;
}

.dp-order-app-config-amount-center {
  background-color: var(--color-background--layer-10);
  line-height: 35px;
  font-size: 22px;
  font-weight: bolder;
  text-align: center;
}
.dp-order-app-config-amount-right {
  background-color: var(--color-background--layer-10);
  line-height: 35px;
  font-size: 22px;
  font-weight: bolder;
  text-align: center;
  border-radius: 0px 4px 4px 0px;
  cursor: pointer;
  user-select: none;
}

.dp-order-app-config-name-root {
  width: 280px;
  display: grid;
  grid-template-columns: 30px 250px;
  grid-gap: 2px;
  margin-top: 5px;
}

.dp-order-app-config-amount-root {
  width: 180px;
  height: 35px;
  display: grid;
  grid-template-columns: 40px 100px 40px;
  grid-gap: 2px;
  margin-top: 5px;
}
.dp-order-step3-grid2-item {
  background-color: var(--color-background--layer-40);
  padding: 10px;
  border-radius: 4px;
  display: inline-flex;
  cursor: pointer;
}
.dp-order-step3-grid2-item:hover {
  background-color: var(--color-background--layer-20);
}
.dp-order-step3-grid2-item[active="true"] {
  background-color: var(--color-background--layer-10);
}
.dp-order-app-config-container {
  background-color: var(--color-background--layer-40);
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 4px;
  min-height: 62px;
  height: fit-content !important;
  display: inline-flex;
}
.dp-order-step3-selectdot {
  position: relative;
  height: 14px;
  width: 14px;
  border-radius: 100%;
  border-style: solid;
  border-width: 3px;
  border-color: var(--color-primary);
  margin-left: auto;
  margin-right: auto;
}
.dp-order-step3-grid-row[selected="true"] .dp-order-step3-selectdot::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: var(--color-primary);

  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.dp-order-step3-selectdot:hover {
  border-color: var(--color-primary--hover);
}
.dp-order-step3-grid-row[selected="true"] .dp-order-step3-selectdot {
  border-color: var(--color-primary--hover);
}
.dp-order-step3-grid-row[selected="true"] {
  background-color: var(--color-background--layer-10);
}

.dp-order-step3-grid-row {
  background-color: var(--color-background--layer-40);
  padding: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 4px;
  cursor: pointer;
}
.dp-order-step3-grid-row:hover {
  background-color: var(--color-background--layer-10);
}
.dp-order-step2-item {
  background-color: var(--color-background--layer-40);
  min-width: 335px;
  padding: 10px;
  border-radius: 4px;
  display: inline-flex;
  cursor: pointer;
  padding-top: 15px;
  width: calc(100% - 20px);
}
.dp-order-step2-item:hover {
  background-color: var(--color-background--layer-10);
}

.dp-order-step3-grid2 {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-gap: 10px;
  margin-top: 10px;
}

.dp-order-step3-grid-header-item {
  font-size: 18px;
  font-weight: bolder;
}
.dp-order-step3-grid-row {
  display: grid;
  grid-template-columns: 27px minmax(0, 0.5fr) repeat(5, minmax(0, 1fr));
  grid-gap: 10px;
  margin-top: 30px;
}

.dp-order-step3-grid-header {
  display: grid;
  grid-template-columns: 27px minmax(0, 0.5fr) repeat(5, minmax(0, 1fr));
  grid-gap: 10px;
  margin-top: 30px;
  padding: 10px;
}

.grid-3-qemu {
  grid-template-columns: 27px minmax(0, 0.5fr) repeat(9, minmax(0, 1fr));
}

.dp-order-step2-item-text {
  margin-left: 15px;
  font-size: 12px;
}

.dp-order-step2-item-text-title {
  font-weight: bolder;
  font-size: 18px;
}

.dp-order-step-number-3 {
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  top: 3px;
  left: 10px;
  margin: auto;
}

.dp-order-step-number-4 {
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  top: 3px;
  left: 7px;
  margin: auto;
}

.dp-order-step-number-5 {
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  top: 3px;
  left: 9px;
  margin: auto;
}

.dp-order-step-number-2 {
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  top: 3px;
  left: 9px;
  margin: auto;
}
.order-step2 {
  margin-top: 40px;
}
.dp-order-step2-grid {
  display: grid;
  grid-template-columns: repeat(4, 355px);
  grid-gap: 20px;
  margin-top: 30px;
}

.dp-order-step1-item-text {
  margin-left: 15px;
}
.dp-order-step1-item-text-title {
  font-weight: bolder;
  font-size: 22px;
}
.dp-order-step1-item {
  background-color: var(--color-background--layer-40);
  min-width: 335px;
  padding: 10px;
  border-radius: 4px;
  display: inline-flex;
  cursor: pointer;
  width: calc(100% - 20px);
}

.dp-order-step1-item:hover {
  background-color: var(--color-background--layer-20);
}
.dp-order-step1-item-root[selected="true"] .dp-order-step1-item {
  background-color: var(--color-background--layer-10);
}

.dp-order-step1-item-root[selected="true"] .dp-order-step2-item {
  background-color: var(--color-background--layer-10);
}

.dp-order-step1-item-root[disabled="true"] .dp-order-step1-item {
  background-color: var(--color-background--layer-10);
  cursor: not-allowed;
  filter: opacity(0.5);
}

.dp-order-step1-item-root {
  width: 100%;
}

.dp-order-step1-grid {
  display: grid;
  grid-template-columns: repeat(3, 355px);
  grid-gap: 20px;
  margin-top: 30px;
}
.dp-order-step-title {
  display: inline-flex;
}
.dp-order-step-number-root {
  position: relative;
  border-style: solid;
  width: 30px;
  height: 30px;
  border-radius: 100%;
}
.dp-order-step-number-1 {
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  top: 3px;
  left: 11px;
  margin: auto;
}
.dp-order-step-name {
  line-height: 36px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 22px;
}
.dp-order-step-content {
  margin-top: 10px;
  width: 100%;
}
.dp-order-root {
  margin-top: 25px;
  margin-left: 50px;
  margin-right: 50px;
  width: calc(100% - 100px);
  user-select: none;
}
.dp-order-servercount {
  width: 180px;
  text-align: center;
  font-weight: bold;
  margin-left: auto;
  margin-right: 5px;
}

@media only screen and (max-width: 1610px) {
  .dp-order-step2-grid {
    grid-template-columns: repeat(3, 355px);
  }
  .dp-order-step1-grid {
    grid-template-columns: repeat(3, 355px);
  }

  .grid-3-qemu {
    grid-template-columns: 27px minmax(0, 0.5fr) repeat(4, minmax(0, 1fr)) 0px repeat(
        4,
        minmax(0, 1fr)
      );
  }
  .dp-vps-images {
    visibility: hidden;
  }
}

@media only screen and (max-width: 1400px) {
  .dp-order-step3-grid2 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .dp-content {
    margin-left: 15px;
    margin-right: 15px;
    width: calc(100% - 30px);
  }

  .grid-3-qemu {
    grid-template-columns: 27px minmax(0, 0.5fr) repeat(4, minmax(0, 1fr)) 0px repeat(
        4,
        minmax(0, 1fr)
      );
  }
  .dp-vps-images {
    visibility: hidden;
  }
}

@media only screen and (max-width: 1230px) {
  .dp-order-step2-grid {
    grid-template-columns: repeat(2, 355px);
  }
  .dp-order-step1-grid {
    grid-template-columns: repeat(2, 355px);
  }

  .grid-3-qemu {
    grid-template-columns:
      27px minmax(0, 0.5fr) repeat(4, minmax(0, 1fr)) 0px repeat(
        2,
        minmax(0, 1fr)
      )
      0px minmax(0, 1fr);
  }
  .dp-vps-network {
    visibility: hidden;
  }
}

@media only screen and (max-width: 855px) {
  .dp-order-step2-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .dp-order-step1-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media only screen and (max-width: 1300px) {
  .dp-order-step3-grid2 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media only screen and (max-width: 1000px) {
  .dp-order-step3-grid2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .dp-content {
    margin-left: 15px;
    margin-right: 15px;
    width: calc(100% - 30px);
  }

  .grid-3-qemu {
    grid-template-columns:
      27px minmax(0, 0.5fr) repeat(4, minmax(0, 1fr)) 0px 0px minmax(0, 1fr)
      0px minmax(0, 1fr);
    grid-gap: 0px;
  }
  .dp-vps-ipv4 {
    visibility: hidden;
  }
}

@media only screen and (max-width: 900px) {
  .grid-3-qemu {
    grid-template-columns:
      27px minmax(0, 0.5fr) repeat(4, minmax(0, 1fr)) 0px 0px 0px
      0px minmax(0, 1fr);
  }
  .dp-vps-ipv6 {
    visibility: hidden;
  }
  .dp-vps-price-month {
    display: none;
  }
}

@media only screen and (max-width: 690px) {
  .dp-order-step3-grid2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media only screen and (max-width: 525px) {
  .dp-order-step3-grid2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
@media only screen and (max-width: 800px) {
  .hide-on-small-screen {
    visibility: hidden;
  }
  .dp-order-app-config-container {
    flex-wrap: wrap;
  }
  .dp-order-step3-grid-row {
    grid-template-columns: 27px 0px 0px repeat(4, minmax(0, 1fr));
    font-size: 15px;
  }
  .dp-order-step3-grid-header {
    grid-template-columns: 27px 0px 0px repeat(4, minmax(0, 1fr));
  }
  /* .dp-order-step3-grid-row[selected="true"] .dp-order-step3-selectdot::after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 10px;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background-color: var(--color-primary);
  } */

  .grid-3-qemu {
    grid-template-columns:
      27px 0 repeat(4, minmax(0, 1fr)) 0 0 0
      0 minmax(0, 1fr);
  }

  .dp-vps-code {
    visibility: hidden;
  }
}
</style>
