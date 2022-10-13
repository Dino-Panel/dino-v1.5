import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/home.vue"),
  },
  {
    path: "/servers",
    name: "Servers",
    component: () => import("../views/pterodactylServers.vue"),
  },
  {
    path: "/invoices",
    name: "Invoices",
    component: () => import("../views/invoices.vue"),
  },
  {
    path: "/account",
    name: "My account",
    component: () => import("../views/account.vue"),
  },
  {
    path: "/order",
    name: "Order",
    component: () => import("../views/order.vue"),
  },
  {
    path: "/oidc_return",
    name: "OIDC Return",
    component: () => import("../views/oidc_return.vue"),
  },
  {
    path: "/paypalreturn",
    name: "PayPal Return",
    component: () => import("../views/paypalreturn.vue"),
  },

  {
    path: "/admin/users",
    name: "Users | ADMIN",
    component: () => import("../views/admin.users.vue"),
  },
  {
    path: "/admin/user/:userCode",
    name: "User | ADMIN",
    component: () => import("../views/admin.user.vue"),
  },
  {
    path: "/admin/servers",
    name: "Servers | ADMIN",
    component: () => import("../views/admin.pterodactylServers.vue"),
  },
  {
    path: "/vps",
    name: "Qemu Servers",
    component: () => import("../views/qemuServers.vue"),
  },
  {
    path: "/vps/:vpsCode",
    name: "VPS",
    component: () => import("../views/vps.vue"),
  },
  {
    path: "/vps/:vpsCode/:page",
    name: "VPS2",
    component: () => import("../views/vps.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
