"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ArrowRight, Share2, Download, Home, BadgeIndianRupee, TrendingUp, Lock, FileText, Settings, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const ISSUES = [
  { id: "eviction", label: "Illegal eviction", icon: Home },
  { id: "deposit", label: "Deposit not returned", icon: BadgeIndianRupee },
  { id: "rent_hike", label: "Rent hike dispute", icon: TrendingUp },
  { id: "lockout", label: "Lockout / entry denial", icon: Lock },
  { id: "agreement", label: "Agreement issues", icon: FileText },
  { id: "maintenance", label: "Maintenance neglect", icon: Settings },
];

// --- COMPREHENSIVE LEGAL DATA MAP ---
// Structure: RIGHTS_DATA[state][issue] = { title, content, legal_reference, action }
// States without a specific act fall back to "General" which uses the Model Tenancy Act / Transfer of Property Act.

const GENERAL_RIGHTS: Record<string, { title: string; content: string; legal_reference: string; action: string }> = {
  eviction: {
    title: "Protection Against Arbitrary Eviction",
    content: "Under the Model Tenancy Act 2021 and Transfer of Property Act 1882, a landlord cannot evict a tenant without a valid ground (e.g., non-payment of rent for 2+ months, subletting without permission) and must give written notice. Forcible eviction without a court order is illegal and amounts to criminal trespass.",
    legal_reference: "Model Tenancy Act 2021 §21; Transfer of Property Act 1882 §106",
    action: "Send a legal notice demanding restoration of possession and pay your rent via bank transfer to create a documented record.",
  },
  deposit: {
    title: "Security Deposit Must Be Returned",
    content: "The Model Tenancy Act 2021 caps security deposit at 2 months rent (residential). The landlord must return the deposit within 1 month of vacating, after deducting only documented repair costs. Withholding without reason is actionable.",
    legal_reference: "Model Tenancy Act 2021 §11; Transfer of Property Act 1882 §108",
    action: "Send a demand notice via registered post. If unresolved in 30 days, file a complaint at the Rent Authority or Consumer Forum.",
  },
  rent_hike: {
    title: "Rent Cannot Be Increased Arbitrarily",
    content: "Rent can only be increased as per the terms agreed in the rental agreement. Under the Model Tenancy Act 2021, rent revision requires a written agreement. Any increase beyond the agreed terms without 3-months notice and written consent is invalid.",
    legal_reference: "Model Tenancy Act 2021 §7; Indian Contract Act 1872",
    action: "Refuse to pay the excess amount and send a legal notice citing your agreement terms. File at Rent Authority if landlord persists.",
  },
  lockout: {
    title: "Landlord Cannot Lock You Out",
    content: "Section 108(e) of the Transfer of Property Act gives tenants the right to peaceful possession. A landlord who cuts utilities, changes locks, or removes belongings is committing wrongful interference and can face criminal charges under IPC §441 (criminal trespass) and §503 (criminal intimidation).",
    legal_reference: "Transfer of Property Act §108(e); IPC §441, §503",
    action: "File an FIR at the local police station immediately. Simultaneously send a legal notice. Courts can grant mandatory injunction for restoration the same day.",
  },
  agreement: {
    title: "One-Sided Clauses Are Unenforceable",
    content: "Under the Indian Contract Act 1872, a contract term that is unconscionable (grossly unfair) or that violates a statutory right is void. Clauses that waive your right to notice before eviction, deny right to repairs, or impose arbitrary penalties are void ab initio.",
    legal_reference: "Indian Contract Act 1872 §23, §25; Model Tenancy Act 2021",
    action: "Do not sign agreements with blank spaces. Get a KiraDarbar Agreement Review (₹499) before signing to flag illegal clauses.",
  },
  maintenance: {
    title: "Landlord Must Maintain Habitable Conditions",
    content: "Under Section 108(b) of the Transfer of Property Act, the landlord must maintain the property in a condition fit for the purposes for which it was let. Tenants can deduct repair costs from rent (with notice) if the landlord fails to act within a reasonable time.",
    legal_reference: "Transfer of Property Act §108(b); Model Tenancy Act 2021 §13",
    action: "Send a written complaint via email/WhatsApp and give 30 days to repair. If unresolved, file at Rent Authority or Consumer Forum for compensation.",
  },
};

const STATE_SPECIFIC_RIGHTS: Record<string, Partial<Record<string, { title: string; content: string; legal_reference: string; action: string }>>> = {
  "Maharashtra": {
    eviction: { title: "Maharashtra Rent Control Act: Strong Tenant Protection", content: "Under the Maharashtra Rent Control Act 1999, a landlord can evict only on specific grounds: non-payment of rent for 6+ months, subletting, bona fide personal use, or irreparable damage. A court order is mandatory before eviction. Self-help eviction is a criminal offense punishable with imprisonment under §28.", legal_reference: "Maharashtra Rent Control Act 1999 §16, §28", action: "File an application before the Court of Small Causes (Mumbai) or Civil Court if served an eviction notice without proper grounds." },
    deposit: { title: "Deposit Limited to 3 Months Rent", content: "In Maharashtra, landlords typically take 2–3 months rent as deposit. The Maharashtra Rent Control Act requires the deposit to be returned within a reasonable time after vacation, net of documented deductions. Withholding is actionable before the Rent Court.", legal_reference: "Maharashtra Rent Control Act 1999 §10; MTA 2021 §11", action: "Send a registered demand notice. File at the Court of Small Causes or District Consumer Disputes Redressal Commission." },
    rent_hike: { title: "Rent Increase Restricted to 4% PA for Protected Premises", content: "For premises under the Maharashtra Rent Control Act, rent increase is capped at 4% per annum. Rent above this requires landlord's application to the Rent Court. New leases post-1999 are governed by MRC Act §4.", legal_reference: "Maharashtra Rent Control Act 1999 §4, §11A", action: "Challenge any increase above 4% PA by filing an application before the Rent Controller." },
    lockout: { title: "Lockout is a Cognizable Offense in Maharashtra", content: "Maharashtra Police Act §135 and IPC §441 make wrongful confinement and criminal trespass cognizable offenses. Police must register an FIR on a tenant lockout complaint. Courts have consistently granted same-day injunctions in Mumbai and Pune.", legal_reference: "Maharashtra Rent Control Act 1999 §28; IPC §441; Maharashtra Police Act §135", action: "File FIR at local police station immediately. Apply for urgent injunction at City Civil Court or Small Causes Court." },
    maintenance: { title: "Landlord Liable for Structural Repairs", content: "Under the Maharashtra Rent Control Act §29, tenants can carry out urgent repairs and recover costs from landlord if the landlord fails to act after a 15-day written notice. The Rent Court can order landlords to carry out repairs.", legal_reference: "Maharashtra Rent Control Act 1999 §29", action: "Give 15-day written notice for repairs. If ignored, carry out repairs and recover costs or file application before Rent Court." },
  },
  "Delhi": {
    eviction: { title: "Delhi Rent Control Act: Wide Protection", content: "The Delhi Rent Control Act 1958 applies to premises with rent up to ₹3,500/month. Landlords need a court decree for eviction; grounds are strictly limited (non-payment, subletting, bona fide need, etc.). The Rent Controller must approve all evictions.", legal_reference: "Delhi Rent Control Act 1958 §14; Model Tenancy Act 2021", action: "If your rent is above ₹3,500/month, the MTA 2021 applies. Challenge eviction before Rent Controller or District Court." },
    deposit: { title: "No Statutory Cap — Rely on Agreement and MTA", content: "Delhi does not have a statutory deposit cap for high-rent premises. The Model Tenancy Act 2021 (applicable to new agreements) caps it at 2 months. File complaint at Rent Authority if deposit is withheld beyond 1 month of vacating.", legal_reference: "Delhi Rent Control Act 1958; Model Tenancy Act 2021 §11", action: "File complaint at Rent Authority of Delhi (Tis Hazari Courts) or Consumer Forum West/East Delhi." },
    rent_hike: { title: "Standard Rent Applies for DRC Premises", content: "For premises under the Delhi Rent Control Act, the 'standard rent' is fixed and cannot be exceeded. For newer agreements, rent increase must be agreed in writing. Unilateral increase is challengeable before the Rent Controller.", legal_reference: "Delhi Rent Control Act 1958 §10, §12", action: "Apply to the Rent Controller to fix or determine standard rent if your landlord is charging above the legal limit." },
    lockout: { title: "Police Must Act on Lockout Complaints in Delhi", content: "Delhi Police Standing Order 310 mandates registration of FIR for unlawful dispossession. In addition, tenants can file an urgent writ petition before the Delhi High Court for restoration of possession within hours.", legal_reference: "IPC §441; Delhi Rent Control Act 1958 §14(1)(a)", action: "File FIR at local police. Apply for urgent injunction at District Court. Delhi HC has restored possession same-day in urgent cases." },
    maintenance: { title: "Standard of Repair Must Be Maintained", content: "Delhi Rent Control Act §29 requires landlords to keep premises in good repair. Tenants may apply to the Rent Controller, who can direct the landlord to carry out repairs within a specified period. Failure to comply is contempt of court.", legal_reference: "Delhi Rent Control Act 1958 §29, §30", action: "Apply to Rent Controller for a repair direction order after giving written notice and waiting 30 days." },
  },
  "Karnataka": {
    eviction: { title: "Karnataka Rent Act: Notice + Court Order Required", content: "The Karnataka Rent Act 2001 requires landlords to issue a written eviction notice and obtain a court decree. Grounds include non-payment for 3 months, subletting without consent, breach of conditions, or bona fide requirement. Forceful eviction without court order is a criminal offense.", legal_reference: "Karnataka Rent Act 2001 §27, §28", action: "Challenge the eviction notice before the Rent Controller (designated Civil Court) in your jurisdiction." },
    deposit: { title: "Deposit Return Governed by Agreement and Karnataka Rent Act", content: "The Karnataka Rent Act requires landlords to return the advance/deposit within 30 days of vacation after deducting legitimately documented damages. Unilateral deductions are challengeable before the Rent Authority.", legal_reference: "Karnataka Rent Act 2001 §4; MTA 2021 §11", action: "Send demand notice via RPAD. File complaint before Rent Authority or Consumer Forum in Bengaluru/Mysuru." },
    rent_hike: { title: "Rent Increase: 10% PA Cap for Controlled Premises", content: "Under the Karnataka Rent Act, for controlled premises, rent can increase by a maximum of 10% per annum. For newer agreements following MTA 2021, increase must be per written agreement terms.", legal_reference: "Karnataka Rent Act 2001 §5, §21", action: "Challenge excess rent hike before Rent Controller. Deposit the 'admitted' rent in court to protect your possession." },
    lockout: { title: "Lockout is Criminal Trespass Under Karnataka Law", content: "Karnataka courts have consistently held that changing locks or cutting utilities amounts to criminal trespass under IPC §441 and forceful dispossession under KPDL. Tenants can get police intervention and civil injunctions.", legal_reference: "Karnataka Rent Act 2001 §32; IPC §441; KPDL 1964", action: "Lodge FIR at local police station. Apply for urgent injunction at Civil Court/Rent Court. Karnataka HC has fast-track mechanisms." },
    maintenance: { title: "Repairs Are Landlord's Responsibility in Karnataka", content: "The landlord is responsible for maintaining the structure and essential services. Under Karnataka Rent Act §13, tenants can serve notice requiring repairs and, after 15 days, carry out urgent repairs themselves and deduct from rent.", legal_reference: "Karnataka Rent Act 2001 §13, §14", action: "Send written repair notice. If no action in 15 days, carry out repairs and deduct from rent (keep all receipts as evidence)." },
  },
  "Tamil Nadu": {
    eviction: { title: "Tamil Nadu Regulation of Rights & Responsibilities of Landlords and Tenants Act 2017", content: "TN's 2017 Act requires all tenancies to be registered through a Rent Authority. Eviction without a Rent Court order is prohibited. Grounds are limited: non-payment, subletting, bona fide need, or misuse of premises. Unregistered tenancies still have protection under general property law.", legal_reference: "TN Regulation of Landlords and Tenants Act 2017 §21; IPC §441", action: "Register your tenancy on the Tamil Nadu Rent Authority portal. Challenge eviction before the Rent Court in Chennai/Coimbatore/Madurai." },
    deposit: { title: "Advance Limited to 2 Months Rent under TN Act", content: "The Tamil Nadu 2017 Act caps advance rent at 2 months for residential premises. Landlords must refund within 1 month of vacation. Any deductions must be with written justification and receipts.", legal_reference: "TN Regulation of Landlords and Tenants Act 2017 §11", action: "File complaint before Rent Authority. If no response in 30 days, escalate to Rent Court." },
    rent_hike: { title: "Rent Revision Only Per Agreement Terms", content: "Under the TN 2017 Act, rent can only be revised as agreed in the registered tenancy agreement. Landlords cannot unilaterally increase rent before the term ends. Any revision must be through a supplementary registered agreement.", legal_reference: "TN Regulation of Landlords and Tenants Act 2017 §7", action: "Refuse excess rent payment. File at Rent Authority. Continue paying agreed rent via bank transfer." },
    lockout: { title: "Lockout is Strict Offense under TN Law", content: "The TN 2017 Act §26 specifically prohibits landlords from cutting essential services (water, electricity) or forcibly evicting without a court order. Violations attract fine and imprisonment up to 6 months.", legal_reference: "TN Regulation of Landlords and Tenants Act 2017 §26", action: "Lodge FIR citing TN Act §26. Apply for urgent mandamus before the Rent Court. TN courts take this seriously." },
    maintenance: { title: "Essential Services Cannot Be Disrupted by Landlord", content: "TN Act §26 and Transfer of Property Act §108(b) together make landlords responsible for maintaining essential services and structural integrity. Tenants can claim compensation for uninhabitable conditions.", legal_reference: "TN Regulation of Landlords and Tenants Act 2017 §26; TPA §108(b)", action: "Send documented complaint (email + WhatsApp screenshot). File at Rent Authority demanding repair order." },
  },
  "Telangana": {
    eviction: { title: "Telangana Tenancies Act: Grounds-Based Eviction Only", content: "Telangana follows the erstwhile AP Buildings (Lease, Rent and Eviction) Control Act 1960 until updated. Eviction requires court order on valid grounds: 6 months arrears, wilful damage, or bona fide owner occupation. Forceful eviction is punishable under IPC §441.", legal_reference: "AP Buildings (Lease, Rent & Eviction) Control Act 1960 §10; IPC §441", action: "File response before Rent Controller if served eviction petition. Challenge unlawful eviction at District Court, Hyderabad." },
    deposit: { title: "Advance Must Be Returned After Deduction of Legitimate Claims", content: "Telangana practice typically involves 10 months advance (especially Hyderabad). The Transfer of Property Act and Model Tenancy Act require refund after documented deductions within 1 month of vacation. Any withholding without reasons is challengeable.", legal_reference: "Transfer of Property Act §108; Model Tenancy Act 2021 §11", action: "Demand refund via RPAD notice. File at Rent Authority/Consumer Forum (City Consumer Forum, Hyderabad)." },
    rent_hike: { title: "Rent Hike Only If Contractually Allowed", content: "In Telangana, rent increase must strictly follow the lease agreement. For older properties under the AP Rent Control Act, standard rent rules apply. Unilateral hike is unenforceable in court.", legal_reference: "AP Buildings Control Act 1960 §6; Indian Contract Act §23", action: "Pay only agreed rent via bank transfer. File at Rent Controller's court challenging the hike." },
    lockout: { title: "Police Intervention is Available for Lockouts in Hyderabad", content: "Hyderabad Police Commissionerate has a dedicated grievance mechanism for tenant lockouts. IPC §441 and AP Rent Control Act §10 together provide grounds for FIR and civil injunction.", legal_reference: "AP Buildings Control Act 1960 §10; IPC §441; TS Police Act", action: "File online FIR on Telangana Police portal (www.tspolice.gov.in). Apply for urgent stay at District Court." },
    maintenance: { title: "Landlord Responsible for Structural and Essential Repairs", content: "The TPA §108(b) and AP Buildings Control Act both impose maintenance obligations on landlords. Tenants can approach the Rent Controller for a direction to maintain premises.", legal_reference: "AP Buildings Control Act 1960; TPA §108(b)", action: "Give 30-day written notice. If ignored, file complaint at Rent Authority or Consumer Forum for compensation." },
  },
  "Gujarat": {
    eviction: { title: "Gujarat Rent Control Act: Formal Eviction Process Mandatory", content: "Under the Gujarat Rent Control Act 1947, no tenant can be evicted except by an order of the Rent Controller. Grounds are: non-payment, nuisance, subletting, or bona fide landlord need. Premises with rent above ₹3,500/month require Civil Court order.", legal_reference: "Gujarat Rent Control Act 1947 §13, §28", action: "Challenge any eviction before the Rent Controller in your city (Ahmedabad, Surat, Vadodara, etc.)." },
    deposit: { title: "Advance Refund Governed by Contract and MTA", content: "Gujarat practice varies by city (Ahmedabad typically 10–12 months advance in some areas). The MTA 2021 caps new agreements at 2 months. Refund must be made within 1 month of vacating. Consumer Forum regularly awards compensation for wrongful withholding.", legal_reference: "Model Tenancy Act 2021 §11; Consumer Protection Act 2019", action: "Send demand notice. File at District Consumer Disputes Redressal Commission in Ahmedabad/Surat." },
    rent_hike: { title: "Rent Settled by Rent Controller if Disputed", content: "The Gujarat Rent Control Act allows both parties to approach the Rent Controller to determine standard rent. Unilateral hike by landlord cannot be enforced without Rent Controller's order.", legal_reference: "Gujarat Rent Control Act 1947 §5, §9", action: "Apply to Rent Controller for standard rent determination. Pay rent under protest in the interim to avoid eviction." },
    lockout: { title: "Lockout — IPC § 441 Applies; file FIR Immediately", content: "Gujarat Police guidelines require registration of FIR for unlawful eviction/lockout. The Gujarat Rent Control Act §28 also provides criminal penalties for landlords who evict without court order.", legal_reference: "Gujarat Rent Control Act 1947 §28; IPC §441", action: "File FIR at local police station. Apply for urgent injunction at Civil Court with key evidence (photos, video, witnesses)." },
    maintenance: { title: "Landlord Must Maintain the Property", content: "TPA §108(b) and Gujarat Rent Control Act impose duty on landlord to keep property habitable. Tenants can file application before Rent Controller for a repair order.", legal_reference: "Gujarat Rent Control Act 1947; TPA §108(b)", action: "Give 30-day written repair notice. File application before Rent Controller for mandatory repair order." },
  },
  "Rajasthan": {
    eviction: { title: "Rajasthan Rent Control Act 2001: Court Order Mandatory", content: "The Rajasthan Rent Control Act 2001 requires a Rent Tribunal order for eviction. Grounds: non-payment of 3+ months rent, subletting, bona fide personal use. Unregistered agreements still receive protection under TPA 1882.", legal_reference: "Rajasthan Rent Control Act 2001 §14, §23", action: "Appear before Rent Tribunal (Jaipur/Jodhpur/Kota) if served eviction notice. Challenge procedural defects to buy time." },
    deposit: { title: "Security Deposit Return within 1 Month of Vacation", content: "Under MTA 2021 (for new agreements), deposit is capped at 2 months. For older agreements, the contractual amount applies. Landlord must return within 30 days with written deduction details or face civil liability.", legal_reference: "Model Tenancy Act 2021 §11; Rajasthan Rent Control Act 2001", action: "Send RPAD notice. File at District Consumer Forum in Jaipur/Jodhpur if unresolved in 30 days." },
    rent_hike: { title: "Tenancy Terms Govern Rent Increase", content: "Under Rajasthan RC Act 2001, rent increase beyond what is agreed is challengeable before the Rent Tribunal. Standard rent can be determined by the Tribunal on application.", legal_reference: "Rajasthan Rent Control Act 2001 §5, §8", action: "File application at Rent Tribunal for standard rent fixation if facing excessive hike." },
    lockout: { title: "Police Protection Available Against Lockouts in Rajasthan", content: "Rajasthan Police have jurisdiction to intervene in tenant lockout cases under IPC §441 and §503. Tenants can approach Superintendent of Police or DCP directly if local police are unresponsive.", legal_reference: "IPC §441; Rajasthan Police Act; Rajasthan RC Act 2001 §23", action: "File FIR. If police don't act, approach SP/DCP. File urgent writ at Rajasthan High Court (Jodhpur) or bench at Jaipur." },
    maintenance: { title: "Landlord Must Keep Property Habitable", content: "TPA §108(b) and Rajasthan RC Act together require landlords to maintain premises. Courts can pass mandatory injunctions requiring landlords to carry out specific repairs.", legal_reference: "Rajasthan Rent Control Act 2001; TPA §108(b)", action: "Give 30-day written notice. File complaint at Rent Tribunal for mandatory repair direction." },
  },
  "Uttar Pradesh": {
    eviction: { title: "UP Urban Buildings Regulation Act: Very Strong Tenant Protection", content: "The UP Urban Buildings (Regulation of Letting, Rent & Eviction) Act 1972 heavily protects tenants in specified buildings. Eviction only by Prescribed Authority order on listed grounds. Unauthorized eviction is a criminal offense under §27.", legal_reference: "UP Urban Buildings Act 1972 §20, §27", action: "If you are in a 'regulated building', challenge eviction before the Prescribed Authority (SDM/Rent Controller) in your district." },
    deposit: { title: "Advance Rent Regulated Under UP Act", content: "The UP Urban Buildings Act §20(2) prohibits taking more than 1 month's advance for regulated buildings. Excess advance is recoverable. MTA 2021 applies to unregulated buildings (post-1985 construction), capping at 2 months.", legal_reference: "UP Urban Buildings Act 1972 §20(2); MTA 2021 §11", action: "File complaint before Prescribed Authority (SDM) for excess advance recovery or withheld deposit." },
    rent_hike: { title: "Rent Fixed by Rent Act — Cannot Exceed Authorized Amount", content: "For buildings under UP Urban Buildings Act, the authorized rent is determined by the Prescribed Authority. No landlord can charge beyond this. For unregulated buildings, contract terms govern.", legal_reference: "UP Urban Buildings Act 1972 §4, §9", action: "Apply to Prescribed Authority (SDM) for determination of authorized rent." },
    lockout: { title: "UP Act §27 — Criminal Penalty for Wrongful Eviction", content: "Section 27 of the UP Urban Buildings Act makes any person who causes or attempts to cause wrongful eviction liable to imprisonment up to 3 years or fine. Police must file FIR under this provision.", legal_reference: "UP Urban Buildings Act 1972 §27; IPC §441", action: "File FIR citing §27 of UP Urban Buildings Act. Approach Prescribed Authority for immediate restoration order." },
    maintenance: { title: "Landlord Responsible Under UP Act", content: "The UP Act and TPA §108(b) together impose repair obligations. Courts in UP have granted rent abatement (reduction) for uninhabitable conditions.", legal_reference: "UP Urban Buildings Act 1972; TPA §108(b)", action: "Give written notice. Apply to Prescribed Authority for repair order or rent abatement." },
  },
  "West Bengal": {
    eviction: { title: "West Bengal Premises Tenancy Act: Court Decree Mandatory", content: "The West Bengal Premises Tenancy Act 1997 prohibits eviction without a court decree. Grounds: arrears of rent for 2+ months, unlawful subletting, bona fide requirement, or irreparable damage. Tenants have strong protection even against landlords who prove bona fide need.", legal_reference: "WB Premises Tenancy Act 1997 §5, §24", action: "Contest eviction before the Civil Court (2nd or Munsiff Court) in Kolkata/Howrah/Siliguri. File written objection within 30 days of notice." },
    deposit: { title: "Advance Return Governed by WB Act and Contract", content: "Under WB Premises Tenancy Act, any advance or deposit must be returned after deducting only legitimately documented damages. Delay beyond 1 month without reason is actionable before Civil Court.", legal_reference: "WB Premises Tenancy Act 1997; MTA 2021 §11", action: "Send RPAD notice. File at Civil Court (Original Side) or Consumer Forum in Kolkata." },
    rent_hike: { title: "Rent Enhancement by Application to Rent Controller", content: "WB Tenancy Act allows landlords to apply for enhanced rent after specific periods. Unilateral increase without court approval is unenforceable. Tenants can challenge any such increase before the Rent Controller.", legal_reference: "WB Premises Tenancy Act 1997 §9, §10", action: "File objection before Rent Controller within 2 months of receiving enhanced rent demand." },
    lockout: { title: "Section 14 WB Act — Landlord Cannot Withhold Access", content: "WB Premises Tenancy Act §14 specifically prohibits interference with lawful possession. Cutting utilities, changing locks, or removing tenant's goods is an offense under the Act and IPC §441.", legal_reference: "WB Premises Tenancy Act 1997 §14; IPC §441", action: "File FIR at local police. Apply to the Civil Court for mandatory injunction for restoration of possession." },
    maintenance: { title: "Landlord Duty: Structural and Essential Repairs", content: "Under WB Premises Tenancy Act §15, landlords must maintain the structure and essential services. Tenants can apply to the Controller for an order directing repairs. Tenants may also carry out urgent repairs and recover costs.", legal_reference: "WB Premises Tenancy Act 1997 §15, §16", action: "File application before Rent Controller for repair direction. Keep all repair demand communications as evidence." },
  },
  "Haryana": {
    eviction: { title: "Haryana Rent Control Act: Court Intervention Required", content: "The Haryana Urban (Control of Rent and Eviction) Act 1973 requires the Rent Controller's order for eviction. Grounds: 3+ months arrears, subletting, damage, or bona fide use. Amendments in 2014 streamlined the process but tenant rights remain protected.", legal_reference: "Haryana Urban Rent and Eviction Control Act 1973 §13, §14", action: "File response before Rent Controller at local Civil Court (Gurugram/Faridabad/Hisar) within 30 days." },
    deposit: { title: "Refund within 1 Month After Settlement of Dues", content: "No statutory cap in Haryana for older tenancies. MTA 2021 applies to new agreements, capping at 2 months. Deposit must be refunded after tenant vacates and dues settled. Consumer Forum provides effective remedy.", legal_reference: "MTA 2021 §11; Consumer Protection Act 2019", action: "Send RPAD demand notice. File at District Consumer Disputes Redressal Commission (Gurugram/Faridabad)." },
    rent_hike: { title: "Annual Increase Only Per Contract or Rent Controller's Order", content: "The Haryana RC Act allows standard rent determination. Unilateral hike without Rent Controller approval is void. Tenants can deposit rent in court to protect possession.", legal_reference: "Haryana Urban Rent and Eviction Control Act 1973 §5, §6", action: "Continue paying old rent via bank. Apply to Rent Controller for standard rent determination." },
    lockout: { title: "Immediate Police Remedy Available in Haryana", content: "Haryana Police guidelines require urgent intervention for tenant lockout cases. IPC §441 and Haryana Rent Control Act together provide grounds for both criminal FIR and civil injunction.", legal_reference: "Haryana RC Act 1973 §14; IPC §441", action: "File FIR. If no response within 24 hours, approach DSP or file writ before Punjab & Haryana High Court." },
    maintenance: { title: "Essential Services Cannot Be Disrupted", content: "TPA §108(b) and Haryana RC Act require maintenance of habitable conditions. Courts in Gurugram and Faridabad have granted heavy compensation for deliberate neglect.", legal_reference: "Haryana RC Act 1973; TPA §108(b)", action: "Send written repair notice. File complaint at Consumer Forum for compensation if landlord is unresponsive." },
  },
  "Punjab": {
    eviction: { title: "Punjab Rent Act 1949: Controls Old Buildings", content: "The Punjab Rent Act 1949 applies to old buildings in urban areas. New buildings (post-1985) follow TPA 1882 and MTA 2021. Eviction for controlled buildings requires Rent Controller's order. Grounds are strictly limited by the Act.", legal_reference: "Punjab Rent Act 1949 §13, §14; MTA 2021", action: "File response before Rent Controller at Civil Court in Chandigarh/Ludhiana/Amritsar within the notice period." },
    deposit: { title: "Deposit Terms Governed by Agreement; MTA Applies to New Tenancies", content: "For new agreements under MTA 2021, deposit is capped at 2 months rent. Landlords must return within 1 month of vacation. Punjab Consumer Forums have awarded damages plus 9% interest on withheld deposits.", legal_reference: "MTA 2021 §11; Consumer Protection Act 2019", action: "Send demand notice via RPAD. File at District Consumer Forum in Ludhiana/Amritsar/Chandigarh." },
    rent_hike: { title: "Standard Rent Fixed by Rent Controller for Old Buildings", content: "For buildings under Punjab Rent Act, standard rent is fixed by the Rent Controller and cannot be exceeded. New buildings follow contract terms and MTA 2021.", legal_reference: "Punjab Rent Act 1949 §5, §9; MTA 2021 §7", action: "Apply to Rent Controller for standard rent fixation. Pay only admitted rent under protest if hike is challenged." },
    lockout: { title: "Punjab Police and Rent Controller Both Have Jurisdiction", content: "Both FIR under IPC §441 and application to Rent Controller are valid remedies for lockout in Punjab. Punjab & Haryana High Court has repeatedly upheld tenants' right to possession without court order.", legal_reference: "Punjab Rent Act 1949; IPC §441; Punjab Police Rules", action: "File FIR. Apply to Rent Controller for possession restoration. Approach Punjab & Haryana HC via urgent writ if needed." },
    maintenance: { title: "Landlord's Maintenance Obligation Under Punjab Rent Act", content: "Landlord must maintain the structure. Tenant can apply to Rent Controller for directions to carry out repairs. Rent abatement is available for uninhabitable conditions.", legal_reference: "Punjab Rent Act 1949; TPA §108(b)", action: "Give 30-day repair notice. Apply to Rent Controller for mandatory repair order or rent abatement." },
  },
  "Madhya Pradesh": {
    eviction: { title: "MP Accommodation Control Act 1961: Eviction via Court Only", content: "The MP Accommodation Control Act 1961 governs urban tenancies. Eviction requires Rent Authority order on specified grounds: default of 2+ months, subletting, personal requirement, or structural danger. Forceful eviction is punishable under §29.", legal_reference: "MP Accommodation Control Act 1961 §12, §29", action: "Challenge eviction before Rent Authority (Civil Collector/Court) in Bhopal/Indore/Jabalpur within the prescribed time." },
    deposit: { title: "Advance Deposit Must Be Refunded by MP Landlords", content: "MTA 2021 caps deposit at 2 months for new tenancies. MP landlords must return deposit within 1 month of vacation. Consumer Forum is effective remedy in Bhopal/Indore.", legal_reference: "MP Accommodation Control Act 1961; MTA 2021 §11", action: "File consumer complaint and send RPAD demand notice. Attach all deposit payment evidence." },
    rent_hike: { title: "Standard Rent Determinable by Rent Authority in MP", content: "The Rent Authority can determine standard rent on application by either party. Unilateral hike beyond contract terms or standard rent is unenforceable.", legal_reference: "MP Accommodation Control Act 1961 §4, §7", action: "Apply to Rent Authority for standard rent fixation. Continue paying old rent under protest in the interim." },
    lockout: { title: "MP Courts Grant Urgent Injunctions for Lockouts", content: "IPC §441 and MP Accommodation Control Act §29 together make wrongful eviction a punishable offense. Civil courts in MP regularly grant ad hoc injunctions to restore possession pending trial.", legal_reference: "MP Accommodation Control Act 1961 §29; IPC §441", action: "File FIR. Apply for urgent injunction at City Civil Court/District Court in Bhopal or Indore." },
    maintenance: { title: "Essential Services Must Be Maintained by Landlord in MP", content: "The MP Act and TPA together impose maintenance duties. Courts can award damages for disruption of essential services or structural neglect.", legal_reference: "MP Accommodation Control Act 1961; TPA §108(b)", action: "Send 30-day written notice. File at Rent Authority or Consumer Forum for compensation and repair order." },
  },
  "Kerala": {
    eviction: { title: "Kerala Buildings (Lease and Rent Control) Act 1965: Strong Protections", content: "The Kerala Rent Control Act 1965 is one of India's most tenant-friendly laws. Eviction requires Rent Control Court order. Grounds are narrowly defined: arrears, subletting, bona fide use, nuisance, or building reconstruction. The Act applies to all urban buildings.", legal_reference: "Kerala Buildings Lease and Rent Control Act 1965 §11, §12", action: "Contest eviction before the Rent Control Court (Munsiff/Civil Judge Court) in Thiruvananthapuram/Kochi/Kozhikode." },
    deposit: { title: "Advance Limited to 3 Months Under Kerala RCA", content: "The Kerala Rent Control Act limits advance rent to 3 months. Excess advance is recoverable with legal interest. Deposit must be refunded within 30 days of vacation.", legal_reference: "Kerala Buildings Lease and Rent Control Act 1965 §22", action: "Apply to Rent Control Court for recovery of excess advance or withheld deposit." },
    rent_hike: { title: "Rent Increases Regulated by Fair Rent Provisions", content: "The Kerala Act allows landlords to apply for 'fair rent' determination. Any increase beyond the fair rent determined by the court is void. Tenants paying above fair rent can apply for refund.", legal_reference: "Kerala Buildings Lease and Rent Control Act 1965 §5, §6", action: "Apply for fair rent determination at Rent Control Court if facing disproportionate hike." },
    lockout: { title: "Kerala §20 — Criminal Liability for Eviction Without Court Order", content: "Section 20 of the Kerala Rent Control Act makes unlawful eviction a criminal offense punishable with imprisonment up to 1 year. Kerala Police must file FIR under this provision on tenant's complaint.", legal_reference: "Kerala Buildings Lease and Rent Control Act 1965 §20; IPC §441", action: "File FIR citing §20 of Kerala RCA. Police must act. Also apply to Rent Control Court for restoration." },
    maintenance: { title: "Landlord Liable for Essential Infrastructure in Kerala", content: "Kerala RCA and TPA together impose maintenance obligations. Kerala courts have awarded substantial damages for disruption of water and electricity supplies by landlords.", legal_reference: "Kerala Buildings Lease and Rent Control Act 1965; TPA §108(b)", action: "File complaint at Rent Control Court for repair order. Also file consumer complaint for service disruption." },
  },
  "Andhra Pradesh": {
    eviction: { title: "AP Buildings Control Act: Eviction Through Rent Controller Only", content: "The Andhra Pradesh Buildings (Lease, Rent and Eviction) Control Act 1960 governs all tenancies in AP urban areas. Eviction only by Rent Controller's order on permitted grounds: 6 months default, bona fide need, subletting. Forcible eviction is a criminal offense.", legal_reference: "AP Buildings Control Act 1960 §10, §23", action: "File objection before Rent Controller at local Civil Court within 14 days of eviction notice." },
    deposit: { title: "Deposit Refund Actionable Before Consumer Forum in AP", content: "AP practice allows 10-month advance in some areas. MTA 2021 caps new agreements at 2 months. Refund within 1 month after documented deductions. Consumer forums in Visakhapatnam and Vijayawada are effective.", legal_reference: "AP Buildings Control Act 1960; MTA 2021 §11; Consumer Protection Act 2019", action: "File consumer complaint or application before Rent Controller for deposit refund." },
    rent_hike: { title: "Standard Rent Determined by AP Rent Controller", content: "The AP Act allows either party to apply for standard rent determination. Unilateral increase above agreed or standard rent is void and cannot form the basis for eviction.", legal_reference: "AP Buildings Control Act 1960 §6, §9", action: "Apply to Rent Controller for standard rent fixation. Deposit rent in court under protest while dispute is pending." },
    lockout: { title: "AP Police Helpline and FIR for Tenant Lockouts", content: "AP Police allow online FIR filing for civil disputes including tenant lockouts. IPC §441 and AP Buildings Control Act §23 provide both criminal and civil remedies for wrongful eviction.", legal_reference: "AP Buildings Control Act 1960 §23; IPC §441", action: "File online FIR on AP Police portal. Apply for urgent injunction at local Civil Court." },
    maintenance: { title: "Landlord Must Maintain Premises Under AP Act", content: "The AP Buildings Control Act and TPA §108(b) require landlords to keep premises fit for use. Rent Controllers in AP have ordered repair and awarded rent abatement for non-compliance.", legal_reference: "AP Buildings Control Act 1960; TPA §108(b)", action: "Give 30-day written notice. File complaint before Rent Controller for mandatory repair order." },
  },
  "Assam": {
    eviction: { title: "Assam Urban Areas Rent Control Act 1972: Court Order Mandatory", content: "The Assam Urban Areas Rent Control Act 1972 protects tenants in all urban areas (Guwahati, Dibrugarh, Jorhat, Silchar). Eviction only by Rent Controller's order on statutory grounds: non-payment of 3+ months rent, subletting, bona fide requirement, or building demolition. Unilateral eviction is a criminal offense under §28.", legal_reference: "Assam Urban Areas Rent Control Act 1972 §13, §28; IPC §441", action: "Contest eviction before the Rent Controller (Civil Court) in your district within 30 days of notice." },
    deposit: { title: "Advance Refund Governed by Assam RC Act and MTA", content: "Assam RC Act and MTA 2021 together require landlords to refund deposits within 30 days of vacation. Consumer Forum in Guwahati regularly awards 9% interest on unreturned deposits.", legal_reference: "Assam Urban Areas Rent Control Act 1972; MTA 2021 §11; Consumer Protection Act 2019", action: "Send RPAD demand notice. File at District Consumer Disputes Redressal Commission, Guwahati." },
    rent_hike: { title: "Standard Rent Fixed by Rent Controller in Assam", content: "Under the Assam RC Act §5, either party can apply for standard rent determination. Rent above the standard rent is irrecoverable. Unilateral hike is not enforceable.", legal_reference: "Assam Urban Areas Rent Control Act 1972 §5, §9", action: "Apply to Rent Controller for standard rent fixation. Pay old rent under protest to safeguard against eviction." },
    lockout: { title: "§28 Assam Act — Criminal Penalty for Unauthorized Eviction", content: "Section 28 of the Assam RC Act penalizes any person who evicts a tenant unauthorized with imprisonment up to 3 years. Police in Assam must respond to tenant lockout FIRs under this provision.", legal_reference: "Assam Urban Areas Rent Control Act 1972 §28; IPC §441", action: "File FIR citing §28 of Assam RC Act. Apply to Rent Controller for urgent restoration order." },
    agreement: { title: "Void Tenancy Clauses Under Indian Contract Act", content: "Clauses waiving statutory rights (e.g., right to notice, right to repairs) are void under the Indian Contract Act §23. Assam courts have set aside such clauses in tenancy disputes.", legal_reference: "Indian Contract Act 1872 §23; Assam Urban Areas Rent Control Act 1972", action: "Get a KiraDarbar agreement review before signing. Challenge void clauses before Rent Controller." },
    maintenance: { title: "Landlord Must Maintain Premises in Assam", content: "TPA §108(b) and Assam RC Act impose joint obligation to maintain premises. Tenants can apply to Rent Controller for repair directions. Gauhati High Court has enforced this obligation.", legal_reference: "Assam Urban Areas Rent Control Act 1972; TPA §108(b)", action: "Give 30-day written repair notice. File before Rent Controller for mandatory repair order." },
  },
  "Bihar": {
    eviction: { title: "Bihar Buildings (Lease, Rent and Eviction) Control Act 1982", content: "Bihar's Rent Control Act 1982 governs urban tenancies. Eviction requires Rent Controller's decree on grounds: non-payment (2+ months), subletting, bona fide requirement, or structural danger. The Act applies to all urban areas including Patna, Gaya, Bhagalpur. Unauthorized eviction is punishable under §26.", legal_reference: "Bihar Buildings Lease, Rent and Eviction Control Act 1982 §11, §26", action: "File response before Rent Controller at District Civil Court within 30 days of receiving eviction notice." },
    deposit: { title: "Deposit Return Governed by Bihar RC Act", content: "Bihar RC Act and MTA 2021 together require landlords to return deposits within 1 month of vacation, with written justification for any deductions. Consumer Forum Patna has consistently awarded refund plus interest.", legal_reference: "Bihar RC Act 1982; MTA 2021 §11; Consumer Protection Act 2019", action: "Send RPAD demand notice to landlord. File at District Consumer Forum in Patna/Gaya/Muzaffarpur." },
    rent_hike: { title: "Standard Rent Applicable to Bihar Controlled Premises", content: "For premises under Bihar RC Act, standard rent is the contractual rent at commencement, increased by 10% after each 5-year period. Unilateral hike above standard rent is void.", legal_reference: "Bihar Buildings Lease, Rent and Eviction Control Act 1982 §5, §7", action: "Apply to Rent Controller for standard rent determination. Continue paying old rent under protest." },
    lockout: { title: "§26 Bihar Act — Wrongful Eviction is a Criminal Offense", content: "Section 26 of Bihar RC Act 1982 makes unauthorized eviction punishable with up to 2 years imprisonment. Police in Patna and other cities must register FIR under this provision.", legal_reference: "Bihar Buildings Lease, Rent and Eviction Control Act 1982 §26; IPC §441", action: "File FIR at local police station citing §26 of Bihar RC Act. Apply to Rent Controller for immediate restoration." },
    agreement: { title: "Unregistered Agreements Still Protect Tenants in Bihar", content: "Even unregistered tenancy agreements create valid tenancy rights in Bihar. The Bihar RC Act does not require registration for protection. Courts in Patna HC have upheld this principle.", legal_reference: "Bihar RC Act 1982; Indian Contract Act 1872; Patna HC precedents", action: "Even without a registered agreement, challenge eviction before Rent Controller using payment receipts and WhatsApp evidence." },
    maintenance: { title: "Landlord Duty of Maintenance in Bihar", content: "TPA §108(b) and Bihar RC Act impose repair obligations. Patna High Court has directed landlords to maintain essential services and upheld rent abatement for uninhabitable premises.", legal_reference: "Bihar RC Act 1982; TPA §108(b)", action: "Send 30-day written notice. File before Rent Controller or Consumer Forum for repair order and compensation." },
  },
  "Goa": {
    eviction: { title: "Goa, Daman and Diu Buildings (Lease, Rent and Eviction) Control Act 1968", content: "This Act governs all urban buildings in Goa. Eviction only by Rent Controller's order on grounds: non-payment of 3+ months, subletting, bona fide personal use, or building danger. Forceful eviction is punishable. The Act is administered by the Civil Judge (Junior Division).", legal_reference: "Goa Buildings Lease, Rent and Eviction Control Act 1968 §14, §23", action: "File written objection before Rent Controller (Civil Judge JD) in Panaji/Margao within 30 days of eviction notice." },
    deposit: { title: "Advance Rent Refundable Under Goa RC Act", content: "The Goa RC Act and MTA 2021 require deposit refund within 1 month of vacation. Consumer Forum in Panaji and District Court are effective forums. Goa courts have imposed interest on delayed refunds.", legal_reference: "Goa RC Act 1968; MTA 2021 §11; Consumer Protection Act 2019", action: "Send RPAD notice. File at District Consumer Forum, Panaji or Margao." },
    rent_hike: { title: "Fair Rent Determinable by Rent Controller in Goa", content: "The Goa RC Act §5 allows either party to apply for fair rent determination. Unilateral rent increase above fair rent or agreed terms is void and irrecoverable.", legal_reference: "Goa Buildings Lease, Rent and Eviction Control Act 1968 §5, §8", action: "Apply for fair rent determination to Civil Judge JD at Panaji. Pay admitted rent under protest." },
    lockout: { title: "Goa Police and Rent Court Both Act on Tenant Lockouts", content: "Goa Police are responsive to tenant lockout complaints under IPC §441 and Goa RC Act §23. Bombay HC (Goa bench) has granted same-day injunctions for tenant restoration in urgent cases.", legal_reference: "Goa RC Act 1968 §23; IPC §441; Bombay HC Goa Bench precedents", action: "File FIR at local police. Apply for urgent injunction at Civil Court in Panaji. Approach Bombay HC Goa bench for urgent relief." },
    agreement: { title: "Tenancy Agreements Must Comply with Goa RC Act", content: "Clauses purporting to waive rights under the Goa RC Act are void. Tenants can enforce statutory rights regardless of what the agreement says. Portuguese Civil Code (still applicable in Goa) provides additional tenant protections.", legal_reference: "Goa RC Act 1968; Portuguese Civil Code (Goa applicability); Indian Contract Act §23", action: "Get an agreement review to identify void clauses. Challenge illegal terms before Rent Controller." },
    maintenance: { title: "Landlord Must Maintain Structural Safety in Goa", content: "The Goa RC Act and TPA §108(b) impose maintenance obligations. Goa's coastal environment makes structural maintenance especially critical. Courts have awarded damages for water damage from landlord's neglect.", legal_reference: "Goa RC Act 1968; TPA §108(b)", action: "Issue written repair notice. File before Rent Controller for mandatory repair order or rent abatement." },
  },
  "Odisha": {
    eviction: { title: "Odisha House Rent Control Act 1967: Eviction via Rent Court", content: "The Odisha House Rent Control Act 1967 governs urban tenancies across Bhubaneswar, Cuttack, Rourkela, and other towns. Eviction only by Rent Court order on grounds: arrears, subletting, bona fide requirement, or building repair/demolition. Criminal penalty for unauthorized eviction under §28.", legal_reference: "Odisha House Rent Control Act 1967 §7, §28; IPC §441", action: "File response before Rent Court (Munsiff/Civil Judge) in your district within 30 days of notice." },
    deposit: { title: "Deposit Refund Actionable in Odisha", content: "MTA 2021 caps new agreement deposits at 2 months. For existing agreements, contractual amount applies. Odisha consumer forums have awarded refund plus 12% interest for unreasonable withholding.", legal_reference: "Odisha House Rent Control Act 1967; MTA 2021 §11; Consumer Protection Act 2019", action: "Send RPAD demand notice. File at District Consumer Forum in Bhubaneswar/Cuttack within 2 years." },
    rent_hike: { title: "Rent Increase Regulated Under Odisha RC Act", content: "The Odisha RC Act allows standard rent determination by Rent Court. Annual revision must follow contractual terms. Hike above standard/contractual rent is void.", legal_reference: "Odisha House Rent Control Act 1967 §5, §9", action: "Apply to Rent Court for standard rent fixation. Continue paying old rent under protest to avoid eviction ground." },
    lockout: { title: "§28 Odisha Act — Criminal Liability for Wrongful Eviction", content: "Section 28 of Odisha RC Act makes unauthorized eviction punishable with imprisonment up to 2 years. Odisha Police are mandated to act on FIRs under this provision.", legal_reference: "Odisha House Rent Control Act 1967 §28; IPC §441", action: "File FIR citing Odisha RC Act §28. Apply to Rent Court for restoration of possession." },
    agreement: { title: "Statutory Rights Override Contrary Agreement Clauses in Odisha", content: "The Odisha RC Act overrides any contractual clause that reduces tenant protection below the statutory minimum. Orissa HC has consistently held this principle since 1970s.", legal_reference: "Odisha House Rent Control Act 1967; Indian Contract Act §23; Orissa HC precedents", action: "Challenge void agreement clauses before Rent Court. Statutory rights apply even without formal agreement." },
    maintenance: { title: "Landlord's Repair Obligation Under Odisha RC Act", content: "The Odisha RC Act and TPA §108(b) impose structural maintenance duties on landlords. Tenants can apply for rent abatement or Rent Court direction for urgent repairs.", legal_reference: "Odisha House Rent Control Act 1967; TPA §108(b)", action: "Give 30-day written repair notice. Apply for rent abatement or mandatory repair direction from Rent Court." },
  },
  "Himachal Pradesh": {
    eviction: { title: "HP Urban Rent Control Act 1987: Mandatory Court Order", content: "The Himachal Pradesh Urban Rent Control Act 1987 governs urban areas (Shimla, Manali, Dharamshala, Solan, etc.). Eviction requires Rent Controller's order on statutory grounds: non-payment of 3+ months, subletting, bona fide need, demolition. §27 imposes criminal penalty for unauthorized eviction.", legal_reference: "HP Urban Rent Control Act 1987 §14, §27; IPC §441", action: "Contest eviction before Rent Controller (Extra AC/DC or Civil Court) in your district within 30 days." },
    deposit: { title: "Deposit Return Under HP RC Act", content: "Landlords in HP must refund deposits within 30 days of vacation with documented deductions. HP consumer forums (Shimla, Dharamshala) are effective for deposit recovery disputes.", legal_reference: "HP Urban Rent Control Act 1987; MTA 2021 §11; Consumer Protection Act 2019", action: "Send RPAD demand notice. File at District Consumer Forum in Shimla or Dharamshala." },
    rent_hike: { title: "Standard Rent Determinable in HP", content: "HP RC Act §5 allows standard rent determination for controlled premises. Any rent above standard rent is irrecoverable. New agreements under MTA 2021 must follow written revision terms.", legal_reference: "HP Urban Rent Control Act 1987 §5, §8; MTA 2021 §7", action: "Apply to Rent Controller for standard rent determination if facing disproportionate hike." },
    lockout: { title: "HP Courts Grant Urgent Lockout Relief", content: "HP Rent Controller and District Courts regularly grant urgent injunctions for tenant lockout cases. §27 of HP RC Act provides criminal remedy. HP HC has intervened in egregious cases.", legal_reference: "HP Urban Rent Control Act 1987 §27; IPC §441", action: "File FIR at local police. Apply to Rent Controller for urgent restoration order. Approach HP HC via urgent writ if needed." },
    agreement: { title: "HP RC Act Overrides Contrary Tenancy Clauses", content: "Any clause in a tenancy agreement that purports to waive rights under the HP RC Act is void. HP courts have struck down such clauses and upheld tenant protections.", legal_reference: "HP Urban Rent Control Act 1987; Indian Contract Act §23", action: "Challenge any clause that waives statutory rights. File before Rent Controller for declaration of void clause." },
    maintenance: { title: "Structural Maintenance Mandatory for HP Landlords", content: "HP RC Act and TPA §108(b) require landlords to maintain structural integrity and essential services. HP's mountain terrain makes structural safety especially critical; courts have enforced strict standards.", legal_reference: "HP Urban Rent Control Act 1987; TPA §108(b)", action: "Send 30-day written notice. File complaint before Rent Controller for mandatory repair direction or rent abatement." },
  },
  "Chandigarh": {
    eviction: { title: "Chandigarh as UT: Punjab Rent Act + Model Tenancy Act Apply", content: "Chandigarh is a Union Territory and follows the Punjab Rent Act 1949 for older controlled buildings and the Model Tenancy Act 2021 for new agreements. Eviction of controlled premises requires Rent Controller's order. UT Chandigarh Rent Authority oversees new tenancy disputes.", legal_reference: "Punjab Rent Act 1949; Model Tenancy Act 2021 §21; IPC §441", action: "File objection before Rent Controller (SDM/Civil Court) in Chandigarh Sector 17 courts within 30 days." },
    deposit: { title: "Deposit: 1 Month Max for Controlled Buildings, 2 Months Under MTA", content: "For regulated buildings, Punjab Rent Act limits advance to 1 month. For new tenancies under MTA 2021, cap is 2 months. Chandigarh Consumer Forum at Sector 17 is very responsive for deposit disputes.", legal_reference: "Punjab Rent Act 1949; MTA 2021 §11; Consumer Protection Act 2019", action: "File consumer complaint at District Consumer Forum, Chandigarh (Sector 17). Courts typically resolve in 3–6 months." },
    rent_hike: { title: "Standard Rent Regulations Apply in Chandigarh UT", content: "For controlled buildings, standard rent under Punjab Rent Act applies. New MTA 2021 agreements must follow written revision terms. Unilateral hike in controlled buildings is void.", legal_reference: "Punjab Rent Act 1949 §5, §9; MTA 2021 §7", action: "Apply to Rent Controller for standard rent fixation. Pay old rent under protest to preserve rights." },
    lockout: { title: "Punjab & Haryana HC: Active Jurisdiction for Chandigarh Lockouts", content: "As Chandigarh is the seat of the Punjab & Haryana High Court, tenants have immediate access to writ jurisdiction for urgent lockout relief. Police must also register FIR under IPC §441.", legal_reference: "Punjab Rent Act 1949; IPC §441; Punjab & Haryana HC jurisdiction", action: "File FIR at Chandigarh Police. If no action, file urgent writ at Punjab & Haryana HC which sits in Chandigarh." },
    agreement: { title: "UT Administration Tenancy Rules in Chandigarh", content: "Chandigarh Estate Office and UT Administration have additional rules for leasing allotted properties. All private tenancy agreements must comply with Punjab Rent Act/MTA provisions.", legal_reference: "Punjab Rent Act 1949; MTA 2021; Chandigarh Estate Rules", action: "Get agreement reviewed before signing. Challenged illegal clauses before Rent Controller or UT Administration." },
    maintenance: { title: "Chandigarh Landlords Must Maintain Municipal Standards", content: "Chandigarh's high municipal standards require landlords to maintain properties to MCCh standards. Tenants can complain to Municipal Corporation of Chandigarh (MCC) and Rent Controller simultaneously.", legal_reference: "Punjab Rent Act 1949; TPA §108(b); MCCh by-laws", action: "File complaint with MCC and send repair notice. Follow up with Rent Controller action if ignored." },
  },
  "Uttarakhand": {
    eviction: { title: "UP Urban Buildings Act (as applicable) + MTA 2021 in Uttarakhand", content: "Uttarakhand follows the UP Urban Buildings (Regulation of Letting, Rent and Eviction) Act 1972 for areas that were part of UP before 2000, supplemented by the Model Tenancy Act 2021. Eviction requires Prescribed Authority's order. Forceful eviction is punishable.", legal_reference: "UP Urban Buildings Act 1972 (as applicable in UK); MTA 2021 §21; IPC §441", action: "Contest eviction before Prescribed Authority (SDM/Collector) in Dehradun/Haridwar/Nainital district." },
    deposit: { title: "Deposit Refund: MTA 2021 Governs New Tenancies in Uttarakhand", content: "For new agreements, MTA 2021 caps deposit at 2 months. Older agreements follow UP Urban Buildings Act §20(2) (max 1 month for regulated buildings). Uttarakhand Consumer Forums are active.", legal_reference: "MTA 2021 §11; UP Urban Buildings Act 1972 §20(2); Consumer Protection Act 2019", action: "File consumer complaint at District Consumer Forum in Dehradun/Haridwar within 2 years of the cause." },
    rent_hike: { title: "Authorised Rent Under UP Act Applies in Uttarakhand", content: "For buildings regulated under UP Urban Buildings Act, authorized rent is determined by Prescribed Authority. For unregulated buildings, MTA 2021 requires written agreement for revision.", legal_reference: "UP Urban Buildings Act 1972 §4, §9; MTA 2021 §7", action: "Apply to Prescribed Authority (SDM) for authorized rent determination in Dehradun/Haridwar." },
    lockout: { title: "§27 UP Act Applies — Criminal Penalty for Wrongful Eviction", content: "UP Urban Buildings Act §27 (applicable in Uttarakhand) makes wrongful eviction punishable with imprisonment up to 3 years. Uttarakhand Police and Uttarakhand HC have upheld this.", legal_reference: "UP Urban Buildings Act 1972 §27; IPC §441; Uttarakhand HC jurisdiction", action: "File FIR at local police citing §27. Apply to Prescribed Authority for restoration. Approach Uttarakhand HC, Nainital for urgent writ." },
    agreement: { title: "Statutory Protections Override Contrary Clauses in Uttarakhand", content: "UP Urban Buildings Act and MTA 2021 provisions override any clause in the tenancy agreement that reduces statutory tenant rights. Uttarakhand HC has consistently upheld this principle.", legal_reference: "UP Urban Buildings Act 1972; MTA 2021; Indian Contract Act §23", action: "Challenge void clauses before Prescribed Authority. Statutory rights operate regardless of agreement content." },
    maintenance: { title: "Maintenance Obligations: UP Act and TPA in Uttarakhand", content: "The UP Urban Buildings Act and TPA §108(b) impose maintenance duties. Uttarakhand's mountainous terrain makes structural safety critical. Courts have awarded damages for monsoon damage from landlord neglect.", legal_reference: "UP Urban Buildings Act 1972; TPA §108(b)", action: "Give 30-day written notice. Apply to Prescribed Authority for mandatory repair direction." },
  },
  "Jharkhand": {
    eviction: { title: "Bihar RC Act 1982 Applies in Jharkhand (Pre-Bifurcation)", content: "Jharkhand, carved from Bihar in 2000, largely follows the Bihar RC Act 1982 for tenancies created before bifurcation. Post-2000 tenancies follow MTA 2021 and general tenancy law (TPA 1882). Eviction in both cases requires court order.", legal_reference: "Bihar Buildings Lease, Rent and Eviction Control Act 1982 (as applicable); MTA 2021 §21; TPA §106", action: "File response before Civil Court (MRC/Munsiff) in Ranchi/Jamshedpur/Dhanbad within 30 days of notice." },
    deposit: { title: "MTA 2021 and Consumer Forum for Deposit Disputes in Jharkhand", content: "MTA 2021 caps new agreement deposits at 2 months. Consumer Forum in Ranchi has been active in deposit recovery disputes. Send notice before filing for cost-effectiveness.", legal_reference: "MTA 2021 §11; Consumer Protection Act 2019; Bihar RC Act 1982", action: "Send RPAD demand notice. File at District Consumer Forum in Ranchi/Jamshedpur within 2 years." },
    rent_hike: { title: "Standard Rent Principles Apply in Jharkhand", content: "Bihar RC Act provisions applicable in Jharkhand allow standard rent determination for older buildings. New tenancies under MTA 2021 require written agreement for revision.", legal_reference: "Bihar RC Act 1982; MTA 2021 §7", action: "Apply to Civil Court for standard rent determination if Bihar RC Act applies to your tenancy." },
    lockout: { title: "IPC §441 and MTA §25 — Full Remedy Available in Jharkhand", content: "The MTA 2021 §25 (applicable to new tenancies) expressly prohibits landlord interference with possession, including lockouts. IPC §441 provides criminal remedy for older tenancies. Jharkhand HC has jurisdiction.", legal_reference: "MTA 2021 §25; IPC §441; Bihar RC Act 1982 §26", action: "File FIR at local police. Apply to Rent Authority or Civil Court for restoration. Approach Jharkhand HC, Ranchi for urgent writ." },
    agreement: { title: "Void Clauses Unenforceable Under Indian Contract Act", content: "Clauses that waive statutory rights or impose unconscionable penalties are void under Indian Contract Act §23. Jharkhand Civil Courts have upheld tenant protections in numerous cases.", legal_reference: "Indian Contract Act 1872 §23; MTA 2021; Bihar RC Act 1982", action: "Challenge void agreement clauses before Civil Court. Document all payments via bank transfer to establish tenancy rights." },
    maintenance: { title: "TPA and MTA Impose Repair Duty in Jharkhand", content: "TPA §108(b) and MTA 2021 §13 both impose maintenance obligations on landlords. Jharkhand courts have awarded rent abatement and compensation for uninhabitable premises.", legal_reference: "TPA §108(b); MTA 2021 §13", action: "Give 30-day written notice. File before Civil Court/Rent Authority for mandatory repair order or rent abatement." },
  },
  "Chhattisgarh": {
    eviction: { title: "MP Accommodation Control Act 1961 Applies in Chhattisgarh", content: "Chhattisgarh, carved from MP in 2000, continues to follow the MP Accommodation Control Act 1961 for urban tenancies. New tenancies additionally covered by MTA 2021. Eviction requires Rent Authority order on statutory grounds.", legal_reference: "MP Accommodation Control Act 1961 §12, §29; MTA 2021 §21", action: "Contest eviction before Rent Authority (Civil Court) in Raipur/Bilaspur/Bhilai within 30 days." },
    deposit: { title: "Deposit Refund Governed by MP Act and MTA in Chhattisgarh", content: "MTA 2021 applies to new agreements, capping deposit at 2 months. Older agreements follow MP provisions. Consumer Forum in Raipur regularly handles deposit disputes.", legal_reference: "MP Accommodation Control Act 1961; MTA 2021 §11; Consumer Protection Act 2019", action: "Send RPAD demand notice. File consumer complaint at District Consumer Forum, Raipur." },
    rent_hike: { title: "Standard Rent Under MP Act Continues in Chhattisgarh", content: "The MP Accommodation Control Act standard rent provisions continue in Chhattisgarh. Unilateral rent hike above standard rent or agreed terms cannot be enforced by eviction.", legal_reference: "MP Accommodation Control Act 1961 §4, §7; MTA 2021 §7", action: "Apply to Rent Authority for standard rent determination. Pay old rent under protest." },
    lockout: { title: "§29 MP Act — Criminal Penalty for Wrongful Eviction in Chhattisgarh", content: "Section 29 of MP Accommodation Control Act 1961 (applicable in CG) makes unauthorized eviction punishable. Chhattisgarh Police and HC in Bilaspur provide effective remedies.", legal_reference: "MP Accommodation Control Act 1961 §29; IPC §441; CG HC jurisdiction", action: "File FIR citing §29 of MP Accommodation Control Act. Apply for urgent injunction at Civil Court in Raipur." },
    agreement: { title: "Statutory Rights Override Agreement in Chhattisgarh", content: "MP Accommodation Control Act and MTA 2021 provisions override contrary agreement clauses. Chhattisgarh HC in Bilaspur has consistently upheld tenant rights.", legal_reference: "MP Accommodation Control Act 1961; MTA 2021; Indian Contract Act §23", action: "Challenge void clauses before Rent Authority. Document payments via bank transfer to establish tenancy." },
    maintenance: { title: "Landlord Must Maintain Premises Under MP Act in Chhattisgarh", content: "TPA §108(b) and MP Accommodation Control Act impose maintenance obligations applicable in Chhattisgarh. Tenants can apply for mandatory repair order from Rent Authority.", legal_reference: "MP Accommodation Control Act 1961; TPA §108(b)", action: "Give 30-day written repair notice. Apply to Rent Authority for mandatory repair order or rent abatement." },
  },
  "Puducherry": {
    eviction: { title: "Puducherry Buildings (Lease and Rent Control) Act 1969", content: "The Puducherry Buildings Lease and Rent Control Act 1969 governs all urban buildings in the UT. Eviction only by Rent Controller's order on grounds: non-payment of 3+ months rent, subletting, personal requirement, or demolition. §23 imposes criminal penalties for unauthorized eviction.", legal_reference: "Puducherry Buildings Lease and Rent Control Act 1969 §10, §23; IPC §441", action: "File objection before Rent Controller (Civil Judge JD) in Puducherry or Karaikal within 30 days of notice." },
    deposit: { title: "Advance Limited to 3 Months Under Puducherry RC Act", content: "The Puducherry RC Act §22 limits rent advance to 3 months. Excess advance is recoverable with interest. Refund must be made within 30 days of vacation. Consumer Forum Puducherry provides quick resolution.", legal_reference: "Puducherry Buildings Lease and Rent Control Act 1969 §22; Consumer Protection Act 2019", action: "Apply to Rent Controller for advance recovery or refund. Alternatively, file at Consumer Forum Puducherry." },
    rent_hike: { title: "Fair Rent Determination by Rent Controller in Puducherry", content: "Puducherry RC Act §5 enables fair rent determination by the Rent Controller. Rent above fair rent is irrecoverable. Annual increase must follow contractual terms or fair rent determination.", legal_reference: "Puducherry Buildings Lease and Rent Control Act 1969 §5, §8", action: "Apply for fair rent fixation at Rent Controller's court. Pay old rent under protest in the interim." },
    lockout: { title: "§23 Puducherry Act — Strong Criminal Sanction for Lockouts", content: "Section 23 of Puducherry RC Act makes unauthorized eviction an offense punishable with imprisonment and fine. Puducherry Police and Madras HC (Puducherry bench) both have jurisdiction.", legal_reference: "Puducherry Buildings Lease and Rent Control Act 1969 §23; IPC §441; Madras HC Pondicherry bench", action: "File FIR at local police citing §23. Apply to Rent Controller for restoration. Approach Madras HC Puducherry bench for urgent writ." },
    agreement: { title: "Puducherry RC Act Overrides Contrary Tenancy Clauses", content: "Any agreement clause that reduces rights below Puducherry RC Act standards is void. Puducherry courts and Madras HC have consistently held this, especially on notice requirements and deposit limits.", legal_reference: "Puducherry Buildings Lease and Rent Control Act 1969; Indian Contract Act §23", action: "Challenge void clauses before Rent Controller. Statutory rights apply even without formal written agreement." },
    maintenance: { title: "Landlord's Maintenance Duty Under Puducherry Act", content: "Puducherry RC Act and TPA §108(b) together impose maintenance obligations. Tenants can apply to Rent Controller for mandatory repair directions. Courts have awarded compensation for monsoon-related damage from landlord neglect.", legal_reference: "Puducherry Buildings Lease and Rent Control Act 1969; TPA §108(b)", action: "Send written repair notice. File application before Rent Controller for mandatory repair direction." },
  },
};


// For states without specific data, fall back to general
function getRightsForStateAndIssue(state: string, issue: string) {
  const stateData = STATE_SPECIFIC_RIGHTS[state];
  if (stateData && stateData[issue]) {
    return stateData[issue]!;
  }
  return GENERAL_RIGHTS[issue];
}

export default function RightsCheckerPage() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const toggleIssue = (id: string) => {
    setSelectedIssues(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const results = selectedState && selectedIssues.length > 0
    ? selectedIssues.map(issueId => ({
        issue: ISSUES.find(i => i.id === issueId)!,
        ...getRightsForStateAndIssue(selectedState, issueId),
      }))
    : [];

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Tenant Rights in ${selectedState}`, text: 'Check your tenant rights on KiraDarbar.', url: window.location.href });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const hasSpecificData = STATE_SPECIFIC_RIGHTS[selectedState] !== undefined;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-dm-sans selection:bg-[#E8602A]/30">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E8602A]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-bold font-syne tracking-tight relative z-10">
          Know your rights as a tenant in India.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-medium relative z-10">
          Select your state and your situation. Get a plain-language summary of exactly what the law says — and what you can do.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-32 space-y-16">

        {/* Step 1: State Selector */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center font-black font-syne text-sm text-[#E8602A]">1</div>
            <h2 className="text-xl font-bold font-syne">Select Your State</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {STATES.map(state => (
              <motion.button
                key={state}
                onClick={() => setSelectedState(state)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{ scale: selectedState === state ? 1.05 : 1 }}
                className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-all ${
                  selectedState === state
                    ? 'bg-[#E8602A] border-[#E8602A] text-white shadow-[0_0_20px_rgba(232,96,42,0.3)] z-10'
                    : selectedState ? 'bg-[#161616] border-white/5 opacity-50' : 'bg-[#1A1A1A] border-white/10 hover:border-white/30'
                }`}
              >
                <Map className={`w-5 h-5 ${selectedState === state ? 'text-white' : 'text-[#E8602A]'}`} />
                <span className="text-xs font-bold leading-tight">{state}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Step 2: Issue Selector */}
        <AnimatePresence>
          {selectedState && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center font-black font-syne text-sm text-[#E8602A]">2</div>
                <h2 className="text-xl font-bold font-syne">What's the issue? <span className="text-sm font-normal text-gray-500">(multi-select)</span></h2>
              </div>

              {hasSpecificData && (
                <div className="flex items-center gap-2 text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 w-fit">
                  <CheckCircle2 className="w-4 h-4" />
                  State-specific laws available for {selectedState}
                </div>
              )}

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {ISSUES.map(issue => {
                  const Icon = issue.icon;
                  const isSelected = selectedIssues.includes(issue.id);
                  return (
                    <motion.button
                      key={issue.id}
                      onClick={() => toggleIssue(issue.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                        isSelected
                          ? 'bg-[#1A1A1A] border-[#E8602A] shadow-[inset_0_0_0_1px_#E8602A]'
                          : 'bg-[#111] border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#E8602A]/20' : 'bg-white/5'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#E8602A]' : 'text-gray-400'}`} />
                      </div>
                      <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-400'}`}>{issue.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 3: Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E8602A] text-white flex items-center justify-center font-black font-syne text-sm shadow-lg">3</div>
                <h2 className="text-xl font-bold font-syne">Your Legal Standing in {selectedState}</h2>
              </div>

              <div className="space-y-6">
                {results.map((right, idx) => {
                  const IssueIcon = right.issue.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white text-gray-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-xl"
                    >
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-2 px-3 py-1 bg-[#E8602A]/10 rounded-full">
                            <IssueIcon className="w-3 h-3 text-[#E8602A]" />
                            <span className="text-[10px] font-bold text-[#E8602A] uppercase tracking-widest">{right.issue.label}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{selectedState}</span>
                          {STATE_SPECIFIC_RIGHTS[selectedState]?.[right.issue.id] ? (
                            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">State-Specific Law</span>
                          ) : (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Central / General Law</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold font-syne tracking-tight">⚖️ {right.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">{right.content}</p>
                        <div className="pt-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded text-xs font-bold text-yellow-800 font-mono">
                            <AlertCircle className="w-3 h-3" />
                            Ref: {right.legal_reference}
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-72 bg-gray-50 rounded-xl p-6 flex flex-col justify-between border border-gray-100">
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recommended Action</div>
                          <p className="text-sm font-medium text-gray-800 mb-6">{right.action}</p>
                        </div>
                        <Link href="/dashboard/cases/new?type=legal_notice">
                          <Button className="w-full bg-[#0F0F0F] text-white hover:bg-gray-800 font-bold h-12 shadow-md hover:shadow-lg transition-all">
                            Send Legal Notice — ₹799
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Share & Email Capture */}
                <div className="grid md:grid-cols-2 gap-6 pt-12">
                  <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#E8602A]/20 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-[#E8602A]" />
                    </div>
                    <h4 className="text-lg font-bold font-syne">Spread the shield</h4>
                    <Button onClick={shareResults} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                      Share with a friend <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#D4A017]/30 rounded-2xl p-8 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Download className="w-5 h-5 text-[#D4A017]" />
                      <h4 className="text-lg font-bold font-syne">Save as PDF</h4>
                    </div>
                    <p className="text-sm text-gray-400">Download a beautifully formatted PDF of your rights directly for your records.</p>
                    <Button 
                      onClick={() => window.print()}
                      className="bg-[#D4A017] hover:bg-[#B8860B] text-black font-bold w-full"
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
