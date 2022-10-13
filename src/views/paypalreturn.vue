<template>
  <section></section>
</template>

<script>
export default {
  mounted() {
    var vm = this;
    if (vm.$route.query.status == "ok") {
      vm.$root.messages = [
        ...[
          {
            title: "PayPal",
            body: "Your order has been received, it can take a few minutes before the balance is added to your account. If you didn't receive the new balance within 1 hour, please contact support.",
            displayTime: 6,
            status: 1,
          },
        ],
        ...vm.$root.messages,
      ];
    } else {
      vm.$root.messages = [
        ...[
          {
            title: "PayPal",
            body: "Something went wrong while processing your order.",
            displayTime: 3,
            status: 0,
          },
        ],
        ...vm.$root.messages,
      ];
    }

    vm.$router.push({
      path: "/",
    });
  },
};
</script>
