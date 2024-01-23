export class PaymentMethod {
  type: string;
  name: string;
  category: string;
  image: string;
  country: string;
  payment_flow_type: string;
  currencies: string[];
  status: number;
  is_cancelable: boolean;
  payment_options: PaymentOption[];
  is_expirable: boolean;
  is_online: boolean;
  is_refundable: boolean;
  minimum_expiration_seconds: number;
  maximum_expiration_seconds: number;
  virtual_payment_method_type: null;
  is_virtual: boolean;
  multiple_overage_allowed: boolean;
  amount_range_per_currency: AmountRangePerCurrency[];
  is_tokenizable: boolean;
  supported_digital_wallet_providers: any[];
  is_restricted: boolean;
  supports_subscription: boolean;
}

export class AmountRangePerCurrency {
  currency: string;
  maximum_amount: null;
  minimum_amount: number;
}

export class PaymentOption {
  name: string;
  type: string;
  regex: string;
  description: string;
  is_required: boolean;
  is_updatable: boolean;
  required_fields?: PaymentOption[];
  conditions?: Condition[];
}
export class Status {
  error_code: string;
  status: string;
  message: string;
  response_code: string;
  operation_id: string;
}


export class Field {
  name: string;
  type: string;
  regex: string;
  is_required: boolean;
  instructions?: string;
  description?: string;
  is_updatable?: boolean;
}

export interface PaymentMethodOption {
  name: string;
  type: string;
  regex: string;
  description: string;
  is_required: boolean;
  is_updatable: boolean;
}


export class Condition {
  operator: string;
  description: string;
  element_name: string;
  threshold_value: string;
}
export class RequiredFields {
  type: string;
  fields: Field[];
  payment_method_options: PaymentMethodOption[];
  payment_options: PaymentOption[];
  minimum_expiration_seconds: number;
  maximum_expiration_seconds: number;
}
export class RequiredFieldsResponse {
  data: RequiredFields[];
  status: Status

}
export class PaymentMethodResponse {
  status: Status;
  data: PaymentMethod[];
}



export class Metadata {
  merchant_defined: boolean;
}

export class Product {
  id: string;
  active: boolean;
  attributes: string[];
  created_at: number;
  description: string;
  images: any[];
  metadata: Metadata;
  name: string;
  package_dimensions: PackageDimensions;
  shippable: boolean;
  skus: any[];
  statement_descriptor: string;
  type: string;
  unit_label: string;
  updated_at: number;
}


export class PackageDimensions {
  height: number;
  length: number;
  weight: number;
  width: number;
}

export class ProductResponse {
    status: Status;
    data: Product;
}
export class ProductListResponse {
  status: Status;
  data: Product[];
}
export class PlanRequest {
  currency: string;
  interval: string;
  product: string;
  aggregate_usage: string;
  billing_scheme: string;
  nickname: string;
  tiers: Tier[];
  tiers_mode: string;
  transform_usage: TransformUsage;
  trial_period_days: number;
  usage_type: string;
}

export class PlanResponse {
    status: Status;
    data: Plan;
}
export class PlanListResponse {
  status: Status;
  data: Plan[];
}

export class Plan {
  id: string;
  aggregate_usage: string;
  amount: number;
  billing_scheme: string;
  created_at: number;
  currency: string;
  interval: string;
  interval_count: number;
  metadata: Metadata;
  product: Product;
  nickname: string;
  tiers: Tier[];
  tiers_mode: string;
  transform_usage: TransformUsage;
  trial_period_days: number;
  usage_type: string;
  active: boolean;
}




export class Tier {
  amount: number;
  up_to: string;
  flat_amount: number;
}

export class TransformUsage {
  divide_by: number;
  round: string;
}



