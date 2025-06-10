<template>
  <div>
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
import Chart from "./chart.vue";
import { getDeviceTypeStatistics } from "@/api/iot";

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
      timer: null,
    };
  },
  components: {
    Chart,
  },
  methods: {
    // 获取设备类型统计数据
    fetchDeviceTypeStatistics() {
      console.log("开始请求设备类型统计数据");

      getDeviceTypeStatistics()
        .then((res) => {
          console.log("设备类型统计数据响应:", res);
          if (res.code === 0 && res.data && res.data.items) {
            // 处理API返回的数据
            const items = res.data.items;
            const deviceTypes = [];
            const online = [];
            const offline = [];
            const fault = [];

            // 遍历API返回的每种设备类型数据
            items.forEach((item) => {
              deviceTypes.push(item.typeName);
              online.push(item.onlineCount);
              offline.push(item.offlineCount);
              // 如果API没有返回故障数，可以设为0或者根据业务需求计算
              fault.push(0); // 或者根据实际情况设置
            });

            // 更新组件数据，创建新对象以确保视图更新
            this.cdata = {
              deviceTypes,
              deviceStatus: {
                online,
                offline,
                fault,
              },
            };

            console.log("更新后的设备类型数据:", this.cdata);
          } else {
            console.error("获取设备类型统计数据失败:", res.msg || "未知错误");
          }
        })
        .catch((error) => {
          console.error("获取设备类型统计数据出错:", error);
        });
    },
  },
  mounted() {
    // 组件挂载后立即获取数据
    this.fetchDeviceTypeStatistics();

    // 设置定时刷新（每30秒刷新一次）
    this.timer = setInterval(() => {
      this.fetchDeviceTypeStatistics();
    }, 30000);
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
