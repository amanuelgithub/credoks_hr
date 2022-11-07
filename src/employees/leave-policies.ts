// a leave policy configuration file
export const LEAVE_POLICY = {
  totalAllowedSickLeaves: 180,
  totalAllowedAnnualLeaves: 16,
  totalAllowedMaternityLeaves: 120,
  totalAllowedMarriageLeaves: 0,
  totalAllowedPaternityLeaves: 3,
};

export const TOTAL_ALLOWED_LEAVES =
  LEAVE_POLICY.totalAllowedSickLeaves +
  LEAVE_POLICY.totalAllowedAnnualLeaves +
  LEAVE_POLICY.totalAllowedMarriageLeaves +
  LEAVE_POLICY.totalAllowedMaternityLeaves +
  LEAVE_POLICY.totalAllowedPaternityLeaves;
