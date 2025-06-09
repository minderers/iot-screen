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
        deviceTypes: ["摄像头", "传感器", "控制器", "网关", "执行器"],
        deviceStatus: {
          online: [120, 200, 150, 80, 70],
          offline: [20, 40, 30, 10, 5],
          fault: [5, 10, 8, 3, 2],
        },
      },
    };
  },
  components: {
    Chart,
  },
};
</script>
