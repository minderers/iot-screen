<template>
  <div>
    <Echart
      :options="options"
      id="deviceStatisticsChart"
      height="300px"
      width="100%"
    ></Echart>
  </div>
</template>

<script>
import Echart from "@/common/echart";
export default {
  data() {
    return {
      options: {},
    };
  },
  components: {
    Echart,
  },
  props: {
    cdata: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    cdata: {
      handler(newData) {
        this.options = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            data: ["在线", "离线"],
            textStyle: {
              color: "#fff",
            },
            top: "5%",
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: newData.deviceTypes,
              axisLine: {
                lineStyle: {
                  color: "#fff",
                },
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "设备数量",
              axisLine: {
                lineStyle: {
                  color: "#fff",
                },
              },
              splitLine: {
                lineStyle: {
                  color: "rgba(255,255,255,0.1)",
                },
              },
            },
          ],
          series: [
            {
              name: "在线",
              type: "bar",
              stack: "设备",
              emphasis: {
                focus: "series",
              },
              itemStyle: {
                color: "#67e0e3",
              },
              data: newData.deviceStatus.online,
            },
            {
              name: "离线",
              type: "bar",
              stack: "设备",
              emphasis: {
                focus: "series",
              },
              itemStyle: {
                color: "#9fe6b8",
              },
              data: newData.deviceStatus.offline,
            },
          ],
        };
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
