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
}
export class Status {
  error_code: string;
  status: string;
  message: string;
  response_code: string;
  operation_id: string;
}
export class PaymentMethodResponse {
    status: Status;
    data: PaymentMethod[];
}
