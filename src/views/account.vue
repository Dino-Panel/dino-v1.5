<template>
  <section class="dp-account-root">
    <div class="dp-account-container">
      <h1>Hey, {{ this.$root.masterData.account.username }}</h1>
      <small>
        Below you can make some changes to your account. Keep in mind that these
        changes will apply to all services that use Diskos ID for
        authentication.
      </small>

      <div class="dp-account-attribute-option-root">
        <div class="dp-account-attribute-option-left">First Name</div>
        <div class="dp-account-attribute-option-right">
          <input
            id="dp-form-name1"
            type="text"
            class="dp-account-attribute-option-input"
            maxlength="40"
            :value="setFirstName"
            @input="setFirstName = $event.target.value"
          />
        </div>
      </div>

      <div class="dp-account-attribute-option-root">
        <div class="dp-account-attribute-option-left">Last Name</div>
        <div class="dp-account-attribute-option-right">
          <input
            id="dp-form-name2"
            type="text"
            class="dp-account-attribute-option-input"
            maxlength="40"
            :value="setLastName"
            @input="setLastName = $event.target.value"
          />
        </div>
      </div>

      <div class="dp-account-attribute-option-root">
        <div class="dp-account-attribute-option-left">Email</div>
        <div class="dp-account-attribute-option-right">
          <input
            type="email"
            id="dp-form-email1"
            class="dp-account-attribute-option-input"
            maxlength="320"
            :value="setEmail"
            @input="setEmail = $event.target.value"
          />
        </div>
      </div>

      <button
        v-if="isUpdatingAccountDetails == true"
        class="dp-button-primary"
        style="width: 74px; height: 39px; padding-top: 7px; margin-top: 10px"
      >
        <div
          class="dp-btn-spinner"
          style="width: 12px; height: 12px; border-width: 3px; margin-top: 3px"
        ></div>
      </button>

      <button
        v-else
        class="dp-button-primary"
        style="margin-top: 10px"
        @click="saveNewAccountInfo()"
      >
        SAVE
      </button>

      <div class="dp-account-divide-line"></div>

      <h1 style="margin-top: 5px">Change Password</h1>
      <div class="dp-account-attribute-option-root">
        <div class="dp-account-attribute-option-left">New Password</div>
        <div class="dp-account-attribute-option-right">
          <input
            type="password"
            class="dp-account-attribute-option-input"
            maxlength="128"
            :value="setPassword1"
            @input="setPassword1 = $event.target.value"
          />
        </div>
      </div>
      <div class="dp-account-attribute-option-root">
        <div class="dp-account-attribute-option-left">Confirm Password</div>
        <div class="dp-account-attribute-option-right">
          <input
            type="password"
            class="dp-account-attribute-option-input"
            maxlength="128"
            :value="setPassword2"
            @input="setPassword2 = $event.target.value"
          />
        </div>
      </div>

      <div style="line-height: 15px; font-size: 14px; margin-top: 10px">
        New passwords requires at least 1 uppercase alphabetical character,
        <br />at least 1 lowercase alphabetical character and<br />must contain
        at least 1 numeric character
      </div>

      <button
        v-if="isUpdatingPassword == true"
        class="dp-button-primary"
        style="width: 205px; height: 39px; padding-top: 7px; margin-top: 10px"
      >
        <div
          class="dp-btn-spinner"
          style="width: 12px; height: 12px; border-width: 3px"
        ></div>
      </button>

      <button
        class="dp-button-primary"
        style="margin-top: 10px"
        v-else
        @click="saveNewPassword()"
      >
        CHANGE PASSWORD
      </button>

      <div class="dp-account-divide-line"></div>

      <h1 style="margin-top: 5px">Add Balance</h1>

      <div class="dp-account-addbalance-grid">
        <div class="dp-account-attribute-option-root2">
          <div class="dp-account-attribute-option-left">€</div>
          <div class="dp-account-attribute-option-right">
            <input
              :value="setAddBalance"
              @input="setAddBalance = $event.target.value"
              type="number"
              class="dp-account-attribute-option-input"
              max="250"
              min="5"
              step=".01"
            />
          </div>
        </div>

        <button
          v-if="isWaitingForPaypalUrl == true"
          class="dp-button-primary"
          style="width: 230px; height: 40px; padding-top: 7px"
        >
          <div
            class="dp-btn-spinner"
            style="width: 12px; height: 12px; border-width: 3px"
          ></div>
        </button>
        <button
          class="dp-button-primary"
          @click="makePaypalCheckoutUrl()"
          v-else
        >
          <i class="fa-brands fa-paypal" style="margin-right: 5px"></i>PAY WITH
          PAYPAL
        </button>
      </div>

      <div class="dp-account-divide-line"></div>

      <div class="dp-account-footer-text">POWERED BY DISKOS ID</div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      setEmail: "",
      setFirstName: "",
      setLastName: "",
      setAddBalance: 5,
      setPassword1: "",
      setPassword2: "",
      isUpdatingAccountDetails: false,
      isUpdatingPassword: false,
      isWaitingForPaypalUrl: false,
    };
  },
  mounted() {
    this.setFirstName = this.$root.masterData.account.firstName;
    this.setLastName = this.$root.masterData.account.lastName;
    this.setEmail = this.$root.masterData.account.email;
  },
  methods: {
    makePaypalCheckoutUrl() {
      var vm = this;
      vm.isWaitingForPaypalUrl = true;

      this.$root.api
        .post("paypal/createtransaction", {
          amount: vm.setAddBalance,
        })
        .then((req) => {
          window.location.href = req.data.checkout_url;

          setTimeout(() => {
            vm.isWaitingForPaypalUrl = false;
          }, 5000);
        });
    },
    saveNewPassword() {
      var vm = this;
      vm.isUpdatingPassword = true;
      const password = this.setPassword1;
      const confirm_password = this.setPassword2;

      this.$root.api
        .post("account/changepassword", {
          password,
          confirm_password,
        })
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

          vm.isUpdatingPassword = false;
        });
    },

    saveNewAccountInfo() {
      var vm = this;
      vm.isUpdatingAccountDetails = true;
      const first_name = this.setFirstName;
      const last_name = this.setLastName;
      const email = this.setEmail;

      this.$root.api
        .post("account/changeinfo", {
          first_name,
          last_name,
          email,
        })
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

          vm.isUpdatingAccountDetails = false;

          if (req.data.success == true) {
            vm.$root.masterData.account.firstName = vm.setFirstName;
            vm.$root.masterData.account.lastName = vm.setLastName;
            vm.$root.masterData.account.email = vm.setEmail;
          }
        });
    },
  },
};
</script>

<style scoped>
.dp-account-footer-text {
  margin-top: 10px;
  font-size: 10px;
  text-align: center;
  filter: opacity(0.2);
}
.dp-account-addbalance-grid {
  display: grid;
  grid-template-columns: 1fr 0.5fr;
}
.dp-account-divide-line {
  margin-top: 20px;
  background-color: var(--color-background--layer-20);
  width: 100%;
  height: 2px;
  border-radius: 4px;
}

.dp-account-attribute-option-root2 {
  width: 280px;
  display: grid;
  grid-template-columns: 40px 138px;
  grid-gap: 2px;
  margin-top: 5px;
}

.dp-account-attribute-option-root {
  width: 280px;
  display: grid;
  grid-template-columns: 190px 395px;
  grid-gap: 2px;
  margin-top: 5px;
}

.dp-account-attribute-option-left {
  background-color: var(--color-background--layer-10);
  line-height: 35px;
  font-size: 18px;
  font-weight: bolder;
  text-align: center;
  border-radius: 4px 0px 0px 4px;
  user-select: none;
}

.dp-account-attribute-option-right {
  background-color: var(--color-background--layer-10);
  line-height: 35px;
  font-size: 16px;
  font-weight: bolder;
  text-align: center;
  border-radius: 0px 4px 4px 0px;
  user-select: none;
}

.dp-account-attribute-option-input {
  width: calc(100% - 15px);
  height: 30px;
  background-color: transparent;
  border-style: none;
  color: white;
  font-size: 16px;
  font-family: Montserrat, Roboto, sans-serif;
}
.dp-account-attribute-option-input:focus {
  outline: none;
}

h1 {
  margin-bottom: 5px;
  margin-top: 0px;
}
.dp-account-root {
  position: relative;
  height: 685px;
}
.dp-account-container {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  padding: 10px;
  width: 690px;

  word-wrap: break-word;
  white-space: pre-line;

  background-color: var(--color-background--layer-40);
  border-radius: 4px;
}
</style>
