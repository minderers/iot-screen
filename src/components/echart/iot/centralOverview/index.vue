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
import {
  getDeviceStatistics,
  getDeviceOperationLogs,
  getDeviceAlarmLogs,
} from "@/api/iot";

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
        data: [], // 初始化为空数组，将通过API获取数据
        rowNum: 5,
        align: ["center", "center", "left"],
        columnWidth: [150, 100],
        index: true,
        indexHeader: "#",
        carousel: "single",
      },
      alarmConfig: {
        header: ["时间", "设备ID", "告警信息"],
        data: [], // 初始化为空数组，将通过API获取数据
        rowNum: 5,
        align: ["center", "center", "left"],
        columnWidth: [80, 180, 80], // 将设备ID列的宽度从100增加到180
        carousel: "single",
      },
    };
  },
  created() {
    // 初始加载数据
    this.fetchDeviceStatistics();
    this.fetchDeviceOperationLogs();
    this.fetchDeviceAlarmLogs(); // 添加获取告警日志的调用

    // 设置定时刷新（每30秒刷新一次）
    this.timer = setInterval(() => {
      this.fetchDeviceStatistics();
      this.fetchDeviceOperationLogs();
      this.fetchDeviceAlarmLogs(); // 添加定时刷新告警日志
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
    // 获取设备操作日志
    fetchDeviceOperationLogs() {
      getDeviceOperationLogs(1, 10) // 固定获取第一页，每页10条数据
        .then((res) => {
          if (res.code === 0 && res.data) {
            // 处理返回的日志数据
            const logData = res.data.list.map((item) => [
              item.createTime, // 时间
              item.type === 1 ? "设备操作" : "告警信息", // 事件类型，根据实际类型值调整
              item.content, // 详情
            ]);

            // 更新日志配置
            this.logConfig = {
              ...this.logConfig,
              data: logData,
            };
          } else {
            console.error("获取设备操作日志失败:", res.msg || "未知错误");
          }
        })
        .catch((error) => {
          console.error("获取设备操作日志出错:", error);
        });
    },
    // 获取设备告警日志
    fetchDeviceAlarmLogs() {
      getDeviceAlarmLogs(1, 10) // 固定获取第一页，每页10条数据
        .then((res) => {
          if (res.code === 0 && res.data) {
            // 处理返回的告警数据
            const alarmData = res.data.list.map((item) => [
              item.createTime.substring(11, 19), // 只显示时间部分
              item.deviceId, // 设备ID
              // this.getAlarmLevelText(item.type), // 告警级别，根据类型确定
              item.content, // 告警信息
            ]);

            // 更新告警配置
            this.alarmConfig = {
              ...this.alarmConfig,
              data: alarmData,
            };
          } else {
            console.error("获取设备告警日志失败:", res.msg || "未知错误");
          }
        })
        .catch((error) => {
          console.error("获取设备告警日志出错:", error);
        });
    },

    // 根据告警类型获取告警级别文本
    getAlarmLevelText(type) {
      // 根据实际业务逻辑调整
      switch (type) {
        case 1:
          return "轻微";
        case 2:
          return "中等";
        case 3:
          return "严重";
        default:
          return "未知";
      }
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
