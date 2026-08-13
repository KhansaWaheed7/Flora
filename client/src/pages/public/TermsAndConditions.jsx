import React from "react";
import { Link } from "react-router-dom";
import FloraLogo from "../../components/common/Logo";
import { ArrowLeft, Shield, Calendar, Heart, Activity, Baby, MessageCircle, Apple, BookOpen, FileText, Bot, Award } from "lucide-react";

export default function TermsAndConditions() {
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
              <Shield className="h-3.5 w-3.5" />
              <span>Legal</span>
            </div>
            <h1 
              className="text-4xl font-semibold text-[#2B1620] sm:text-5xl"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Terms &amp; Conditions
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
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                Welcome to <strong>Flora</strong>, a women's gynecological health platform developed to provide health tracking, educational information, risk assessment, pregnancy guidance, medical report analysis, and communication features.
              </p>
              <p className="leading-relaxed mt-4">
                These Terms and Conditions ("Terms") govern your access to and use of the Flora application, website, software, features, and related services (collectively, the "Platform").
              </p>
              <p className="leading-relaxed mt-4">
                By registering for, accessing, or using Flora, you acknowledge that you have read, understood, and agreed to be bound by these Terms and the Flora Privacy Policy. If you do not agree with any part of these Terms, you must discontinue use of the Platform.
              </p>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">2. Nature and Purpose of the Platform</h2>
              <p className="leading-relaxed">
                Flora is designed as a digital health-support and educational platform intended to assist women in managing and understanding aspects of their gynecological and reproductive health.
              </p>
              <p className="leading-relaxed mt-4">The Platform may provide:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Menstrual cycle tracking and predictions;</li>
                <li>PCOS risk assessment using machine-learning techniques;</li>
                <li>Medical report information extraction and summarization;</li>
                <li>Pregnancy and antenatal follow-up guidance;</li>
                <li>Dietary and pregnancy-safe exercise information;</li>
                <li>Gynecological health education;</li>
                <li>A symptom-based Gynae Health Assistant;</li>
                <li>Doctor-patient communication features; and</li>
                <li>Health-related reminders and personalized information.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Flora is intended to support, and not replace, professional medical care.
              </p>
            </section>

            {/* Section 3 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">3. No Medical Diagnosis or Treatment</h2>
              <p className="leading-relaxed">
                Information, predictions, risk scores, recommendations, summaries, alerts, and other outputs generated by Flora are provided for <strong>informational and educational purposes only</strong>.
              </p>
              <p className="leading-relaxed mt-4">
                The AI-based PCOS module does not provide a medical diagnosis. A PCOS risk classification or score indicates patterns that may warrant further medical evaluation and must not be interpreted as confirmation that a user has or does not have PCOS.
              </p>
              <p className="leading-relaxed mt-4">
                Similarly, medical report summaries generated through OCR, text processing, or other automated techniques may contain errors or omissions and must not be considered a substitute for interpretation by a qualified healthcare professional.
              </p>
              <p className="leading-relaxed mt-4">
                Users should consult a licensed and qualified healthcare professional before making decisions concerning diagnosis, treatment, medication, pregnancy, diet, exercise, or any other medical matter.
              </p>
            </section>

            {/* Section 4 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">4. Emergency Medical Situations</h2>
              <p className="leading-relaxed">
                Flora is <strong>not an emergency medical service</strong> and does not provide emergency response or continuous medical monitoring.
              </p>
              <p className="leading-relaxed mt-4">
                If you experience a medical emergency, severe pain, heavy bleeding, difficulty breathing, loss of consciousness, severe pregnancy-related symptoms, or any other potentially life-threatening condition, you should immediately contact appropriate emergency medical services or seek care at the nearest suitable healthcare facility.
              </p>
              <p className="leading-relaxed mt-4">
                Users must not rely on Flora, its AI systems, chat features, notifications, or any other Platform feature during a medical emergency.
              </p>
            </section>

            {/* Section 5 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">5. User Eligibility and Account Registration</h2>
              <p className="leading-relaxed">
                Users must provide accurate and complete information when creating an account.
              </p>
              <p className="leading-relaxed mt-4">You are responsible for:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Maintaining the accuracy of your information;</li>
                <li>Keeping your login credentials confidential;</li>
                <li>Preventing unauthorized access to your account;</li>
                <li>Informing Flora of suspected unauthorized access where applicable; and</li>
                <li>Ensuring that information submitted through the Platform belongs to you or that you have the necessary authorization to provide it.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Users must not impersonate another person or create an account using false or misleading information.
              </p>
            </section>

            {/* Section 6 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">6. User-Provided Health Information</h2>
              <p className="leading-relaxed">
                Flora may allow users to enter or upload sensitive information, including:
              </p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Menstrual history;</li>
                <li>Symptoms;</li>
                <li>Pregnancy information;</li>
                <li>Lifestyle information;</li>
                <li>Medical reports;</li>
                <li>Laboratory results;</li>
                <li>Health measurements;</li>
                <li>Profile information; and</li>
                <li>Information exchanged during doctor-patient communication.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Users are responsible for ensuring that information submitted to the Platform is accurate to the best of their knowledge.
              </p>
              <p className="leading-relaxed mt-4">
                Incorrect, incomplete, outdated, or misleading information may result in inaccurate predictions, recommendations, risk assessments, or summaries.
              </p>
            </section>

            {/* Section 7 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">7. AI-Based Features</h2>
              <p className="leading-relaxed">
                Flora may use artificial intelligence and machine-learning technologies to support certain features.
              </p>
              <p className="leading-relaxed mt-4">AI-generated outputs may include:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>PCOS risk assessments;</li>
                <li>Medical report summaries;</li>
                <li>Symptom-based guidance;</li>
                <li>Personalized educational information; and</li>
                <li>Other health-related insights.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                AI-generated information may not always be accurate, complete, or clinically appropriate for an individual user.
              </p>
              <p className="leading-relaxed mt-4">
                Flora does not guarantee that AI-generated outputs will identify every medical condition, symptom, abnormality, or health risk.
              </p>
              <p className="leading-relaxed mt-4">
                Users must not rely solely on AI-generated information when making healthcare decisions.
              </p>
            </section>

            {/* Section 8 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">8. Menstrual Cycle Predictions</h2>
              <p className="leading-relaxed">
                Menstrual and ovulation predictions provided by Flora are estimates generated using information supplied by the user and applicable calculation methods.
              </p>
              <p className="leading-relaxed mt-4">
                Actual menstrual cycles and ovulation dates may vary due to numerous biological, hormonal, lifestyle, medical, and environmental factors.
              </p>
              <p className="leading-relaxed mt-4">
                Flora therefore does not guarantee the accuracy of predicted period dates, ovulation dates, fertile windows, or cycle irregularity assessments.
              </p>
              <p className="leading-relaxed mt-4">
                Cycle predictions must not be used as a sole method of contraception or for making critical medical decisions.
              </p>
            </section>

            {/* Section 9 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">9. Pregnancy and Antenatal Guidance</h2>
              <p className="leading-relaxed">
                Pregnancy-related information provided by Flora is intended for general educational and supportive purposes.
              </p>
              <p className="leading-relaxed mt-4">
                Pregnancy guidance, reminders, dietary information, exercise recommendations, and developmental information do not replace antenatal care provided by a qualified healthcare professional.
              </p>
              <p className="leading-relaxed mt-4">
                Pregnancy dates, trimester classifications, reminders, and recommendations may depend on information entered by the user and may therefore be inaccurate if the underlying information is incorrect.
              </p>
              <p className="leading-relaxed mt-4">
                Users should follow the advice of their healthcare provider regarding pregnancy care, testing, medication, nutrition, exercise, and treatment.
              </p>
            </section>

            {/* Section 10 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">10. Dietary and Exercise Information</h2>
              <p className="leading-relaxed">
                Flora may provide general dietary recommendations, nutrient information, and pregnancy-safe exercise guidance.
              </p>
              <p className="leading-relaxed mt-4">
                Such information does not constitute individualized medical, nutritional, or physiotherapy advice.
              </p>
              <p className="leading-relaxed mt-4">
                Users with medical conditions, pregnancy complications, physical limitations, or other health concerns should obtain professional advice before beginning a new diet or exercise routine.
              </p>
            </section>

            {/* Section 11 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">11. Doctor-Patient Communication</h2>
              <p className="leading-relaxed">
                Where available, Flora may provide communication functionality between users and registered healthcare professionals.
              </p>
              <p className="leading-relaxed mt-4">Flora does not guarantee:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>The immediate availability of a doctor;</li>
                <li>A response within a particular period;</li>
                <li>The accuracy or completeness of information provided by a healthcare professional; or</li>
                <li>A particular medical outcome resulting from a consultation.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                The doctor or healthcare professional remains responsible for professional medical advice provided through the Platform.
              </p>
              <p className="leading-relaxed mt-4">
                Users should verify the identity and professional credentials of a healthcare provider where appropriate.
              </p>
            </section>

            {/* Section 12 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">12. Medical Reports</h2>
              <p className="leading-relaxed">
                Users may upload medical reports in supported formats.
              </p>
              <p className="leading-relaxed mt-4">
                Automated extraction and analysis may be affected by:
              </p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Poor image quality;</li>
                <li>Handwritten information;</li>
                <li>Scanning errors;</li>
                <li>Formatting;</li>
                <li>Missing information;</li>
                <li>Unrecognized medical terminology; or</li>
                <li>Technical limitations of OCR and language-processing systems.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Flora does not guarantee that every value or medical finding will be accurately extracted or interpreted.
              </p>
              <p className="leading-relaxed mt-4">
                Original medical reports should always be reviewed by a qualified healthcare professional.
              </p>
            </section>

            {/* Section 13 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">13. Health Education and Third-Party Content</h2>
              <p className="leading-relaxed">
                Flora may provide articles, educational resources, FAQs, videos, references, or links to third-party websites and services.
              </p>
              <p className="leading-relaxed mt-4">
                Such resources are provided for educational purposes. Flora does not necessarily endorse or guarantee the accuracy, availability, safety, or completeness of third-party content.
              </p>
              <p className="leading-relaxed mt-4">
                Users access third-party websites or services at their own risk and are subject to the terms and policies of those third parties.
              </p>
            </section>

            {/* Section 14 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">14. Acceptable Use</h2>
              <p className="leading-relaxed">Users agree not to:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Use Flora for unlawful purposes;</li>
                <li>Attempt to gain unauthorized access to accounts, systems, or data;</li>
                <li>Interfere with the operation or security of the Platform;</li>
                <li>Upload malicious software or harmful content;</li>
                <li>Attempt to reverse engineer or exploit the Platform;</li>
                <li>Impersonate another person;</li>
                <li>Use another user's account without authorization;</li>
                <li>Abuse, harass, threaten, or harm healthcare professionals or other users;</li>
                <li>Misuse doctor-patient communication features; or</li>
                <li>Attempt to obtain confidential information belonging to another user.</li>
              </ul>
            </section>

            {/* Section 15 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">15. Intellectual Property</h2>
              <p className="leading-relaxed">
                Unless otherwise stated, Flora and its associated software, interface, design, branding, graphics, text, databases, algorithms, and other original materials are protected by applicable intellectual property laws.
              </p>
              <p className="leading-relaxed mt-4">
                Users are granted a limited, non-exclusive, non-transferable right to use the Platform for its intended purposes.
              </p>
              <p className="leading-relaxed mt-4">
                Users may not copy, reproduce, modify, distribute, sell, reverse engineer, or commercially exploit Flora or its proprietary components without appropriate authorization.
              </p>
            </section>

            {/* Section 16 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">16. Privacy</h2>
              <p className="leading-relaxed">
                Flora takes the privacy and security of user information seriously.
              </p>
              <p className="leading-relaxed mt-4">
                The collection, use, storage, processing, disclosure, and protection of personal and health-related information are governed by the <strong>Flora Privacy Policy</strong>, which forms part of these Terms.
              </p>
              <p className="leading-relaxed mt-4">
                By using Flora, you acknowledge that your information may be processed in accordance with that Privacy Policy.
              </p>
            </section>

            {/* Section 17 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">17. Security</h2>
              <p className="leading-relaxed">
                Flora implements reasonable technical and organizational safeguards designed to protect user information from unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="leading-relaxed mt-4">
                However, no internet-based platform or electronic storage system can be guaranteed to be completely secure.
              </p>
              <p className="leading-relaxed mt-4">
                Users acknowledge that transmission of information over the internet involves inherent security risks.
              </p>
            </section>

            {/* Section 18 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">18. Service Availability</h2>
              <p className="leading-relaxed">
                Flora may occasionally be unavailable due to:
              </p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Maintenance;</li>
                <li>Software updates;</li>
                <li>Technical failures;</li>
                <li>Internet or network problems;</li>
                <li>Third-party service interruptions;</li>
                <li>Security incidents; or</li>
                <li>Circumstances beyond reasonable control.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Flora does not guarantee uninterrupted or error-free operation of the Platform.
              </p>
            </section>

            {/* Section 19 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">19. Account Suspension and Termination</h2>
              <p className="leading-relaxed">
                Flora reserves the right, subject to applicable law and appropriate procedures, to suspend or terminate an account where there is reasonable evidence of:
              </p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Violation of these Terms;</li>
                <li>Unauthorized or fraudulent use;</li>
                <li>Abuse of other users or healthcare professionals;</li>
                <li>Attempts to compromise Platform security; or</li>
                <li>Other conduct that may harm the Platform or its users.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Users may discontinue use of Flora at any time.
              </p>
            </section>

            {/* Section 20 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">20. Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by applicable law, Flora and its developers, project members, supervisors, and affiliated parties shall not be responsible for losses or damages arising from:
              </p>
              <ul className="space-y-2 list-disc pl-5 mt-2 leading-relaxed">
                <li>Reliance on AI-generated health information;</li>
                <li>Incorrect predictions or risk assessments;</li>
                <li>Errors in automated medical report analysis;</li>
                <li>Delayed or unavailable doctor responses;</li>
                <li>User-provided inaccurate information;</li>
                <li>Interruptions or technical failures;</li>
                <li>Unauthorized access resulting from circumstances beyond reasonable control; or</li>
                <li>Decisions made solely on the basis of information provided by the Platform.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Nothing in these Terms is intended to exclude liability that cannot legally be excluded under applicable law.
              </p>
            </section>

            {/* Section 21 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">21. Changes to the Platform and Terms</h2>
              <p className="leading-relaxed">
                Flora may modify, update, suspend, or discontinue features of the Platform as necessary for development, maintenance, security, or improvement.
              </p>
              <p className="leading-relaxed mt-4">
                These Terms may also be updated from time to time. Updated Terms will be communicated through appropriate means where reasonably practicable.
              </p>
              <p className="leading-relaxed mt-4">
                Continued use of Flora after an update constitutes acceptance of the revised Terms.
              </p>
            </section>

            {/* Section 22 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">22. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms shall be interpreted and governed in accordance with the applicable laws of the <strong>Islamic Republic of Pakistan</strong>, subject to the jurisdiction of the competent courts where applicable.
              </p>
            </section>

            {/* Section 23 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">23. Severability</h2>
              <p className="leading-relaxed">
                If any provision of these Terms is determined to be invalid or unenforceable, the remaining provisions shall continue to remain in full force and effect to the extent permitted by law.
              </p>
            </section>

            {/* Section 24 */}
            <section className="bg-white rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">24. Entire Agreement</h2>
              <p className="leading-relaxed">
                These Terms, together with the Flora Privacy Policy and any additional terms presented for specific Platform features, constitute the agreement governing the user's use of Flora.
              </p>
            </section>

            {/* Section 25 */}
            <section className="bg-[#FFF5F7] rounded-2xl p-8 ring-1 ring-[#FBE4EC]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4">25. Contact</h2>
              <p className="leading-relaxed">
                For questions, concerns, privacy requests, or complaints regarding Flora or these Terms, users may contact the Flora project team through the contact information provided within the Platform.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>Flora</strong></p>
                <p>Women's Gynecological Health Platform</p>
                <p>Air University Islamabad</p>
                <p>Pakistan</p>
              </div>
            </section>

            {/* Important Notice */}
            <section className="bg-gradient-to-r from-[#EB6991]/10 to-[#F33B7D]/10 rounded-2xl p-8 ring-1 ring-[#FBE4EC] border-l-4 border-[#EB6991]">
              <h2 className="text-xl font-semibold text-[#2B1620] mb-4 flex items-center gap-2">
                <span className="text-[#EB6991]"></span> Important Notice
              </h2>
              <p className="leading-relaxed text-[#5B4650]">
                Flora is an <strong>academic Final Year Project</strong> and is intended as a health-support and educational platform. 
                It is <strong>not a substitute</strong> for professional medical diagnosis, treatment, or emergency medical services.
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

      {/* Footer */}
      <footer className="border-t border-[#F7DCE4] bg-gradient-to-b from-[#FFF5F7] to-[#FEF6F6]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-[#8A7B8F] sm:flex-row">
            <p>© 2026 Flora. All rights reserved.</p>
            <p>Made with ❤ for women everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}