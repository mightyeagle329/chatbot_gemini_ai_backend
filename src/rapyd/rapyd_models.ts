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
export class CustomerRequest {
  name: string;
  business_vat_id: string;
  email: string;
  invoice_prefix: string;
  metadata: Metadata;
  payment_method: PaymentMethod;
  phone_number: string;
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

export class PaymentMethodOption {
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

export class CustomerResponse {
    status: Status;
    data: Customer;
}
export class CustomerListResponse {
  status: Status;
  data: Customer[];
}
export class Customer {
  id: string;
  delinquent: boolean;
  discount: any;
  name: string;
  default_payment_method: string;
  description: string;
  email: string;
  phone_number: string;
  invoice_prefix: string;
  addresses: any[];
  payment_methods: PaymentMethods;
  subscriptions: any;
  created_at: number;
  metadata: Metadata;
  business_vat_id: string;
  ewallet: string;
}

export class PaymentMethods {
  data: PaymentMethodStub[];
  has_more: boolean;
  total_count: number;
  url: string;
}

export class PaymentMethodStub {
  id: string;
  type: string;
  category: string;
  metadata: Metadata;
  image: string;
  webhook_url: string;
  supporting_documentation: string;
  next_action: string;
  bic_swift: string;
  account_last4: string;
  language: string;
  redirect_url: string;
}

export class CheckoutRequest {
  amount: number;
  complete_payment_url: string;
  country: string;
  currency: string;
  customer: string;
  error_payment_url: string;
  merchant_reference_id: string;
  cardholder_preferred_currency: boolean;
  language: string;
  metadata: Metadata;
  payment_method_types_include: string[];
  expiration: number;
  cancel_checkout_url: string;
  complete_checkout_url: string;
  payment_method_types_exclude: any[];
}


export class CheckoutResponse {
    status: Status;
    data: Checkout;
}

export class Checkout {
  id: string;
  status: string;
  language: string;
  org_id: string;
  merchant_color: any;
  merchant_logo: any;
  merchant_website: string;
  merchant_customer_support: MerchantCustomerSupport;
  merchant_alias: string;
  merchant_terms: any;
  merchant_privacy_policy: any;
  page_expiration: number;
  redirect_url: string;
  merchant_main_button: string;
  cancel_checkout_url: string;
  complete_checkout_url: string;
  country: string;
  currency: string;
  amount: number;
  payment: Payment;
  payment_method_type: any;
  payment_method_type_categories: any;
  payment_method_types_include: string[];
  payment_method_types_exclude: any[];
  account_funding_transaction: any;
  customer: string;
  custom_elements: CustomElements;
  timestamp: number;
  payment_expiration: any;
  cart_items: any[];
  escrow: any;
  escrow_release_days: any;
}


export class VisualCodes {}

export class TextualCodes {}

export class Instructions {}

export class PaymentMethodOptions {}

export class CustomElements {
  save_card_default: boolean;
  display_description: boolean;
  payment_fees_display: boolean;
  merchant_currency_only: boolean;
  billing_address_collect: boolean;
  dynamic_currency_conversion: boolean;
}

export class PaymentByBankTransferRequest {
  amount: number;
  currency: string;
  customer: string;
  payment_method: PaymentMethod;
}

export class PaymentResponse {
    status: Status;
    data: Payment;
}
export class PaymentListResponse {
  status: Status;
  data: Payment[];
}

export class PaymentByCardRequest {
  amount: number;
  currency: string;
  customer: string;
  payment_method: PaymentMethod;
  capture: boolean;
  "3DS_required": boolean;
}
export class PaymentByWalletRequest {
  amount: number;
  currency: string;
  customer: string;
  payment_method: PaymentMethod;
  
}

export class Fields {
  number: string;
  expiration_month: string;
  expiration_year: string;
  name: string;
  cvv: string;
}


export class Payment {
  id: string;
  amount: number;
  original_amount: number;
  is_partial: boolean;
  currency_code: string;
  country_code: string;
  status: string;
  description: string;
  merchant_reference_id: string;
  customer_token: string;
  payment_method: string;
  payment_method_data: PaymentMethodData;
  auth_code: any;
  expiration: number;
  captured: boolean;
  refunded: boolean;
  refunded_amount: number;
  receipt_email: string;
  redirect_url: string;
  complete_payment_url: string;
  error_payment_url: string;
  receipt_number: string;
  flow_type: string;
  address: any;
  statement_descriptor: string;
  transaction_id: string;
  created_at: number;
  metadata: Metadata;
  failure_code: string;
  failure_message: string;
  paid: boolean;
  paid_at: number;
  dispute: any;
  refunds: any;
  order: any;
  outcome: any;
  visual_codes: VisualCodes;
  textual_codes: TextualCodes;
  instructions: Instruction[];
  ewallet_id: string;
  ewallets: Ewallet[];
  payment_method_options: PaymentMethodOptions;
  payment_method_type: string;
  payment_method_type_category: string;
  fx_rate: number;
  merchant_requested_currency: any;
  merchant_requested_amount: any;
  fixed_side: string;
  payment_fees: any;
  invoice: string;
  escrow: any;
  group_payment: string;
  cancel_reason: any;
  initiation_type: string;
  mid: string;
  next_action: string;
  error_code: string;
  remitter_information: RemitterInformation;
  save_payment_method: boolean;
}

export class PaymentMethodData {
  id: string;
  type: string;
  category: string;
  metadata: Metadata;
  image: string;
  webhook_url: string;
  supporting_documentation: string;
  next_action: string;
  bic_swift: string;
  account_last4: string;
}

export class Instruction {
  name: string;
  steps: Step[];
}

export class Step {
  step1: string;
}

export class Ewallet {
  ewallet_id: string;
  amount: number;
  percent: number;
  refunded_amount: number;
}


export class RemitterInformation {}

export class PaymentLinkResponse {
    status: Status;
    data: PaymentLink;
}

export class LinkCheckout {
    error_payment_url: string;
    complete_payment_url: string;
}
export class PaymentLinkRequest {
    country: string;
    currency: string;
    amount: number;
    merchantReferenceId: string;
    language: string;
    checkout: LinkCheckout;
}

export class PaymentLink {
  id: string;
  amount: number;
  currency: string;
  country: string;
  amount_is_editable: boolean;
  merchant_reference_id: string;
  redirect_url: string;
  template: Template;
  customer: string;
  status: string;
  language: string;
  merchant_color: string;
  merchant_logo: string;
  merchant_website: string;
  merchant_customer_support: MerchantCustomerSupport;
  merchant_alias: string;
  merchant_terms: string;
  merchant_privacy_policy: string;
  page_expiration: number;
}

export class Template {
  error_payment_url: string;
  complete_payment_url: string;
}

export class MerchantCustomerSupport {
  url: string;
  email: string;
  phone_number: string;
}


export class AddCustomerPaymentMethodRequest {
  type: string;
  complete_payment_url: string;
  error_payment_url: string;
  fields: Field[];
  metadata: Metadata;
}
export class AddCustomerPaymentMethodResponse {
  status: Status;
  data: PaymentMethodStub
}