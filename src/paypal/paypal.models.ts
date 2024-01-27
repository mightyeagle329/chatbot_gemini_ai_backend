export class AccessResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  supported_authn_schemes: string[];
  nonce: string;
  client_metadata: ClientMetadata;
}
export class ClientMetadata {
  name: string;
  display_name: string;
  logo_uri: string;
  scopes: string[];
  ui_type: string;
}

export class ErrorResponse {
  name: string;
  message: string;
  debug_id: string;
  details: Detail[];
  links: Link[];
}

export class Detail {
  field: string;
  value: string;
  location: string;
  issue: string;
  description: string;
}

export class PayPalProductRequest {
  name: string;
  description: string;
  type: string;
  category: string;
  image_url: string;
  home_url: string;
}
export class Product {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  image_url: string;
  home_url: string;
  create_time: string;
  update_time: string;
  links: Link[];
}
export class Link {
  href: string;
  rel: string;
  method: string;
}

export class Plan {
  id: string;
  product_id: string;
  name: string;
  description: string;
  status: string;
  billing_cycles: BillingCycle[];
  payment_preferences: PaymentPreferences;
  taxes: Taxes;
  create_time: string;
  update_time: string;
  links: Link[];
}

export class Taxes {
  percentage: string;
  inclusive: boolean;
}
export class PaymentPreferences {
  auto_bill_outstanding: boolean;
  setup_fee: FixedPrice;
  setup_fee_failure_action: string;
  payment_failure_threshold: number;
}
export class BillingCycle {
  frequency: Frequency;
  tenure_type: string;
  sequence: number;
  total_cycles: number;
  pricing_scheme: PricingScheme;
}
export class PricingScheme {
  fixed_price: FixedPrice;
  version: number;
  create_time: string;
  update_time: string;
}
export class FixedPrice {
  value: string;
  currency_code: string;
}
export class Frequency {
  interval_unit: string;
  interval_count: number;
}
//
export class RootObject {
  id: string;
  status: string;
  status_update_time: string;
  plan_id: string;
  plan_overridden: boolean;
  start_time: string;
  quantity: string;
  shipping_amount: ShippingAmount;
  subscriber: Subscriber;
  create_time: string;
  links: Link[];
}

export class Subscriber {
  name: Name;
  email_address: string;
  payer_id: string;
  shipping_address: ShippingAddress;
}
export class ShippingAddress {
  name: Name2;
  address: Address;
}
export class Address {
  address_line_1: string;
  address_line_2: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}
export class Name2 {
  full_name: string;
}
export class Name {
  given_name: string;
  surname: string;
}
export class ShippingAmount {
  currency_code: string;
  value: string;
}
