import React from "react";
import { Link } from "react-router-dom";
import FloraLogo from "../../components/common/Logo";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe, Mail, Phone, MapPin, FileText, Heart, Activity, Baby, MessageCircle, Apple, BookOpen, Sparkles } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#2B1620] antialiased">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#ffcfdf] bg-[#FFF5F7]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <FloraLogo />
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full bg-[#EB6991] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(235,105,145,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(235,105,145,0.6)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EB6991]/10 text-[#EB6991] text-sm font-medium mb-4">
              <Lock className="h-3.5 w-3.5" />
              <span>Privacy</span>
            </div>
            <h1 
              className="text-4xl font-semibold text-[#2B1620] sm:text-5xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Privacy Policy
            </h1>
            <p className="mt-2 text-[#5B4650]">
              <strong>Effective Date:</strong> August 12, 2026
            </p>
            <p className="text-[#5B4650]">
              <strong>Last Updated:</strong> August 12, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-[#5B4650]">
            {/* Section 1 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#EB6991]" />
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                Flora ("Flora," "we," "us," or "our") is a women's gynecological health platform developed as an academic Final Year Project at Air University Islamabad.
              </p>
              <p className="leading-relaxed mt-4">
                This Privacy Policy explains how Flora collects, uses, stores, processes, protects, and may disclose information when users access or use the Flora application, website, and related services (collectively, the "Platform").
              </p>
              <p className="leading-relaxed mt-4">
                Because Flora may process sensitive health and reproductive information, privacy and security are fundamental considerations in the design and operation of the Platform.
              </p>
              <p className="leading-relaxed mt-4">
                By using Flora, you acknowledge the practices described in this Privacy Policy.
              </p>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-[#EB6991]" />
                2. Information We Collect
              </h2>
              <p className="leading-relaxed">
                Depending on the features used, Flora may collect the following categories of information.
              </p>
              
              <p className="leading-relaxed font-medium text-[#2B1620] mt-4">2.1 Account and Identity Information</p>
              <p className="leading-relaxed">This may include:</p>
              <ul className="space-y-1 list-disc pl-5 mt-2 leading-relaxed">
                <li>Name;</li>
                <li>Email address;</li>
                <li>Password in protected form;</li>
                <li>Date of birth;</li>
                <li>Gender;</li>
                <li>Contact information;</li>
                <li>Location or general demographic information; and</li>
                <li>Account role.</li>
              </ul>

              <p className="leading-relaxed font-medium text-[#2B1620] mt-4">2.2 Health and Gynecological Information</p>
              <p className="leading-relaxed">Users may voluntarily provide information including:</p>
              <ul className="space-y-1 list-disc pl-5 mt-2 leading-relaxed">
                <li>Menstrual cycle history;</li>
                <li>Period duration;</li>
                <li>Cycle symptoms;</li>
                <li>Pregnancy information;</li>
                <li>Pregnancy dates and gestational information;</li>
                <li>PCOS-related symptoms;</li>
                <li>Lifestyle information;</li>
                <li>Height and weight;</li>
                <li>BMI-related information;</li>
                <li>Dietary information;</li>
                <li>Exercise information;</li>
                <li>Blood group; and</li>
                <li>Other health information entered through relevant Platform features.</li>
              </ul>

              <p className="leading-relaxed font-medium text-[#2B1620] mt-4">2.3 Medical Reports</p>
              <p className="leading-relaxed">Where the Medical Report Analyzer is used, users may upload:</p>
              <ul className="space-y-1 list-disc pl-5 mt-2 leading-relaxed">
                <li>Medical reports;</li>
                <li>Laboratory reports;</li>
                <li>Images of medical documents;</li>
                <li>PDF documents; and</li>
                <li>Other supported medical information.</li>
              </ul>
              <p className="leading-relaxed mt-2">Such information may contain highly sensitive personal and health data.</p>

              <p className="leading-relaxed font-medium text-[#2B1620] mt-4">2.4 Doctor-Patient Communications</p>
              <p className="leading-relaxed">Where applicable, Flora may process information contained within doctor-patient communications, including:</p>
              <ul className="space-y-1 list-disc pl-5 mt-2 leading-relaxed">
                <li>Messages;</li>
                <li>Consultation requests;</li>
                <li>Conversation history;</li>
                <li>Relevant timestamps; and</li>
                <li>Information exchanged during consultations.</li>
              </ul>

              <p className="leading-relaxed font-medium text-[#2B1620] mt-4">2.5 Technical Information</p>
              <p className="leading-relaxed">The Platform may collect limited technical information necessary for operation, security, and troubleshooting, such as:</p>
              <ul className="space-y-1 list-disc pl-5 mt-2 leading-relaxed">
                <li>Device information;</li>
                <li>Browser or application information;</li>
                <li>IP address;</li>
                <li>Login information;</li>
                <li>Authentication information;</li>
                <li>System logs; and</li>
                <li>Technical error information.</li>
              </ul>
              <p className="leading-relaxed mt-2 text-sm italic">
                The exact technical information collected depends on the Platform's implementation and configuration.
              </p>
            </section>

            {/* Section 3 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#EB6991]" />
                3. How We Use Information
              </h2>
              <p className="leading-relaxed">Flora may use collected information to:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Create and manage user accounts;</li>
                <li>Authenticate users;</li>
                <li>Apply role-based access controls;</li>
                <li>Provide menstrual cycle tracking and predictions;</li>
                <li>Perform PCOS risk assessments;</li>
                <li>Analyze uploaded medical reports;</li>
                <li>Provide pregnancy and antenatal guidance;</li>
                <li>Generate reminders;</li>
                <li>Provide dietary and exercise information;</li>
                <li>Facilitate doctor-patient communication;</li>
                <li>Provide symptom-based health guidance;</li>
                <li>Deliver health education;</li>
                <li>Provide English and Urdu localization;</li>
                <li>Improve Platform functionality and security;</li>
                <li>Detect unauthorized or potentially harmful activity;</li>
                <li>Maintain technical logs; and</li>
                <li>Fulfill legitimate operational and academic project requirements.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Flora will not intentionally use sensitive health information for purposes unrelated to the operation and documented objectives of the Platform without appropriate authorization or consent, where required.
              </p>
            </section>

            {/* Section 4 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#EB6991]" />
                4. AI and Automated Processing
              </h2>
              <p className="leading-relaxed">
                Certain Flora features may process information using machine-learning, OCR, NLP, or other automated technologies.
              </p>
              <p className="leading-relaxed mt-4">This may include:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>PCOS risk assessment;</li>
                <li>Medical report information extraction;</li>
                <li>Medical report summarization;</li>
                <li>Symptom classification;</li>
                <li>Personalized health information; and</li>
                <li>Other automated health-related outputs.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Automated processing may produce inaccurate, incomplete, or inappropriate results.
              </p>
              <p className="leading-relaxed mt-4">
                AI-generated results are therefore treated as <strong>decision-support and educational information rather than medical diagnoses</strong>.
              </p>
              <p className="leading-relaxed mt-4">
                Users should not make significant healthcare decisions solely on the basis of automated results.
              </p>
            </section>

            {/* Section 5 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#EB6991]" />
                5. Medical Report Processing
              </h2>
              <p className="leading-relaxed">
                When a user uploads a medical report, Flora may process the document to extract relevant information and provide a simplified summary.
              </p>
              <p className="leading-relaxed mt-4">
                The processing may involve OCR and natural language processing technologies.
              </p>
              <p className="leading-relaxed mt-4">
                Flora takes reasonable measures to restrict access to uploaded medical information to authorized users and systems.
              </p>
              <p className="leading-relaxed mt-4">
                However, automated processing may fail to identify information correctly. Users should retain their original reports and consult qualified healthcare professionals for clinical interpretation.
              </p>
            </section>

            {/* Section 6 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#EB6991]" />
                6. Doctor-Patient Information Sharing
              </h2>
              <p className="leading-relaxed">
                Flora may facilitate sharing of relevant user health information with an authorized healthcare professional when the Platform's functionality and the user's permissions or consent allow such access.
              </p>
              <p className="leading-relaxed mt-4">
                Access should be limited according to applicable role-based permissions and consent mechanisms.
              </p>
              <p className="leading-relaxed mt-4">
                Doctors should only access information necessary for legitimate healthcare-related interaction through the Platform.
              </p>
              <p className="leading-relaxed mt-4">
                Users should not share information belonging to another person without appropriate authorization.
              </p>
            </section>

            {/* Section 7 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#EB6991]" />
                7. Consent
              </h2>
              <p className="leading-relaxed">
                Where appropriate, Flora may request user consent before collecting, processing, or sharing sensitive information.
              </p>
              <p className="leading-relaxed mt-4">
                Users may choose not to provide optional information. However, certain features may not function properly without the information required for those features.
              </p>
              <p className="leading-relaxed mt-4">
                Users should understand the purpose of a feature and the information required before submitting sensitive health data.
              </p>
            </section>

            {/* Section 8 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-[#EB6991]" />
                8. Data Storage
              </h2>
              <p className="leading-relaxed">
                Flora may store account information, health information, medical reports, chat records, and other necessary information in databases or storage systems used by the Platform.
              </p>
              <p className="leading-relaxed mt-4">
                Reasonable safeguards are implemented to protect stored information against unauthorized access, modification, disclosure, or destruction.
              </p>
              <p className="leading-relaxed mt-4">
                The retention period for information depends on the type of information, the purpose for which it was collected, technical requirements, and applicable obligations.
              </p>
            </section>

            {/* Section 9 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#EB6991]" />
                9. Data Security
              </h2>
              <p className="leading-relaxed">
                Flora is designed using security practices appropriate to an academic health-technology project, including where applicable:
              </p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Authentication;</li>
                <li>Password hashing;</li>
                <li>JWT-based authorization;</li>
                <li>Role-Based Access Control;</li>
                <li>Protected API endpoints;</li>
                <li>Secure communication through HTTPS where deployed;</li>
                <li>Restricted access to sensitive information;</li>
                <li>Secure environment-variable management;</li>
                <li>Audit and security logging where implemented; and</li>
                <li>Database security controls.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                No electronic system can guarantee absolute security. Users acknowledge that security risks exist whenever information is transmitted or stored electronically.
              </p>
            </section>

            {/* Section 10 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#EB6991]" />
                10. Password and Account Security
              </h2>
              <p className="leading-relaxed">
                User passwords should be stored using secure password-hashing mechanisms and should not be stored in plain text.
              </p>
              <p className="leading-relaxed mt-4">
                Users are responsible for maintaining the confidentiality of their passwords and authentication credentials.
              </p>
              <p className="leading-relaxed mt-4">
                If a user believes that their account has been compromised, they should change their credentials and notify the Platform administrators where appropriate.
              </p>
            </section>

            {/* Section 11 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#EB6991]" />
                11. Data Sharing and Disclosure
              </h2>
              <p className="leading-relaxed">
                Flora does not intend to sell users' personal or health information.
              </p>
              <p className="leading-relaxed mt-4">Information may be disclosed where necessary:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>To provide requested Platform functionality;</li>
                <li>To authorized doctors or healthcare professionals where permitted;</li>
                <li>To authorized administrators for legitimate administrative purposes;</li>
                <li>To service providers necessary for Platform operation;</li>
                <li>To maintain Platform security and integrity;</li>
                <li>When required by applicable law or lawful legal process; or</li>
                <li>With the user's authorization or consent.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Access to sensitive information should be limited to individuals or systems with a legitimate need for access.
              </p>
            </section>

            {/* Section 12 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#EB6991]" />
                12. Third-Party Services
              </h2>
              <p className="leading-relaxed">
                Flora may rely on third-party technologies or services for certain functions, such as hosting, authentication, email delivery, storage, analytics, communication, or other technical services.
              </p>
              <p className="leading-relaxed mt-4">
                Where third-party services process information, their handling of data may also be subject to their own privacy policies and terms.
              </p>
              <p className="leading-relaxed mt-4">
                Flora aims to use third-party services in a manner consistent with the security and privacy objectives of the Platform.
              </p>
            </section>

            {/* Section 13 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">13. Cookies and Similar Technologies</h2>
              <p className="leading-relaxed">
                The Platform may use cookies, tokens, local storage, or similar technologies to maintain authentication sessions, remember user preferences, support security, and provide essential functionality.
              </p>
              <p className="leading-relaxed mt-4">
                Authentication tokens and similar technical information should be handled securely and should not be intentionally exposed to unauthorized parties.
              </p>
            </section>

            {/* Section 14 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-[#EB6991]" />
                14. Data Retention
              </h2>
              <p className="leading-relaxed">
                Flora retains information only for as long as reasonably necessary to provide the relevant service, maintain security, fulfill legitimate project or operational requirements, or comply with applicable legal obligations.
              </p>
              <p className="leading-relaxed mt-4">
                When information is no longer required, reasonable measures may be taken to delete, anonymize, or securely dispose of it.
              </p>
              <p className="leading-relaxed mt-4">
                Because Flora is an academic project, retention periods may also depend on project-development, testing, evaluation, and demonstration requirements.
              </p>
            </section>

            {/* Section 15 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#EB6991]" />
                15. User Rights and Choices
              </h2>
              <p className="leading-relaxed">
                Subject to applicable law and the technical capabilities of the Platform, users may have the right to:
              </p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Access information associated with their account;</li>
                <li>Request correction of inaccurate information;</li>
                <li>Request deletion of their account or information;</li>
                <li>Withdraw consent where processing is based on consent;</li>
                <li>Request information regarding how their data is processed; and</li>
                <li>Raise concerns regarding privacy or unauthorized use of their information.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Some information may need to be retained where technically necessary, required for legitimate purposes, or required by applicable law.
              </p>
            </section>

            {/* Section 16 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Baby className="h-5 w-5 text-[#EB6991]" />
                16. Children's Privacy
              </h2>
              <p className="leading-relaxed">
                Flora is intended for users who are legally permitted to use the Platform.
              </p>
              <p className="leading-relaxed mt-4">
                Flora is not specifically designed to knowingly collect sensitive health information from children without appropriate authorization or safeguards.
              </p>
              <p className="leading-relaxed mt-4">
                If information belonging to a child has been submitted without appropriate authorization, a parent or legal guardian may contact the Platform team to request appropriate action.
              </p>
            </section>

            {/* Section 17 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#EB6991]" />
                17. International and Local Privacy Considerations
              </h2>
              <p className="leading-relaxed">
                Flora is designed primarily for the Pakistani context and adopts privacy and security principles appropriate to a digital health platform.
              </p>
              <p className="leading-relaxed mt-4">
                Although Flora follows <strong>HIPAA-inspired privacy and security practices</strong>, Flora is an academic project and should <strong>not be represented as HIPAA-certified or HIPAA-compliant</strong> unless it has independently undergone the legal, administrative, technical, and contractual requirements necessary for such compliance.
              </p>
              <p className="leading-relaxed mt-4">
                Where applicable, Flora will seek to operate in accordance with relevant laws and regulations governing personal information and electronic services.
              </p>
            </section>

            {/* Section 18 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#EB6991]" />
                18. Data Breach and Security Incidents
              </h2>
              <p className="leading-relaxed">
                If Flora becomes aware of a security incident affecting user information, reasonable measures will be taken to investigate, contain, and address the incident.
              </p>
              <p className="leading-relaxed mt-4">
                Where notification is required by applicable law or institutional policy, appropriate affected parties may be notified.
              </p>
              <p className="leading-relaxed mt-4">
                Users should understand that no online service can guarantee that a security incident will never occur.
              </p>
            </section>

            {/* Section 19 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#EB6991]" />
                19. Privacy of Doctor-Patient Communication
              </h2>
              <p className="leading-relaxed">
                Doctor-patient communications are intended to be private and accessible only to authorized participants and systems.
              </p>
              <p className="leading-relaxed mt-4">
                Users should nevertheless avoid unnecessarily sharing passwords, financial information, authentication credentials, or other information unrelated to their healthcare discussion.
              </p>
              <p className="leading-relaxed mt-4">
                Flora does not guarantee that communication will be continuously available or that every message will be delivered immediately.
              </p>
            </section>

            {/* Section 20 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">20. User Responsibility</h2>
              <p className="leading-relaxed">Users are responsible for:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Providing accurate information;</li>
                <li>Using the Platform lawfully;</li>
                <li>Protecting their account credentials;</li>
                <li>Reviewing information before relying upon it;</li>
                <li>Seeking professional medical care where necessary; and</li>
                <li>Not uploading information belonging to another person without appropriate authorization.</li>
              </ul>
            </section>

            {/* Section 21 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">21. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                This Privacy Policy may be updated periodically to reflect changes in Platform functionality, security practices, legal requirements, or project development.
              </p>
              <p className="leading-relaxed mt-4">
                The updated version will include a revised "Last Updated" date.
              </p>
              <p className="leading-relaxed mt-4">
                Users are encouraged to review the Privacy Policy periodically.
              </p>
            </section>

            {/* Section 22 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#EB6991]" />
                22. Contact Us
              </h2>
              <p className="leading-relaxed">
                Questions, concerns, requests, or complaints regarding privacy and personal information may be directed to the Flora project team through the contact information provided within the Platform.
              </p>
              <div className="mt-4 space-y-2 text-sm bg-white/50 p-4 rounded-xl ring-1 ring-[#FBE4EC]">
                <p><strong>Flora</strong></p>
                <p>Women's Gynecological Health Platform</p>
                <p>Air University Islamabad</p>
                <p>Pakistan</p>
              </div>
            </section>

            {/* Section 23 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#EB6991]" />
                23. Academic Project Disclaimer
              </h2>
              <p className="leading-relaxed">
                Flora is developed as a <strong>Final Year Project for academic purposes at Air University Islamabad</strong>.
              </p>
              <p className="leading-relaxed mt-4">
                The Platform demonstrates the practical application of software engineering, artificial intelligence, machine learning, health informatics, and secure system design concepts.
              </p>
              <p className="leading-relaxed mt-4">
                Unless expressly stated otherwise, Flora should not be interpreted as a licensed medical service, hospital, clinical diagnostic system, emergency healthcare provider, or replacement for professional medical care.
              </p>
            </section>

            {/* Important Notice */}
            <section className="bg-gradient-to-r from-[#EB6991]/10 to-[#F33B7D]/10 rounded-2xl p-8 ring-1 ring-[#FBE4EC] border-l-4 border-[#EB6991]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#EB6991] fill-current" />
                Acknowledgment
              </h2>
              <p className="leading-relaxed text-[#5B4650]">
                <strong>By using Flora, users acknowledge and accept the practices and limitations described in this Privacy Policy.</strong>
              </p>
            </section>
          </div>

          {/* Back to Top */}
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#EB6991] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(235,105,145,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(235,105,145,0.6)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Flora
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}