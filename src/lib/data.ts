export type RightCategory = "eviction" | "deposit" | "rent_hike" | "repairs";

export interface TenantRight {
  id: string;
  state: string;
  category: RightCategory;
  title: string;
  content: string;
  legal_reference: string;
}

export const STATES = [
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
];

export const CATEGORIES: { value: RightCategory; label: string }[] = [
  { value: "eviction", label: "Illegal Eviction" },
  { value: "deposit", label: "Security Deposit" },
  { value: "rent_hike", label: "Unfair Rent Hike" },
  { value: "repairs", label: "Repairs & Maintenance" },
];

export const TENANT_RIGHTS: TenantRight[] = [
  {
    id: "mh-eviction-1",
    state: "Maharashtra",
    category: "eviction",
    title: "180-Day Notice Period",
    content: "Under the Maharashtra Rent Control Act, a landlord cannot evict a tenant without a court order and must generally provide a valid reason such as non-payment of rent for 90 days.",
    legal_reference: "Maharashtra Rent Control Act, 1999, Section 16",
  },
  {
    id: "mh-deposit-1",
    state: "Maharashtra",
    category: "deposit",
    title: "Upper Limit on Deposit",
    content: "The security deposit should typically not exceed 3 times the monthly rent for residential premises.",
    legal_reference: "Model Tenancy Act Guidelines",
  },
  {
    id: "ka-deposit-1",
    state: "Karnataka",
    category: "deposit",
    title: "Deposit Refund Timing",
    content: "Landlords must refund the security deposit within 1 month of the tenant vacating the premises, after deducting only legitimate dues.",
    legal_reference: "Karnataka Rent Control Act",
  },
  {
    id: "dl-hike-1",
    state: "Delhi",
    category: "rent_hike",
    title: "Standard Rent Protection",
    content: "Rent can only be increased as per the terms specified in the registered rental agreement. Sudden hikes without notice are illegal.",
    legal_reference: "Delhi Rent Act, 1958",
  },
  {
    id: "all-repairs-1",
    state: "General",
    category: "repairs",
    title: "Essential Services",
    content: "Landlords cannot cut off essential services like water, electricity, or elevators even if there is a dispute over rent.",
    legal_reference: "Model Tenancy Act, Section 20",
  },
];
