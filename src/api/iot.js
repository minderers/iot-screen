// 物联网相关API
import { get } from "@/utils/request";

// 获取设备统计数据
export function getDeviceStatistics() {
  return get("/iot/device/statistics");
}

// 获取设备告警数据
export function getDeviceAlarms() {
  return get("/iot/device/alarms");
}

// 获取设备日志
export function getDeviceLogs() {
  return get("/iot/device/logs");
}

// 获取设备类型统计数据
export function getDeviceTypeStatistics() {
  return get("/iot/device/type/statistics");
}

// 获取设备操作日志（分页）
export function getDeviceOperationLogs(page = 1, limit = 10) {
  return get("/iot/device/operation/log/page", {
    page,
    limit,
  });
}

// 获取设备告警日志（分页）
export function getDeviceAlarmLogs(page = 1, limit = 10) {
  return get("/iot/device/operation/log/alarms", {
    page,
    limit,
  });
}

// 获取告警统计数据
export function getAlarmStatistics() {
  return get("/iot/device/alarm/statistics");
}

// 获取包含告警信息的设备统计数据
export function getDeviceStatisticsWithAlarms() {
  return get("/iot/device/statistics/with-alarms");
}
