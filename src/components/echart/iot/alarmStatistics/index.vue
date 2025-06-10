<template>
  <div>
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
import Chart from "./chart.vue";
import { getDeviceStatisticsWithAlarms } from "@/api/iot"; // 使用新的API函数

export default {
  data() {
    return {
      cdata: {
        alarmTypes: [],
        alarmCounts: [],
      },
      timer: null,
    };
  },
  components: {
    Chart,
  },
  created() {
    // 初始加载数据
    this.fetchDeviceStatistics();

    // 设置定时刷新（每30秒刷新一次）
    this.timer = setInterval(() => {
      this.fetchDeviceStatistics();
    }, 30000);
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    fetchDeviceStatistics() {
      getDeviceStatisticsWithAlarms()
        .then((res) => {
          if (res.code === 0 && res.data) {
            console.log("设备统计数据:", res.data);

            // 使用设备统计数据构建扇形图数据
            this.cdata = {
              alarmTypes: ["在线设备", "离线设备", "告警设备"],
              alarmCounts: [
                res.data.onlineCount || 0,
                res.data.offlineCount || 0,
                res.data.alarmCount || 0,
              ],
            };
          } else {
            console.error("获取设备统计数据失败:", res.msg || "未知错误");
            this.useDefaultData();
          }
        })
        .catch((error) => {
          console.error("获取设备统计数据出错:", error);
          this.useDefaultData();
        });
    },

    // 使用默认数据的方法
    useDefaultData() {
      this.cdata = {
        alarmTypes: ["在线设备", "离线设备", "告警设备"],
        alarmCounts: [30, 5, 3],
      };
    },
  },
};
</script>
