export interface SensorData {
  accel: number;
  gyro: number;
  pressure: number;
  sound: number;
  sfi: number;
  class: 'A' | 'B' | 'C' | 'D' | 'E';
  timestamp: string;
}

export interface ImpactLog {
  timestamp: string;
  sfi: number;
  class: 'A' | 'B' | 'C' | 'D' | 'E';
  status: 'Normal' | 'Alert' | 'Critical';
}

export interface DriverResponse {
  status: 'unconfirmed' | 'false_alarm' | 'emergency';
  timestamp: string;
}
