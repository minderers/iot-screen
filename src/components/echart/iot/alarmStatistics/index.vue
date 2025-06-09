<template>
  <div>
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
import Chart from "./chart.vue";
export default {
  data() {
    return {
      cdata: {
        alarmTypes: [
          "设备离线",
          "温度异常",
          "湿度异常",
          "电压异常",
          "信号弱",
          "安全警报",
        ],
        alarmCounts: [24, 18, 16, 12, 8, 6],
      },
    };
  },
  components: {
    Chart,
  },
};
</script>
