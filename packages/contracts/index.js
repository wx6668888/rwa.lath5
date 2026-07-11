const API_ERROR_CODES = Object.freeze({
  DATABASE_UNAVAILABLE: 'DATABASE_UNAVAILABLE',
})

const SECURITY_ERROR_CODES = Object.freeze({
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SESSION_NOT_FOUND: 'SECURITY_SESSION_NOT_FOUND',
  DEVICE_NOT_FOUND: 'SECURITY_DEVICE_NOT_FOUND',
  TOTP_ALREADY_CONFIGURED: 'TOTP_ALREADY_CONFIGURED',
  TOTP_NOT_CONFIGURED: 'TOTP_NOT_CONFIGURED',
  TOTP_INVALID: 'TOTP_INVALID',
  PASSKEY_CHALLENGE_INVALID: 'PASSKEY_CHALLENGE_INVALID',
  PASSKEY_VERIFICATION_FAILED: 'PASSKEY_VERIFICATION_FAILED',
  PASSKEY_NOT_FOUND: 'PASSKEY_NOT_FOUND',
  STEP_UP_REQUIRED: 'STEP_UP_REQUIRED',
})

const COMPLIANCE_ERROR_CODES = Object.freeze({
  KYC_CASE_NOT_FOUND: 'COMPLIANCE_KYC_CASE_NOT_FOUND',
  KYC_ALREADY_SUBMITTED: 'COMPLIANCE_KYC_ALREADY_SUBMITTED',
  KYC_NOT_SUBMITTED: 'COMPLIANCE_KYC_NOT_SUBMITTED',
  KYC_DECISION_CONFLICT: 'COMPLIANCE_KYC_DECISION_CONFLICT',
  ELIGIBILITY_NOT_FOUND: 'COMPLIANCE_ELIGIBILITY_NOT_FOUND',
  SCREENING_NOT_FOUND: 'COMPLIANCE_SCREENING_NOT_FOUND',
  REGION_BLOCKED: 'COMPLIANCE_REGION_BLOCKED',
  RISK_FLAG_NOT_FOUND: 'COMPLIANCE_RISK_FLAG_NOT_FOUND',
  PROVIDER_ERROR: 'COMPLIANCE_PROVIDER_ERROR',
})

const states = (...values) => Object.freeze(values)
const IDENTITY_STATES = Object.freeze({
  user: states('active', 'restricted', 'suspended', 'closed'),
  loginIdentity: states('pending', 'verified', 'revoked'),
  session: states('active', 'revoked', 'expired'),
  deviceTrust: states('untrusted', 'trusted', 'revoked'),
  kycCase: states('not_started', 'in_progress', 'submitted', 'needs_information', 'approved', 'rejected', 'expired'),
  eligibility: states('browse_only', 'ineligible', 'eligible', 'manual_review'),
  riskFlag: states('open', 'under_review', 'resolved', 'dismissed'),
  screeningCase: states('pending', 'clear', 'potential_match', 'confirmed_match', 'dismissed'),
})

module.exports = {
  API_ERROR_CODES,
  SECURITY_ERROR_CODES,
  COMPLIANCE_ERROR_CODES,
  IDENTITY_STATES,
}
