<template>
  <div>
    <Echart
      :options="options"
      id="alarmStatisticsChart"
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
            trigger: "item",
          },
          legend: {
            top: "5%",
            left: "center",
            textStyle: {
              color: "#fff",
            },
          },
          series: [
            {
              name: "告警类型",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 1,
              },
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "18",
                  fontWeight: "bold",
                  color: "#fff",
                },
              },
              labelLine: {
                show: false,
              },
              data: newData.alarmTypes.map((type, index) => {
                return {
                  value: newData.alarmCounts[index],
                  name: type,
                };
              }),
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
