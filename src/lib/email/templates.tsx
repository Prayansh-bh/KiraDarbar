import * as React from 'react';
import { 
  Html, Head, Body, Container, Section, Text, Button, Preview, Tailwind, Hr 
} from '@react-email/components';

const GlobalWrapper = ({ title, children, preview }: { title: string, children: React.ReactNode, preview?: string }) => (
  <Html>
    <Head />
    {preview && <Preview>{preview}</Preview>}
    <Tailwind>
      <Body className="bg-gray-50 my-auto mx-auto font-sans">
        <Container className="border border-gray-200 rounded-lg shadow-sm mx-auto my-[40px] w-[600px] bg-white overflow-hidden p-[20px]">
          <Section className="mb-[24px]">
             <div className="w-full h-[6px] bg-[#E8602A] rounded-t-lg absolute top-0 left-0 right-0" />
             <Text className="text-2xl font-bold font-serif tracking-tight text-[#0F0F0F] mt-4 mb-0 ml-4">
               KiraDarbar
             </Text>
             <Text className="text-sm text-gray-500 font-mono ml-4 mt-1 mb-6 uppercase tracking-wider">Tenant Protection</Text>
             <Hr className="border border-gray-100 my-[20px]" />
          </Section>
          
          <Section className="px-[20px]">
            {children}
          </Section>

          <Section className="px-[20px] mt-[40px] pt-[20px] border-t border-gray-100 text-center">
            <Text className="text-xs text-gray-400 leading-relaxed font-mono">
              KiraDarbar Legal Services | Mumbai, India<br/>
              <span className="underline cursor-pointer text-gray-400">Unsubscribe</span> from these transactional emails.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export const WelcomeEmail = ({ name }: { name: string }) => (
  <GlobalWrapper title="Welcome to KiraDarbar" preview="Welcome to KiraDarbar, India's first tenant protection app.">
    <Text className="text-xl font-bold text-[#0F0F0F] mb-[24px]">Welcome to KiraDarbar, {name} 👋</Text>
    <Text className="text-[16px] text-gray-700 leading-relaxed">
      Your landlord has a lawyer. Now you do too. KiraDarbar was built to level the playing field and stop illegal evictions and lost deposits.
    </Text>
    <div className="bg-orange-50 border border-orange-100 p-[16px] rounded-lg my-[24px]">
       <Text className="text-[14px] text-orange-800 font-bold mb-[8px] uppercase tracking-wide">Quick Start Guide</Text>
       <Text className="text-[14px] text-orange-900 leading-relaxed mb-0">1. Update your profile with your current city.</Text>
       <Text className="text-[14px] text-orange-900 leading-relaxed mb-0">2. Run a Free Rights Check to see local laws.</Text>
       <Text className="text-[14px] text-orange-900 leading-relaxed">3. File a dispute if your rights are being violated.</Text>
    </div>
    <Button href="https://kiradarbar.in/rights" className="bg-[#E8602A] text-white font-bold py-[12px] px-[24px] rounded-md text-[14px]">
      Check My Tenant Rights
    </Button>
  </GlobalWrapper>
);

export const CaseFiledEmail = ({ caseId, pType }: { caseId: string, pType: string }) => (
  <GlobalWrapper title="Your case has been filed" preview={`Case KD-${caseId?.split('-')[0] || ''} successfully logged.`}>
    <div className="text-center mb-[24px]">
      <div className="inline-block w-12 h-12 bg-green-100 rounded-full border border-green-200 leading-[48px] text-center text-green-600 text-xl font-bold mx-auto">✓</div>
    </div>
    <Text className="text-xl font-bold text-[#0F0F0F] text-center mb-[24px]">Checkout Successful</Text>
    <Text className="text-[16px] text-gray-700 leading-relaxed text-center">
      We've successfully received your payment for the <strong>{pType.replace('_', ' ')}</strong> service.
    </Text>
    <div className="bg-gray-50 border border-gray-100 p-[20px] rounded-lg my-[32px] text-center">
       <Text className="text-[12px] text-gray-500 font-mono uppercase tracking-widest mb-[4px]">Reference ID</Text>
       <Text className="text-[24px] font-bold text-[#0F0F0F] font-mono m-0">KD-{caseId?.split('-')[0]?.toUpperCase()}</Text>
    </div>
    <Text className="text-[16px] text-gray-700 leading-relaxed mb-[24px]">
      <strong>What happens next?</strong><br/>
      Our legal team is actively reviewing your uploaded dispute logs. You will receive an assessment within 24 hours. A designated paralegal will reach out directly on your registered mobile number if additional evidence is required.
    </Text>
    <div className="text-center">
      <Button href={`https://kiradarbar.in/dashboard/cases/${caseId}`} className="bg-[#E8602A] text-white font-bold py-[12px] px-[24px] rounded-md text-[14px]">
        Track My Case Live
      </Button>
    </div>
  </GlobalWrapper>
);

export const ShieldWelcomeEmail = ({ name, expiration }: { name: string, expiration: string }) => (
  <GlobalWrapper title="Shield Activted" preview="Your tenant rights are now comprehensively protected.">
    <Text className="text-xl font-bold text-[#0F0F0F] mb-[24px]">You're Protected, {name} 🛡️</Text>
    <Text className="text-[16px] text-gray-700 leading-relaxed">
      Your KiraDarbar <strong>Shield Pro</strong> subscription is officially active. You no longer have to worry about illegal evictions or locked deposits.
    </Text>
    <Text className="text-[16px] text-gray-700 leading-relaxed">
      Your subscription renews automatically on <strong>{new Date(expiration).toLocaleDateString()}</strong>.
    </Text>
    <Button href="https://kiradarbar.in/dashboard" className="bg-[#E8602A] text-white font-bold py-[12px] px-[24px] rounded-md text-[14px] mt-[16px]">
      Access Your Dashboard
    </Button>
  </GlobalWrapper>
);

export const NoticeSentEmail = ({ caseId }: { caseId: string }) => (<GlobalWrapper title="Notice Dispatched" preview="Legal notice dispatched."><Text>Your notice for KD-{caseId?.split('-')[0]} has been dispatched via expedited logistics.</Text></GlobalWrapper>);
export const CaseResolvedEmail = ({ caseId }: { caseId: string }) => (<GlobalWrapper title="Case Closed" preview="Your matter has concluded."><Text>Case KD-{caseId?.split('-')[0]} is successfully closed! Please leave us a review.</Text></GlobalWrapper>);

export const RightsReportEmail = ({ state, issues }: { state: string, issues: string[] }) => (
  <GlobalWrapper title={`Your Tenant Rights in ${state}`} preview={`Legal summary for ${state} regarding ${issues.join(', ')}.`}>
    <Text className="text-xl font-bold text-[#0F0F0F] mb-[24px]">Your Legal Rights Report: {state} ⚖️</Text>
    <Text className="text-[16px] text-gray-700 leading-relaxed mb-[24px]">
      As requested, here is your summary of tenant rights and protections under Indian law for the state of <strong>{state}</strong>.
    </Text>
    
    <div className="bg-gray-50 border border-gray-100 p-[20px] rounded-lg mb-[32px]">
       <Text className="text-[14px] text-gray-800 font-bold mb-[8px] uppercase tracking-wide">Issues Covered</Text>
       <Text className="text-[14px] text-gray-600 leading-relaxed m-0 italic">
         {issues.map(i => i.split('_').join(' ')).join(', ')}
       </Text>
    </div>

    <Text className="text-[16px] text-gray-700 leading-relaxed mb-[24px]">
      <strong>Important:</strong> This report is for informational purposes only. For specific legal advice or to file a formal case, please use the button below to connect with a paralegal.
    </Text>

    <div className="text-center">
      <Button href={`https://kiradarbar.in/rights?state=${encodeURIComponent(state)}`} className="bg-[#E8602A] text-white font-bold py-[12px] px-[24px] rounded-md text-[14px]">
        Full View on KiraDarbar
      </Button>
    </div>
  </GlobalWrapper>
);
