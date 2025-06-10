<template>
  <div>
    <div class="central-overview">
      <!-- 设备状态总览 -->
      <div class="device-overview">
        <div class="overview-title">
          <icon name="chart-bar" class="text-icon"></icon>
          <span class="title-text">设备状态总览</span>
        </div>
        <div class="device-cards">
          <div
            class="device-card"
            v-for="(item, index) in deviceStats"
            :key="index"
          >
            <div class="card-title">{{ item.title }}</div>
            <div class="card-value" :class="item.class">
              <dv-digital-flop :config="item.config" />
            </div>
          </div>
        </div>
      </div>

      <!-- 运行日志 -->
      <div class="log-container">
        <div class="overview-title">
          <icon name="align-left" class="text-icon"></icon>
          <span class="title-text">运行日志</span>
        </div>
        <dv-scroll-board class="log-board" :config="logConfig" />
      </div>

      <!-- 实时告警 -->
      <div class="alarm-container" :class="{ alarm: hasActiveAlarm }">
        <div class="overview-title">
          <icon name="chart-line" class="text-icon"></icon>
          <span class="title-text">实时告警</span>
        </div>
        <div class="alarm-list">
          <dv-scroll-board class="alarm-board" :config="alarmConfig" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceStatistics } from "@/api/iot";

export default {
  data() {
    return {
      hasActiveAlarm: true,
      deviceStats: [
        {
          title: "设备总数",
          class: "total",
          config: {
            number: [0],
            toFixed: 0,
            textAlign: "center",
            content: "{nt}",
            style: {
              fontSize: 28,
              fill: "#3de7c9",
            },
          },
        },
        {
          title: "在线设备",
          class: "online",
          config: {
            number: [0],
            toFixed: 0,
            textAlign: "center",
            content: "{nt}",
            style: {
              fontSize: 28,
              fill: "#67e0e3",
            },
          },
        },
        {
          title: "离线设备",
          class: "offline",
          config: {
            number: [0],
            toFixed: 0,
            textAlign: "center",
            content: "{nt}",
            style: {
              fontSize: 28,
              fill: "#9fe6b8",
            },
          },
        },
        // 告警设备项已移除
      ],
      logConfig: {
        header: ["时间", "事件类型", "详情"],
        data: [
          ["2023-06-15 08:30:45", "设备上线", "ID:SN23785 摄像头已连接"],
          [
            "2023-06-15 08:32:12",
            "数据上报",
            "ID:SN12657 温度传感器数据上报成功",
          ],
          ["2023-06-15 08:35:30", "系统通知", "系统例行维护完成"],
          ["2023-06-15 08:40:22", "设备离线", "ID:SN45692 网关连接断开"],
          ["2023-06-15 08:42:18", "告警触发", "ID:SN78912 温度过高告警"],
          ["2023-06-15 08:45:56", "告警解除", "ID:SN78912 温度恢复正常"],
          ["2023-06-15 08:50:33", "设备上线", "ID:SN45692 网关重新连接"],
          ["2023-06-15 08:55:10", "固件更新", "ID:SN23785 摄像头固件更新完成"],
        ],
        rowNum: 5,
        align: ["center", "center", "left"],
        columnWidth: [150, 100],
        index: true,
        indexHeader: "#",
        carousel: "single",
      },
      alarmConfig: {
        header: ["时间", "设备ID", "告警级别", "告警信息"],
        data: [
          ["08:42:18", "SN78912", "严重", "温度过高(85°C)"],
          ["08:40:22", "SN45692", "中等", "网关连接断开"],
          ["08:38:45", "SN34567", "轻微", "信号强度弱"],
          ["08:35:12", "SN56789", "严重", "烟雾浓度超标"],
          ["08:30:56", "SN67890", "中等", "电池电量低(15%)"],
        ],
        rowNum: 5,
        align: ["center", "center", "center", "left"],
        columnWidth: [80, 100, 80],
        carousel: "single",
      },
    };
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
    // 获取设备统计数据
    // 获取设备统计数据
    fetchDeviceStatistics() {
      console.log("开始请求设备统计数据");
      console.log(
        "请求URL:",
        process.env.VUE_APP_BASE_API + "/iot/device/statistics"
      );

      getDeviceStatistics()
        .then((res) => {
          console.log("设备统计数据响应:", res);
          if (res.code === 0 && res.data) {
            // 创建新的配置对象，避免引用问题
            const deviceStatsTemp = JSON.parse(
              JSON.stringify(this.deviceStats)
            );

            // 更新设备总数
            deviceStatsTemp[0].config.number = [Number(res.data.totalCount)];

            // 更新在线设备数
            deviceStatsTemp[1].config.number = [Number(res.data.onlineCount)];

            // 更新离线设备数
            deviceStatsTemp[2].config.number = [Number(res.data.offlineCount)];

            // 整体替换deviceStats，触发视图更新
            this.deviceStats = deviceStatsTemp;

            // 打印更新后的数据，确认数据已更新
            console.log("更新后的设备数据:", this.deviceStats);

            // 强制重新渲染
            this.$forceUpdate();
          } else {
            console.error("获取设备统计数据失败:", res.msg || "未知错误");
          }
        })
        .catch((error) => {
          console.error("获取设备统计数据出错:", error);
        });
    },
  },
  mounted() {
    // 模拟告警闪烁效果
    setInterval(() => {
      this.hasActiveAlarm = !this.hasActiveAlarm;
    }, 1000);

    // 测试代码已移除
  },
};
</script>

<style lang="scss" scoped>
.central-overview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .overview-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

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

  .device-overview {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 10px;

    .device-cards {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .device-card {
        width: 24%;
        background-color: rgba(6, 30, 93, 0.5);
        border-radius: 5px;
        padding: 10px;
        text-align: center;

        .card-title {
          color: #fff;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .card-value {
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
  }

  .log-container {
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 10px;

    .log-board {
      height: calc(100% - 30px);
    }
  }

  .alarm-container {
    height: 200px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 10px;

    &.alarm {
      box-shadow: 0 0 10px #ff0000;
      border: 1px solid #ff0000;
    }

    .alarm-board {
      height: calc(100% - 30px);
    }
  }
}
</style>
