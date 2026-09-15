export interface TransactionInput {
  amount: number;
  location?: string;
  distance: number;
  time_delta: number; // hours since last transaction (frequency)
  is_international: number;
  is_vpn: number;
  device_name?: string;
  unrecognized_device?: number;
  time_hour?: number; // 0 - 23.9 hour of transaction
  time_display?: string;
  merchant?: string;
  merchant_category?: string;
  mobile_number?: string;
}

export interface SignalTelemetry {
  code: string; // "₹ Amount", "L Location", "D Device", "T Time", "F Frequency"
  name: string;
  impact: string;
  status: "CRITICAL" | "TRIGGERED" | "CLEARED";
  detail: string;
}

export interface FCMPayload {
  to: string;
  priority: string;
  notification: {
    title: string;
    body: string;
    click_action: string;
  };
  data: {
    case_id: string;
    amount: string;
    merchant: string;
    risk_score: string;
    status: string;
    action: string;
  };
}

export type RiskTier = "SAFE" | "SUSPICIOUS" | "HIGH RISK";

export interface PredictionResult {
  is_fraud: number;
  risk_score: number;
  tier: RiskTier;
  tier_label: string; // "SAFE · APPROVE + LOG" | "SUSPICIOUS · STEP-UP OTP / ANALYST REVIEW" | "HIGH RISK · CASE CREATED + FCM ALERT"
  action: string;
  status_color: string;
  explanation: string;
  hard_rule_triggered: boolean;
  reason_code: string | null;
  hard_reasons?: string[];
  ai_source?: string;
  features: TransactionInput;
  signals?: SignalTelemetry[];
  rule_breakdown?: Array<{
    rule: string;
    impact: string;
    status: "Triggered" | "Cleared";
    detail: string;
  }>;
  case_number?: string | null;
  fcm_payload?: FCMPayload | null;
  latency_ms?: number;
}

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  amount: number;
  distance: number;
  location?: string;
  merchant?: string;
  device?: string;
  is_international: number;
  is_vpn: number;
  risk_score: number;
  tier: RiskTier;
  tier_label: string;
  is_fraud: number;
  hard_rule_triggered: boolean;
  latency_ms: number;
}

export interface DatasetFeature {
  name: string;
  type: string;
  range: string;
  description: string;
  importance: number;
}

export interface SyntheticRecord {
  id: number;
  amount: number;
  distance_from_home: number;
  time_delta: number;
  is_international: number;
  is_vpn?: number;
  is_fraud: number;
}

export interface DatasetSummary {
  totalSamples: number;
  fraudCount: number;
  legitCount: number;
  fraudRate: number;
  features: DatasetFeature[];
  modelSpecs: {
    algorithm: string;
    n_estimators: number;
    max_depth: number;
    learning_rate: number;
    evaluation: {
      accuracy: string;
      precision: string;
      recall: string;
      f1_score: string;
    };
  };
  sampleRecords: SyntheticRecord[];
}
