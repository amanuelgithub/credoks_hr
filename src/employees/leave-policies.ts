// a leave policy configuration file
export const LEAVE_POLICY = {
  totalAllowedSickLeaves: 0,
  totalAllowedAnnualLeaves: 0,
  totalAllowedMaternityLeaves: 0,
  totalAllowedMarriageLeaves: 0,
  totalAllowedPaternityLeaves: 0,
};

export const TOTAL_ALLOWED_LEAVES =
  LEAVE_POLICY.totalAllowedSickLeaves +
  LEAVE_POLICY.totalAllowedAnnualLeaves +
  LEAVE_POLICY.totalAllowedMarriageLeaves +
  LEAVE_POLICY.totalAllowedMaternityLeaves +
  LEAVE_POLICY.totalAllowedPaternityLeaves;
