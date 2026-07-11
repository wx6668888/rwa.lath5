export declare const API_ERROR_CODES: Readonly<{
  DATABASE_UNAVAILABLE: 'DATABASE_UNAVAILABLE'
}>

export declare const SECURITY_ERROR_CODES: Readonly<{
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED'
  SESSION_EXPIRED: 'SESSION_EXPIRED'
  SESSION_NOT_FOUND: 'SECURITY_SESSION_NOT_FOUND'
  DEVICE_NOT_FOUND: 'SECURITY_DEVICE_NOT_FOUND'
  TOTP_ALREADY_CONFIGURED: 'TOTP_ALREADY_CONFIGURED'
  TOTP_NOT_CONFIGURED: 'TOTP_NOT_CONFIGURED'
  TOTP_INVALID: 'TOTP_INVALID'
  PASSKEY_CHALLENGE_INVALID: 'PASSKEY_CHALLENGE_INVALID'
  PASSKEY_VERIFICATION_FAILED: 'PASSKEY_VERIFICATION_FAILED'
  PASSKEY_NOT_FOUND: 'PASSKEY_NOT_FOUND'
  STEP_UP_REQUIRED: 'STEP_UP_REQUIRED'
}>

export declare const COMPLIANCE_ERROR_CODES: Readonly<{
  KYC_CASE_NOT_FOUND: 'COMPLIANCE_KYC_CASE_NOT_FOUND'
  KYC_ALREADY_SUBMITTED: 'COMPLIANCE_KYC_ALREADY_SUBMITTED'
  KYC_NOT_SUBMITTED: 'COMPLIANCE_KYC_NOT_SUBMITTED'
  KYC_DECISION_CONFLICT: 'COMPLIANCE_KYC_DECISION_CONFLICT'
  ELIGIBILITY_NOT_FOUND: 'COMPLIANCE_ELIGIBILITY_NOT_FOUND'
  SCREENING_NOT_FOUND: 'COMPLIANCE_SCREENING_NOT_FOUND'
  REGION_BLOCKED: 'COMPLIANCE_REGION_BLOCKED'
  RISK_FLAG_NOT_FOUND: 'COMPLIANCE_RISK_FLAG_NOT_FOUND'
  PROVIDER_ERROR: 'COMPLIANCE_PROVIDER_ERROR'
}>

export declare const IDENTITY_STATES: Readonly<{
  user: readonly ['active', 'restricted', 'suspended', 'closed']
  loginIdentity: readonly ['pending', 'verified', 'revoked']
  session: readonly ['active', 'revoked', 'expired']
  deviceTrust: readonly ['untrusted', 'trusted', 'revoked']
  kycCase: readonly ['not_started', 'in_progress', 'submitted', 'needs_information', 'approved', 'rejected', 'expired']
  eligibility: readonly ['browse_only', 'ineligible', 'eligible', 'manual_review']
  riskFlag: readonly ['open', 'under_review', 'resolved', 'dismissed']
  screeningCase: readonly ['pending', 'clear', 'potential_match', 'confirmed_match', 'dismissed']
}>
