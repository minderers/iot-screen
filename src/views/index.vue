<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="d-flex jc-center">
          <dv-decoration-10 class="dv-dec-10" />
          <div class="d-flex jc-center">
            <dv-decoration-8 class="dv-dec-8" :color="decorationColor" />
            <div class="title">
              <span class="title-text">物联网平台监控大屏</span>
              <dv-decoration-6
                class="dv-dec-6"
                :reverse="true"
                :color="['#50e3c2', '#67a1e5']"
              />
            </div>
            <dv-decoration-8
              class="dv-dec-8"
              :reverse="true"
              :color="decorationColor"
            />
          </div>
          <dv-decoration-10 class="dv-dec-10-s" />
        </div>

        <!-- 第二行 -->
        <div class="d-flex jc-between px-2">
          <div class="d-flex aside-width">
            <div class="react-left ml-4 react-l-s">
              <span class="react-left"></span>
              <span class="text">设备监控</span>
            </div>
            <div class="react-left ml-3">
              <span class="text">告警监控</span>
            </div>
          </div>
          <div class="d-flex aside-width">
            <div class="react-right bg-color-blue mr-3">
              <span class="text fw-b">物联网平台</span>
            </div>
            <div class="react-right mr-4 react-l-s">
              <span class="react-after"></span>
              <span class="text"
                >{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span
              >
            </div>
          </div>
        </div>

        <div class="body-box">
          <!-- 物联网平台组件 -->
          <div class="iot-dashboard">
            <!-- 左侧区域 -->
            <div class="left-panel">
              <dv-border-box-12 class="left-top-box">
                <div class="component-title">
                  <icon name="chart-bar" class="text-icon"></icon>
                  <span class="title-text">设备统计</span>
                </div>
                <DeviceStatistics />
              </dv-border-box-12>

              <dv-border-box-13 class="left-bottom-box">
                <div class="component-title">
                  <icon name="chart-pie" class="text-icon"></icon>
                  <span class="title-text">告警统计</span>
                </div>
                <AlarmStatistics />
              </dv-border-box-13>
            </div>

            <!-- 右侧区域 -->
            <div class="right-panel">
              <dv-border-box-8 class="right-box">
                <CentralOverview />
              </dv-border-box-8>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import drawMixin from "../utils/drawMixin";
import { formatTime } from "../utils/index.js";
import DeviceStatistics from "../components/echart/iot/deviceStatistics/index.vue";
import AlarmStatistics from "../components/echart/iot/alarmStatistics/index.vue";
import CentralOverview from "../components/echart/iot/centralOverview/index.vue";

export default {
  mixins: [drawMixin],
  data() {
    return {
      timing: null,
      loading: true,
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      decorationColor: ["#568aea", "#000000"],
    };
  },
  components: {
    DeviceStatistics,
    AlarmStatistics,
    CentralOverview,
  },
  mounted() {
    this.timeFn();
    this.cancelLoading();
  },
  beforeDestroy() {
    clearInterval(this.timing);
  },
  methods: {
    timeFn() {
      this.timing = setInterval(() => {
        this.dateDay = formatTime(new Date(), "HH: mm: ss");
        this.dateYear = formatTime(new Date(), "yyyy-MM-dd");
        this.dateWeek = this.weekday[new Date().getDay()];
      }, 1000);
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/index.scss";

.iot-dashboard {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 10px;

  .component-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;

    .text-icon {
      color: #3de7c9;
      margin-right: 5px;
    }

    .title-text {
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .left-panel {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .left-top-box,
    .left-bottom-box {
      height: calc(50% - 5px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  .right-panel {
    width: 60%;

    .right-box {
      height: 100%;
      padding: 10px;
    }
  }
}
</style>
