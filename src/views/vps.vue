<template>
  <section style="width: 100%" v-if="isLoaded == false || vps == null">
    <div class="dp-page-loading-spinner"></div>
  </section>
  <section class="dp-vps-root" v-else>
    <div class="dp-vps-topbar-root">
      <div class="dp-vps-topbar-powerstatus" style="width: 30px">
        <div
          :class="`ring-container ${vpsStateIconColor()}`"
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

      <div
        class="dp-vps-topbar-servername-root-static"
        v-if="modifyname == false"
      >
        <div class="dp-vps-topbar-servername">
          {{ vps.name }}
        </div>
        <div class="dp-vps-topbar-servername-modify">
          <i
            class="fa-light fa-pen"
            @click="
              modifiedname = vps.name;
              modifyname = true;
            "
          ></i>
        </div>
      </div>

      <div class="dp-vps-topbar-servername-root-editor" v-else>
        <input
          type="text"
          :value="modifiedname"
          @input="modifiedname = $event.target.value"
          class="dp-vps-topbar-servername-modify"
        />
        <button
          class="dp-button-primary dp-vps-topbar-servername-savebtn"
          v-if="savingname == false"
          @click="saveName(modifiedname)"
        >
          SAVE
        </button>
        <button
          class="dp-button-primary dp-vps-topbar-servername-savebtn"
          v-else
        >
          <div
            class="dp-btn-spinner dp-vps-topbar-servername-savebtn-spinner"
          ></div>
        </button>
      </div>

      <div class="dp-vps-topbar-specs"></div>
      <div class="dp-vps-topbar-spacer"></div>
      <div class="dp-vps-topbar-powercontrol">
        <div
          class="powercontrol-root"
          v-if="
            (vps.state == 4 || vps.state == 5) && vps.status.installed == true
          "
        >
          <tooltip
            :text="vps.state == 5 ? `Server is already running` : `Start`"
          >
            <button
              @click="powerAction('start')"
              class="dp-button-primary powercontrol-btn-leftedge"
              :disabled="vps.state == 5"
            >
              <i class="fa-regular fa-play"></i>
            </button>
          </tooltip>
          <tooltip :text="vps.state == 4 ? `Server must be running` : `Kill`">
            <button
              @click="powerAction('kill')"
              class="dp-button-primary powercontrol-btn-center"
              :disabled="vps.state == 4"
            >
              <i class="fa-regular fa-stop"></i>
            </button>
          </tooltip>
          <tooltip
            :text="vps.state == 4 ? `Server must be running` : `Reset`"
            style="width: 100%"
            @click="powerAction('reset')"
          >
            <button
              class="dp-button-primary powercontrol-btn-rightedge"
              :disabled="vps.state == 4"
            >
              <i class="fa-regular fa-bolt"></i>
            </button>
          </tooltip>
        </div>
      </div>
    </div>

    <div class="dp-vps-nav-content-grid">
      <div class="dp-vps-nav-root">
        <div
          class="dp-vps-nav-item"
          :selected="page == `dashboard`"
          @click="screen(`dashboard`)"
        >
          <div class="dp-vps-nav-item-icon">
            <i class="fa-thin fa-table-columns"></i>
          </div>
          <div class="dp-vps-nav-item-text">Dashboard</div>
        </div>

        <div
          class="dp-vps-nav-item"
          :selected="page == `monitor`"
          @click="screen(`monitor`)"
        >
          <div class="dp-vps-nav-item-icon">
            <i class="fa-thin fa-desktop"></i>
          </div>
          <div class="dp-vps-nav-item-text">Monitor</div>
        </div>

        <div
          class="dp-vps-nav-item"
          :selected="page == `shell`"
          v-if="
            vps.firewall_rules.find(
              (r) => r.private_port == 22 && r.type == 'tcp'
            )
          "
          @click="screen(`shell`)"
        >
          <div class="dp-vps-nav-item-icon">
            <i class="fa-thin fa-terminal"></i>
          </div>
          <div class="dp-vps-nav-item-text">Shell</div>
        </div>

        <div
          class="dp-vps-nav-item"
          :selected="page == `graphs`"
          style="display: none"
          @click="screen(`graphs`)"
        >
          <div class="dp-vps-nav-item-icon">
            <i class="fa-thin fa-chart-area"></i>
          </div>
          <div class="dp-vps-nav-item-text">Graphs</div>
        </div>

        <div
          class="dp-vps-nav-item"
          :selected="page == `isos`"
          @click="screen(`isos`)"
        >
          <div class="dp-vps-nav-item-icon">
            <i class="fa-thin fa-usb-drive"></i>
          </div>
          <div class="dp-vps-nav-item-text">ISO's</div>
        </div>

        <div
          class="dp-vps-nav-item"
          :selected="page == `cloudinit`"
          @click="screen(`cloudinit`)"
        >
          <div class="dp-vps-nav-item-icon">
            <i class="fa-thin fa-cloud-arrow-down"></i>
          </div>
          <div class="dp-vps-nav-item-text">Cloudinit</div>
        </div>

        <div
          class="dp-vps-nav-item"
          :selected="page == `firewall`"
          @click="screen(`firewall`)"
        >
          <div class="dp-vps-nav-item-icon">
            <i class="fa-thin fa-shield-keyhole"></i>
          </div>
          <div class="dp-vps-nav-item-text">NAT Firewall</div>
        </div>

        <div
          class="dp-vps-nav-item"
          :selected="page == `activity`"
          style="display: none"
          @click="screen(`activity`)"
        >
          <div class="dp-vps-nav-item-icon">
            <i class="fa-thin fa-camera-cctv"></i>
          </div>
          <div class="dp-vps-nav-item-text">Activity</div>
        </div>
      </div>
      <div
        class="dp-vps-content-root vps-content-monitor"
        v-if="page == `monitor`"
      >
        <iframe
          id="vnc-window"
          :src="vncUri()"
          class="dp-vps-monitor-iframe"
          frameBorder="0"
        ></iframe>
      </div>

      <div
        class="dp-vps-content-root vps-content-monitor"
        v-if="page == `shell`"
      >
        <iframe
          id="vnc-window"
          :src="sshUri()"
          class="dp-vps-monitor-iframe"
          frameBorder="0"
        ></iframe>
      </div>

      <div
        class="dp-vps-content-root vps-content-monitor"
        v-if="page == `graphs`"
      >
        Imagine a live graphs here
      </div>

      <div
        class="dp-vps-content-root vps-content-dashboard"
        v-if="page == `dashboard`"
      >
        <div
          class="vps-cards-card-static rw-2"
          v-if="$root?.masterData?.servicesCount?.pterodactyl"
        >
          <div class="vps-card-header">THIS SERVER</div>
          <div class="vps-card-content">
            <div class="server-info-grid">
              <div class="server-info-item">
                <div class="info-item-icon">
                  <i class="fa-light fa-microchip"></i>
                </div>
                <div class="info-item-text">
                  <div class="info-item-text-title">{{ vps.specs.cpu }}</div>
                  <div class="info-item-text-subtitle">
                    CORE{{ vps.specs.cpu == 1 ? "" : "S" }}
                  </div>
                </div>
              </div>

              <div class="server-info-item">
                <div class="info-item-icon">
                  <i class="fa-light fa-memory"></i>
                </div>
                <div class="info-item-text">
                  <div class="info-item-text-title">
                    {{
                      vps.specs.ram > 1023
                        ? `${vps.specs.ram / 1024} GB`
                        : `${vps.specs.ram} MB`
                    }}
                  </div>
                  <div class="info-item-text-subtitle">MEMORY</div>
                </div>
              </div>

              <div class="server-info-item">
                <div class="info-item-icon">
                  <i class="fa-light fa-hard-drive"></i>
                </div>
                <div class="info-item-text">
                  <div class="info-item-text-title">
                    {{
                      vps.specs.disk > 1023
                        ? `${vps.specs.disk / 1024} GB`
                        : `${vps.specs.disk} MB`
                    }}
                  </div>
                  <div class="info-item-text-subtitle">STORAGE</div>
                </div>
              </div>

              <div class="server-info-item">
                <div class="info-item-icon">
                  <i class="fa-light fa-euro-sign"></i>
                </div>
                <div class="info-item-text">
                  <div class="info-item-text-title">
                    {{ floatPriceToString(vps.price) }}
                  </div>
                  <div class="info-item-text-subtitle">/MONTH</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="vps-cards-card-static"
          v-if="$root?.masterData?.servicesCount?.pterodactyl"
        >
          <div class="vps-card-header">CLOUDINIT</div>
          <div class="vps-card-content">
            <div class="dashboard-cloudinit-grid">
              <span style="font-weight: bold">Username: </span>
              <span>root</span>
            </div>

            <div class="dashboard-cloudinit-grid">
              <span style="font-weight: bold">Password: </span>
              <span style="user-select: text">{{
                vps.cloudinit.password
              }}</span>
            </div>

            <p style="font-size: 14px; position: absolute; bottom: 0px">
              Use these credentials to login to your server. If you don't change
              this password you can always access your server via the shell tab.
            </p>
          </div>
        </div>

        <div
          class="vps-cards-card-static"
          v-if="$root?.masterData?.servicesCount?.pterodactyl"
        >
          <div class="vps-card-header">NETWORK</div>
          <div class="vps-card-content">
            <div class="dashboard-network-config-grid">
              <span style="font-weight: bold">IPv4: </span
              ><span>{{ vps.network.ipv4 }}/24</span>
            </div>

            <div class="dashboard-network-config-grid">
              <span style="font-weight: bold">IPv6: </span
              ><span>{{ vps.network.ipv6 }}/112</span>
            </div>
            <div
              class="dashboard-network-config-grid"
              v-if="vps.network.ipv4_gateway"
            >
              <span style="font-weight: bold">IPv4 Gateway: </span
              ><span>{{ vps.network.ipv4_gateway }}</span>
            </div>

            <div
              class="dashboard-network-config-grid"
              v-if="vps.network.ipv6_gateway"
            >
              <span style="font-weight: bold">IPv6 Gateway: </span
              ><span>{{ vps.network.ipv6_gateway }}</span>
            </div>
            <div class="dashboard-network-config-grid">
              <span style="font-weight: bold">IPv4 DNS: </span
              ><span>10.0.0.2</span>
            </div>

            <div class="dashboard-network-config-grid">
              <span style="font-weight: bold">IPv6 DNS: </span
              ><span>2a01:4f8:271:59ca:a::2</span>
            </div>
          </div>
        </div>

        <div
          class="vps-cards-card-static rh-2"
          style="height: 100%"
          v-if="$root?.masterData?.servicesCount?.pterodactyl"
        >
          <div class="vps-card-header">ACTIVITY</div>
          <div class="vps-card-content">
            <p
              v-if="vps.activity == null || vps.activity.length == 0"
              style="text-align: center"
            >
              No activity found.
            </p>

            <div class="vps-activity-root">
              <div
                class="activity-item"
                v-for="(act, index) of vps.activity"
                :key="index + 5000"
              >
                <div class="activity-icon"></div>
                <div class="activity-text">
                  <div class="activity-title">
                    {{ activityRename(act) }}
                  </div>
                  <div class="activity-subtitle subtitle-date">
                    {{ convertUtcTimestampToLocalTimestamp(act.timestamp) }}
                  </div>

                  <div class="activity-subtitle" v-if="eventData(act)">
                    {{ eventData(act) }}
                  </div>

                  <div class="activity-subtitle">
                    Executed by {{ act.snapshots.user.username }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="dp-vps-content-root vps-content-activity"
        v-if="page == `activity`"
      >
        <div class="dp-vps-activity-table-root">
          <div class="dp-activity-table-header">
            <div class="dp-activity-table-header-item">User</div>
            <div class="dp-activity-table-header-item">Activity</div>
            <div class="dp-activity-table-header-item">Timestamp</div>
          </div>

          <div
            class="dp-activity-table-row"
            v-for="(activity, index) of vps.activity"
            :key="index"
          >
            <div class="dp-activity-table-header-item">
              <tooltip
                text="
                <div style='display:grid; grid-template-columns:100px auto'>
                  <div style='font-weight: bolder'>Username:</div>
                  <div>jdekuijper</div>
                </div>
                <div style='display:grid; grid-template-columns:100px auto'>
                  <div style='font-weight: bolder'>First name:</div>
                  <div>Jeroen</div>
                </div>
                <div style='display:grid; grid-template-columns:100px auto'>
                  <div style='font-weight: bolder'>Last name:</div>
                  <div>de Kuijper</div>
                </div>"
                >jdekuijper</tooltip
              >
            </div>
            <div class="dp-activity-table-header-item">
              {{ activity.activity }}
            </div>
            <div class="dp-activity-table-header-item">
              <tooltip
                :text="`${convertUtcTimestampToLocalTimestamp(
                  activity.timestamp
                )}, Your local time`"
                >{{
                  convertUtcTimestampToLocalTimestamp(activity.timestamp)
                }}</tooltip
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="dp-vps-content-root vps-content-firewall"
        v-if="page == `firewall`"
      >
        <div class="firewall-table-root">
          <div class="firewall-table-header">
            <div class="firewall-table-header-item">#</div>
            <div class="firewall-table-header-item">Public IPv4</div>
            <div class="firewall-table-header-item">Public port</div>
            <div class="firewall-table-header-item rule-private-ip">
              Private IPv4
            </div>
            <div class="firewall-table-header-item">Private port</div>
            <div class="firewall-table-header-item firewall-rule-type">
              Type
            </div>
            <div class="firewall-table-header-item firewall-action"></div>
          </div>

          <div
            class="firewall-table-row"
            v-for="(firewallRule, index) of vps.firewall_rules"
            :key="index + 1000"
          >
            <div class="firewall-table-row-item">{{ index + 1 }}</div>
            <div class="firewall-table-row-item">
              {{ firewallRule.public_ip }}
            </div>
            <div class="firewall-table-row-item">
              {{ firewallRule.public_port }}
            </div>
            <div class="firewall-table-row-item rule-private-ip">
              {{ firewallRule.private_ip }}
            </div>
            <div class="firewall-table-row-item">
              {{ firewallRule.private_port }}
            </div>
            <div class="firewall-table-row-item firewall-rule-type">
              {{ firewallRule.type.toUpperCase() }}
            </div>
            <div class="firewall-table-row-item firewall-action">
              <button
                class="dp-button-primary dp-vps-firewall-rule-btn firewall-rule-deletebtn"
                @click="deleteFirewallRule(firewallRule.rule_id)"
              >
                DELETE
              </button>
            </div>
          </div>

          <div class="firewall-table-row firewall-table-row-newrule">
            <div class="firewall-table-row-item">
              {{ vps.firewall_rules.length + 1 }}
            </div>
            <div class="firewall-table-row-item">
              {{ vps.firewall_rules[0]?.public_ip }}
            </div>
            <div class="firewall-table-row-item"></div>
            <div class="firewall-table-row-item">
              {{ vps.firewall_rules[0]?.private_ip }}
            </div>
            <div class="firewall-table-row-item">
              <input
                type="number"
                id="newRulePrivatePort"
                class="dp-vps-firewall-rule-modify-field"
                value="80"
                min="1"
                max="65535"
              />
            </div>
            <div
              class="firewall-table-row-item firewall-rule-type"
              style="margin-left: 5px"
            >
              <div class="firewall-type-btn-grid">
                <button
                  class="dp-button-primary firewall-type-btn firewall-type-btn-left"
                  :disabled="firewallRuleType == `tcp`"
                  @click="firewallRuleType = `tcp`"
                >
                  TCP
                </button>

                <button
                  class="dp-button-primary firewall-type-btn firewall-type-btn-center"
                  :disabled="firewallRuleType == `tcpudp`"
                  @click="firewallRuleType = `tcpudp`"
                >
                  BOTH
                </button>

                <button
                  class="dp-button-primary firewall-type-btn firewall-type-btn-right"
                  :disabled="firewallRuleType == `udp`"
                  @click="firewallRuleType = `udp`"
                >
                  UDP
                </button>
              </div>
            </div>
            <div class="firewall-table-row-item">
              <button
                class="dp-button-primary dp-vps-firewall-rule-btn firewall-rule-createbtn"
                @click="createFirewallRule()"
              >
                SAVE
              </button>
            </div>
          </div>

          <div style="padding-bottom: 0px; width: 20px">&nbsp;</div>
        </div>
      </div>

      <div
        class="dp-vps-content-root vps-content-cloudinit"
        v-if="page == `cloudinit`"
      >
        <div class="cloudinit-table-root">
          <div class="cloudinit-table-header">
            <div class="cloudinit-table-header-item"></div>
            <div class="cloudinit-table-header-item cloudinit-icon-root"></div>
            <div class="cloudinit-table-header-item">Name</div>
            <div class="cloudinit-table-header-item">Version</div>
          </div>

          <div
            class="cloudinit-table-row"
            :selected="cloudinit_selected == `ubuntu_live_server_2110`"
            @click="cloudinit_selected = `ubuntu_live_server_2110`"
          >
            <div class="cloudinit-table-row-item">
              <div class="cloudinit-selectdot"></div>
            </div>
            <div class="cloudinit-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-ubuntu cloudinit-icon"></i>
            </div>
            <div class="cloudinit-table-row-item">Ubuntu Server</div>
            <div class="cloudinit-table-row-item">21.10</div>
          </div>

          <div
            class="cloudinit-table-row"
            :selected="cloudinit_selected == `ubuntu_live_server_2104`"
            @click="cloudinit_selected = `ubuntu_live_server_2104`"
          >
            <div class="cloudinit-table-row-item">
              <div class="cloudinit-selectdot"></div>
            </div>
            <div class="cloudinit-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-ubuntu cloudinit-icon"></i>
            </div>
            <div class="cloudinit-table-row-item">Ubuntu Server</div>
            <div class="cloudinit-table-row-item">21.04</div>
          </div>

          <div
            class="cloudinit-table-row"
            :selected="cloudinit_selected == `ubuntu_live_server_2010`"
            @click="cloudinit_selected = `ubuntu_live_server_2010`"
          >
            <div class="cloudinit-table-row-item">
              <div class="cloudinit-selectdot"></div>
            </div>
            <div class="cloudinit-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-ubuntu cloudinit-icon"></i>
            </div>
            <div class="cloudinit-table-row-item">Ubuntu Server</div>
            <div class="cloudinit-table-row-item">20.10</div>
          </div>

          <div
            class="cloudinit-table-row"
            :selected="cloudinit_selected == `ubuntu_live_server_2004`"
            @click="cloudinit_selected = `ubuntu_live_server_2004`"
          >
            <div class="cloudinit-table-row-item">
              <div class="cloudinit-selectdot"></div>
            </div>
            <div class="cloudinit-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-ubuntu cloudinit-icon"></i>
            </div>
            <div class="cloudinit-table-row-item">Ubuntu Server</div>
            <div class="cloudinit-table-row-item">20.04</div>
          </div>

          <div
            class="cloudinit-table-row"
            :selected="cloudinit_selected == `ubuntu_live_server_1804`"
            @click="cloudinit_selected = `ubuntu_live_server_1804`"
          >
            <div class="cloudinit-table-row-item">
              <div class="cloudinit-selectdot"></div>
            </div>
            <div class="cloudinit-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-ubuntu cloudinit-icon"></i>
            </div>
            <div class="cloudinit-table-row-item">Ubuntu Server</div>
            <div class="cloudinit-table-row-item">18.04</div>
          </div>

          <div
            class="cloudinit-table-row"
            :selected="cloudinit_selected == `centos_8`"
            @click="cloudinit_selected = `centos_8`"
          >
            <div class="cloudinit-table-row-item">
              <div class="cloudinit-selectdot"></div>
            </div>
            <div class="cloudinit-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-centos cloudinit-icon"></i>
            </div>
            <div class="cloudinit-table-row-item">CentOS</div>
            <div class="cloudinit-table-row-item">8</div>
          </div>

          <div
            class="cloudinit-table-row"
            :selected="cloudinit_selected == `fedora_35`"
            @click="cloudinit_selected = `fedora_35`"
          >
            <div class="cloudinit-table-row-item">
              <div class="cloudinit-selectdot"></div>
            </div>
            <div class="cloudinit-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-fedora cloudinit-icon"></i>
            </div>
            <div class="cloudinit-table-row-item">Fedora</div>
            <div class="cloudinit-table-row-item">35</div>
          </div>

          <div
            class="cloudinit-table-row"
            :selected="cloudinit_selected == `fedora_34`"
            @click="cloudinit_selected = `fedora_34`"
          >
            <div class="cloudinit-table-row-item">
              <div class="cloudinit-selectdot"></div>
            </div>
            <div class="cloudinit-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-fedora cloudinit-icon"></i>
            </div>
            <div class="cloudinit-table-row-item">Fedora</div>
            <div class="cloudinit-table-row-item">34</div>
          </div>
        </div>

        <tooltip
          :text="
            vps.state == 5
              ? `Your Server has to be<br>offline to run cloudinit.`
              : `Run the cloudinit<br> installer.`
          "
          class="cloudinit-reinstallbtn"
          v-if="cloudinit_running == false"
        >
          <button
            class="dp-button-primary"
            @click="runCloudinit()"
            :disabled="vps.state == 5"
          >
            REINSTALL
          </button>
        </tooltip>
        <button
          class="dp-button-primary cloudinit-reinstallbtn"
          style="width: 121px; height: 39px; padding-top: 4px"
          v-else
        >
          <div class="dp-btn-spinner"></div>
        </button>
      </div>

      <div class="dp-vps-content-root vps-content-isos" v-if="page == `isos`">
        <div class="isos-table-root">
          <div class="isos-table-header">
            <div class="isos-table-header-item"></div>
            <div class="isos-table-header-item isos-icon-root"></div>
            <div class="isos-table-header-item">Name</div>
            <div class="isos-table-header-item">Version</div>
            <div class="isos-table-header-item">Type</div>
          </div>

          <div
            class="isos-table-row"
            :selected="
              vps.iso_mount == `no_iso.iso` || vps.iso_mount == `no-iso.iso`
            "
            @click="vps.iso_mount = `no_iso.iso`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-solid fa-empty-set isos-icon"></i>
            </div>
            <div class="isos-table-row-item">No ISO</div>
            <div class="isos-table-row-item">1</div>
            <div class="isos-table-row-item">Image</div>
          </div>

          <div
            class="isos-table-row"
            :selected="
              vps.iso_mount == `${vps.code}.iso` ||
              vps.iso_mount == `${vps.code}.img`
            "
            @click="vps.iso_mount = `${vps.code}.img`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-regular fa-sensor-cloud isos-icon"></i>
            </div>
            <div class="isos-table-row-item">Cloudinit</div>
            <div class="isos-table-row-item">1</div>
            <div class="isos-table-row-item">Image</div>
          </div>

          <div
            class="isos-table-row"
            :selected="vps.iso_mount == `ubuntu_desktop_2004.iso`"
            @click="vps.iso_mount = `ubuntu_desktop_2004.iso`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-linux isos-icon"></i>
            </div>
            <div class="isos-table-row-item">Ubuntu</div>
            <div class="isos-table-row-item">Desktop 20.04</div>
            <div class="isos-table-row-item">Operating System</div>
          </div>

          <div
            class="isos-table-row"
            :selected="vps.iso_mount == `windows_11_en.iso`"
            @click="vps.iso_mount = `windows_11_en.iso`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-windows isos-icon"></i>
            </div>
            <div class="isos-table-row-item">Microsoft Windows</div>
            <div class="isos-table-row-item">11</div>
            <div class="isos-table-row-item">Operating System</div>
          </div>

          <div
            class="isos-table-row"
            :selected="vps.iso_mount == `windows_10_en.iso`"
            @click="vps.iso_mount = `windows_10_en.iso`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-windows isos-icon"></i>
            </div>
            <div class="isos-table-row-item">Microsoft Windows</div>
            <div class="isos-table-row-item">10</div>
            <div class="isos-table-row-item">Operating System</div>
          </div>

          <div
            class="isos-table-row"
            :selected="vps.iso_mount == `windows_server_2021.iso`"
            @click="vps.iso_mount = `windows_server_2021.iso`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-windows isos-icon"></i>
            </div>
            <div class="isos-table-row-item">Microsoft Windows</div>
            <div class="isos-table-row-item">Server 2021</div>
            <div class="isos-table-row-item">Operating System</div>
          </div>

          <div
            class="isos-table-row"
            :selected="vps.iso_mount == `windows_server_2019.iso`"
            @click="vps.iso_mount = `windows_server_2019.iso`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-windows isos-icon"></i>
            </div>
            <div class="isos-table-row-item">Microsoft Windows</div>
            <div class="isos-table-row-item">Server 2019</div>
            <div class="isos-table-row-item">Operating System</div>
          </div>

          <div
            class="isos-table-row"
            :selected="vps.iso_mount == `windows_server_2016.iso`"
            @click="vps.iso_mount = `windows_server_2016.iso`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-brands fa-windows isos-icon"></i>
            </div>
            <div class="isos-table-row-item">Microsoft Windows</div>
            <div class="isos-table-row-item">Server 2016</div>
            <div class="isos-table-row-item">Operating System</div>
          </div>

          <div
            class="isos-table-row"
            :selected="vps.iso_mount == `windows_virtio_204.iso`"
            @click="vps.iso_mount = `windows_virtio_204.iso`"
          >
            <div class="isos-table-row-item">
              <div class="isos-selectdot"></div>
            </div>
            <div class="isos-table-row-item cloudinit-icon-root">
              <i class="fa-solid fa-screwdriver isos-icon"></i>
            </div>
            <div class="isos-table-row-item">Windows VirtIO</div>
            <div class="isos-table-row-item">204</div>
            <div class="isos-table-row-item">Driver</div>
          </div>
        </div>

        <button
          class="dp-button-primary isos-savebtn"
          v-if="mounting_iso == false"
          @click="mountIso()"
        >
          SAVE
        </button>

        <button
          class="dp-button-primary isos-savebtn"
          style="width: 74px; height: 39px; padding-top: 4px"
          v-else
        >
          <div class="dp-btn-spinner"></div>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
const moment = require("moment");

import tooltip from "../components/tooltip.vue";
export default {
  components: { tooltip },
  data() {
    return {
      cloudinit_selected: "ubuntu_21_04",
      cloudinit_running: false,
      mounting_iso: false,
      vps: null,
      isLoaded: true,
      modifyname: false,
      modifiedname: "",
      savingname: false,
      page: "dashboard",
      vpsCode: null,
      prevPowerState: null,
      firewallRuleType: "tcp",
    };
  },

  mounted() {
    var vm = this;

    vm.page = this.$route?.params?.page || "dashboard";
    vm.vpsCode = this.$route.params.vpsCode;

    vm.$root.api.get(`/qemu/myservers`).then((req) => {
      vm.$root.masterData.qemuServers = req.data;
      vm.vps = vm.$root.masterData.qemuServers.find(
        (s) => s.code == vm.vpsCode
      );
      vm.cloudinit_selected = vm.vps.cloudinit.base_image;

      if (vm.vps.state != 4 && vm.vps.state != 5) {
        this.$router.push({
          path: "/vps",
        });
      }
    });

    var socketSubscription = this.sockets.subscribe(
      "qemuServersUpdate",
      (data) => {
        vm.vps = data.find((s) => s.code == vm.vpsCode);
        vm.cloudinit_selected = vm.vps.cloudinit.base_image;

        if (vm.prevPowerState != vm.vps.state) {
          vm.prevPowerState = vm.vps.state;

          if (vm.vps.state == 5) {
            if (document.getElementById("vnc-window"))
              document.getElementById("vnc-window").src =
                document.getElementById("vnc-window").src;
          }

          if (vm.vps.state != 4 && vm.vps.state != 5) {
            this.$router.push({
              path: "/vps",
            });
          }
        }
      }
    );

    console.log(socketSubscription);
  },
  beforeUnmount() {
    this.sockets.unsubscribe("qemuServersUpdate");
  },
  methods: {
    activityRename(act) {
      if (act.event == "server.firewall.deleterule")
        return `Delete firewall rule`;
      if (act.event == "server.firewall.createrule")
        return `Create Firewall rule`;

      if (act.event == "server.mountiso") return `ISO image mount`;
      if (act.event == "server.cloudinit") return `Run cloudinit installer`;

      if (act.event == "server.power.kill") return `Server power kill`;
      if (act.event == "server.power.reset") return `Server power reset`;
      if (act.event == "server.power.start")
        return `Server power start
      `;

      if (act.event == "server.cancel") return `Remove subscription`;
      if (act.event == "server.create") return `Create server`;
      return act.event;
    },
    eventData(act) {
      if (act.event == "server.mountiso") {
        return act.snapshots.iso;
      }
      if (act.event == "server.cloudinit") {
        return act.snapshots.base_image;
      }
    },
    mountIso() {
      var vm = this;
      vm.mounting_iso = true;
      vm.$root.api
        .post(`/qemu/myservers/${vm.vpsCode}`, {
          serverIso: vm.vps.iso_mount,
        })
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

          vm.mounting_iso = false;
        });
    },

    runCloudinit() {
      var vm = this;
      vm.cloudinit_running = true;
      var cloudinit_image = this.cloudinit_selected;

      vm.$root.api
        .post(`/qemu/myservers/${vm.vpsCode}`, {
          cloudinit: cloudinit_image,
        })
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

          vm.cloudinit_running = false;
        });
    },
    deleteFirewallRule(ruleId) {
      var vm = this;

      vm.$root.api
        .post(`/qemu/myservers/${vm.vpsCode}`, {
          deleteFirewallRule: {
            ruleId: ruleId,
          },
        })
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];
        });
    },

    createFirewallRule() {
      var vm = this;
      var port = document.getElementById(`newRulePrivatePort`).value;

      vm.$root.api
        .post(`/qemu/myservers/${vm.vpsCode}`, {
          newFirewallRule: {
            type: vm.firewallRuleType,
            port: port,
          },
        })
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];
        });
    },
    powerAction(actionName) {
      var vm = this;

      vm.$root.api
        .post(`/qemu/myservers/${vm.vpsCode}`, {
          power: actionName,
        })
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];
        });
    },

    saveName(newName) {
      var vm = this;
      console.log(newName);
      vm.savingname = true;

      vm.$root.api
        .post(`/qemu/myservers/${vm.vpsCode}`, {
          name: newName,
        })
        .then((req) => {
          if (req.data.msg && req.data.msg.length > 0)
            vm.$root.messages = [...req.data.msg, ...vm.$root.messages];

          vm.savingname = false;
          vm.modifyname = false;
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
    sshUri() {
      const firewallRule = this.vps.firewall_rules.find(
        (r) => r.private_port == 22 && r.type == "tcp"
      );
      return `https://console.diskos.net/ssh/host/${firewallRule.public_ip}?port=${firewallRule.public_port}&password=${this.vps.cloudinit.password}&username=root`;
    },
    vncUri() {
      return `https://console.diskos.net/novnc?autoconnect=true&resize=scale&password=${this.vps.novnc.password}&reconnect=true&reconnect_delay=1000&host=${this.vps.novnc.host}?noport=${this.vps.novnc.port}`;
    },
    vpsStateIconColor() {
      const vps = this.vps;
      if (vps.state == 2) return `gray`;
      if (vps.state == 3) return `red`;
      if (vps.state == 4) return `orange`;
      if (vps.state == 5) return `green`;
    },
    convertUtcTimestampToLocalTimestamp(date) {
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
    screen(name) {
      var vm = this;
      vm.page = name;
      vm.$router.push({
        name: `VPS2`,
        params: {
          page: name,
          vpsCode: vm.vpsCode,
        },
      });

      vm.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.dp-vps-nav-item {
  display: grid;
  font-size: 20px;
  grid-template-columns: 35px calc(100% - 60px);
  grid-gap: 20px;
  cursor: pointer;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;
}

.dp-vps-nav-item:hover {
  filter: opacity(0.4);
}

.dp-vps-nav-item[selected="true"] {
  filter: opacity(1);
  color: var(--color-primary);
}

.dp-vps-nav-item:not(:first-child) {
  margin-top: 15px;
}

.dp-vps-nav-item-icon i {
  width: fit-content;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}
.dp-vps-nav-item-icon {
  position: relative;
}

.dp-vps-nav-root {
  padding: 10px;
  background-color: var(--color-background--layer-40);
  height: calc(100vh - 65px - 20px - 66px - 50px);
}

.dp-vps-content-root {
  padding: 10px;
  overflow: hidden;
  background-color: var(--color-background--layer-40);
  overflow-y: auto;
  max-height: calc(100vh - 65px - 20px - 66px - 50px);
}

.dp-vps-nav-content-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 250px calc(100% - 250px - 40px - 10px);
  grid-gap: 10px;
  height: 100%;
}

.dp-vps-topbar-spacer {
  width: 280px;
}
.dashboard-cloudinit-grid {
  display: grid;
  grid-template-columns: 120px calc(100% - 120px);
}
.dashboard-network-config-grid {
  display: grid;
  grid-template-columns: 160px calc(100% - 160px);
  user-select: text;
}

.dp-vps-topbar-specs {
  font-size: 24px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns:
    repeat(1, 30px 65px 36px) repeat(1, 35px 135px 20px) repeat(
      1,
      32px 130px 40px
    )
    repeat(1, 20px 120px 20px);
}

.dp-vps-topbar-specs-text small {
  font-size: 14px;
  position: relative;
  left: 2px;
}

.dp-vps-root {
  width: 100%;
  margin: 20px;
  margin-top: 0px;
  padding-top: 20px;
  margin-left: 0px;
  padding-left: 20px;
  margin-bottom: 0px;
}
.dp-vps-topbar-root {
  display: grid;
  grid-template-columns: 35px 260px minmax(0, 1fr) 130px 150px;
  width: calc(100% - 80px);
  padding: 20px;
  background-color: var(--color-background--layer-40);
  height: 26px;
  max-height: 52px !important;
}
.powercontrol-root {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  position: relative;
  top: -5px;
}

.powercontrol-btn-leftedge,
.powercontrol-btn-center,
.powercontrol-btn-rightedge {
  width: 50px;
}

.powercontrol-btn-leftedge {
  border-radius: 4px 0px 0px 4px;
}

.powercontrol-btn-center {
  border-radius: 0px 0px 0px 0px;
}

.powercontrol-btn-rightedge {
  border-radius: 0px 4px 4px 0px;
}

.dp-vps-topbar-servername-root-static,
.dp-vps-topbar-servername-root-editor {
  width: 250px;
  display: inline-flex;
}

.dp-vps-topbar-servername-root-editor {
  position: relative;
  top: -3px;
}

.dp-vps-topbar-servername-root-static .dp-vps-topbar-servername {
  font-size: 22px;
  max-width: 190px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dp-vps-topbar-servername-root-static .dp-vps-topbar-servername-modify {
  font-size: 16px;
  line-height: 22px;
  cursor: pointer;
  position: relative;
  top: 1px;
  left: 3px;
}
.dp-vps-topbar-servername-root-static .dp-vps-topbar-servername-modify:hover {
  filter: opacity(0.6);
}
.dp-vps-topbar-servername-root-editor .dp-vps-topbar-servername-modify {
  width: calc(100% - 15px);
  height: 30px;
  background-color: transparent;
  border-style: none;
  color: white;
  font-size: 16px;
  font-family: Montserrat, Roboto, sans-serif;
  background-color: var(--color-background--layer-20);
  padding-left: 5px;
}
.dp-vps-topbar-servername-modify:focus {
  outline: none;
}
.dp-vps-topbar-servername-savebtn {
  font-size: 16px;
  padding: 5px;
  margin-left: 7px;
  min-width: 53px !important;
  position: relative;
  top: 0px;
  height: 32px;
}
.dp-vps-topbar-servername-savebtn-spinner {
  height: 8px;
  width: 8px;
  border-width: 3px;
}

.dp-activity-table-header,
.firewall-table-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.dp-activity-table-header,
.dp-activity-table-row {
  display: grid;
  font-size: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.firewall-rule-type {
  margin-left: 15px;
}

.firewall-table-header,
.firewall-table-row {
  display: grid;
  font-size: 18px;
  grid-template-columns: 40px repeat(4, minmax(0, 1fr)) 185px 100px;
}

.firewall-type-btn-grid {
  display: grid;
  grid-template-columns: 50px 65px 50px;
}
.firewall-type-btn {
  padding: 5px;
  height: 32px;
}
.firewall-type-btn-left {
  border-radius: 4px 0px 0px 4px;
}
.firewall-type-btn-center {
  border-radius: 0px 0px 0px 0px;
}
.firewall-type-btn-right {
  border-radius: 0px 4px 4px 0px;
}

.dp-vps-firewall-rule-modify-field {
  width: calc(100% - 15px);
  height: 30px;
  background-color: transparent;
  border-style: none;
  color: white;
  font-size: 16px;
  font-family: Montserrat, Roboto, sans-serif;
  background-color: var(--color-background--layer-20);
  padding-left: 5px;
}
.dp-vps-firewall-rule-modify-field:focus {
  outline: none;
}
.dp-vps-firewall-rule-btn {
  padding: 6px;
  width: 100%;
}
.firewall-table-row-item {
  line-height: 31px;
}
.firewall-table-row:not(:first-child) {
  margin-top: 8px;
}

.firewall-rule-deletebtn {
  background-color: #d50c2d;
}

.firewall-rule-createbtn {
  background-color: #00cc00;
}
.dp-vps-activity-table-root .firewall-table-root {
  max-height: calc(100vh - 65px - 20px - 66px - 70px);
}

.cloudinit-table-header,
.cloudinit-table-row {
  display: grid;
  font-size: 20px;
  grid-template-columns: 50px 45px repeat(2, minmax(0, 1fr));
  padding: 12px;
}
.cloudinit-table-header {
  padding-bottom: 0px;
}
.cloudinit-table-row {
  margin-top: 10px;
  background-color: var(--color-background--layer-30);
  cursor: pointer;
}
.cloudinit-table-row:hover {
  background-color: var(--color-background--layer-10);
}
.cloudinit-icon-root {
  position: relative;
}
.cloudinit-icon {
  position: absolute;
  top: -5px;
  font-size: 32px;
}
.cloudinit-table-row[selected="true"] {
  background-color: var(--color-background--layer-10);
}
.cloudinit-table-row[selected="true"] .cloudinit-selectdot::after {
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

.cloudinit-selectdot {
  position: relative;
  height: 14px;
  width: 14px;
  border-radius: 100%;
  border-style: solid;
  border-width: 3px;
  border-color: var(--color-primary);
  margin: auto;
  margin-top: 2px;
  margin-left: 5px;
}

.row-disabled {
  filter: opacity(0.4);
  cursor: default;
  background-color: var(--color-background--layer-30);
}

.row-disabled:hover {
  background-color: var(--color-background--layer-30);
}
.isos-savebtn,
.cloudinit-reinstallbtn {
  float: right;
  margin-top: 10px;
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
  top: 6px;
  left: 3px;
}

.ring-container {
  position: relative;
}

.ringring {
  border-radius: 30px;
  height: 25px;
  width: 25px;
  position: absolute;
  left: -5px;
  top: -2px;
  animation: pulsate 2.5s ease-out;
  animation-iteration-count: infinite;
  opacity: 0;
}

.dp-vps-install-spinner,
.dp-vps-install-spinner:after {
  border-radius: 50%;
  width: 12px;
  height: 12px;
}
.dp-vps-install-spinner {
  font-size: 10px;
  border-top: 5px solid rgba(255, 255, 255, 0.2);
  border-right: 5px solid rgba(255, 255, 255, 0.2);
  border-bottom: 5px solid rgba(255, 255, 255, 0.2);
  border-left: 5px solid var(--color-primary);
  animation: load8 0.8s infinite linear;
  margin-top: 3px;
  max-width: 12px;
  max-height: 12px;
}

.isos-table-header,
.isos-table-row {
  display: grid;
  font-size: 20px;
  grid-template-columns: 50px 50px repeat(3, minmax(0, 1fr));
  padding: 12px;
}
.isos-table-header {
  padding-bottom: 0px;
}
.isos-table-row {
  margin-top: 10px;
  background-color: var(--color-background--layer-30);
  cursor: pointer;
}
.isos-table-row:hover {
  background-color: var(--color-background--layer-10);
}
.isos-icon-root {
  position: relative;
}
.isos-icon {
  position: absolute;
  top: -5px;
  font-size: 32px;
}
.isos-table-row[selected="true"] {
  background-color: var(--color-background--layer-10);
}
.isos-table-row[selected="true"] .cloudinit-selectdot::after {
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

.isos-selectdot {
  position: relative;
  height: 14px;
  width: 14px;
  border-radius: 100%;
  border-style: solid;
  border-width: 3px;
  border-color: var(--color-primary);
  margin: auto;
  margin-top: 2px;
  margin-left: 5px;
}

.isos-table-row[selected="true"] .isos-selectdot::after {
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
.vps-content-monitor {
  padding: 0px;
  height: calc(100vh - 65px - 20px - 66px - 30px) !important;
  min-height: calc(100vh - 65px - 20px - 66px - 30px) !important;
  overflow: hidden;
}
.dp-vps-monitor-iframe {
  overflow: hidden;
  width: 100%;
  height: calc(100%);
}

.vps-cards-card-static {
  border-radius: 4px;
  background: var(--color-card-background);
  height: 100%;
  width: 100%;
}

.vps-card-header {
  padding: 8px;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 22px;
  user-select: none;
}
.vps-card-content {
  height: calc(100% - 68px);
  position: relative;
  overflow: hidden;
  padding: 8px;
  background: linear-gradient(
    0deg,
    var(--color-background--layer-40) 94%,
    var(--card-bg-gradiant-end) 100%
  );
  border-radius: 0px 0px 4px 4px;
  word-wrap: break-word;
  white-space: pre-line;
  user-select: none;
}
.vps-card-bottom {
  position: absolute;
  width: calc(100% - 16px);
  bottom: 6px;
}

.vps-content-dashboard {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 550px));
  grid-auto-rows: 120px 200px 200px;
  background: transparent;
  padding: 0px;
  width: fit-content;
  height: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.rw-2 {
  grid-column: 1 / 3;
}

.rh-2 {
  grid-column: 2;
  grid-row: 2 / 4;
}

.vps-content-dashboard {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 550px));
  grid-auto-rows: 120px 200px 200px;
  background: transparent;
  padding: 0px;
  width: fit-content;
  height: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.rw-2 {
  grid-column: 1 / 3;
}

.rh-2 {
  grid-column: 2;
  grid-row: 2 / 4;
}

.vps-activity-root {
  height: 100%;
  overflow-y: auto;
}
.activity-title {
  font-size: 22px;
}
.activity-subtitle {
  font-size: 16px;
  filter: opacity(0.5);
}
.subtitle-date {
  font-size: 18px;
}

.activity-item:not(:first-child) {
  padding-top: 5px;
}
.activity-item:not(:last-child) {
  padding-bottom: 5px;

  border-bottom-style: solid;
  border-width: 1px;
  border-color: #262626;
}

.server-info-grid {
  margin-left: 10%;
  margin-right: 10%;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.server-info-item {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 33px calc(100% - 33px);
}
.info-item-icon {
  font-size: 30px;
  width: fit-content;
  height: fit-content;
  margin-top: auto;
  margin-bottom: auto;
}
.info-item-text {
  font-size: 24px;
  width: fit-content;
}
.info-item-text-subtitle {
  font-size: 18px;
  filter: opacity(0.75);
}

@media only screen and (max-width: 1400px) {
  .firewall-table-row-newrule {
    display: none;
  }
  .firewall-action {
    visibility: hidden;
  }

  .firewall-table-header,
  .firewall-table-row {
    grid-template-columns: 40px repeat(4, minmax(0, 1fr)) 150px 0px;
  }
}

@media only screen and (max-width: 1250px) {
  .vps-content-dashboard {
    width: 100%;
    min-height: calc(100vh - 65px - 20px - 66px - 30px);
    grid-template-columns: 100%;
    grid-auto-rows: 120px 200px 200px 200px;
  }

  .rw-2 {
    grid-column: 1;
  }

  .rh-2 {
    grid-column: 1;
    grid-row: 2;
  }

  .rule-private-ip {
    visibility: hidden;
  }

  .firewall-table-header,
  .firewall-table-row {
    grid-template-columns:
      40px repeat(2, minmax(0, 1fr)) 0px minmax(0, 1fr) minmax(0, 1fr)
      0px;
  }

  .server-info-grid {
    margin-left: 10px;
    margin-right: 10px;
  }
}

@media only screen and (max-width: 900px) {
  .dp-vps-nav-content-grid {
    grid-template-columns: 100%;
  }

  .dp-vps-nav-root {
    height: fit-content;
    width: calc(100% - 60px);
  }
  .dp-vps-content-root {
    overflow-y: hidden;
    height: 100%;
    padding-bottom: 30px;
    margin-left: 0px;
    width: calc(100% - 60px);
  }
  .dp-vps-topbar-root {
    min-height: 70px;
    grid-template-columns: 35px 260px minmax(0, 1fr) 130px;
  }
  .powercontrol-root {
    margin-top: 15px;
    grid-column: 1 / 5;
  }

  .vps-content-monitor,
  .vps-content-dashboard {
    width: calc(100% - 40px);
  }
}

@media only screen and (max-width: 650px) {
  .firewall-rule-type {
    visibility: hidden;
  }

  .firewall-table-header,
  .firewall-table-row {
    grid-template-columns: 40px repeat(2, minmax(0, 1fr)) 0px minmax(0, 1fr) 0px 0px;
  }

  .info-item-icon {
    font-size: 25px;
  }
  .info-item-text {
    font-size: 19px;
  }
  .info-item-text-subtitle {
    font-size: 13px;
  }
  .vps-content-dashboard {
    grid-auto-rows: 110px 200px 200px 200px;
  }
}

@media only screen and (max-width: 550px) {
  .server-info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .vps-content-dashboard {
    grid-auto-rows: 150px 200px 200px 200px;
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
