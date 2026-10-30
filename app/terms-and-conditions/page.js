import React from "react";
import Header from "../components/Header";

const TermsAndConds = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen flex justify-center py-10 px-4">
        <div className="w-full p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            Terms & Conditions
          </h1>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                1. Use of the Service
              </h2>
              <p>
                By using our platform, you agree not to engage in any misuse,
                share inappropriate content, or participate in any illegal
                activities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                2. Account and Security
              </h2>
              <p>
                You are responsible for maintaining the security of your
                account. If your password is compromised or unauthorized access
                occurs, you must notify us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                3. User-Generated Content
              </h2>
              <p>
                You are fully responsible for any MCQs or exams you create.
                Creating content that violates copyright, contains false
                information, or is offensive is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                4. Platform Changes
              </h2>
              <p>
                We reserve the right to modify our services, features, or these
                Terms & Conditions at any time. Any changes will be updated on
                this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                5. Account Termination
              </h2>
              <p>
                If you violate our policies, we reserve the right to suspend or
                terminate your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                6. Limitation of Liability
              </h2>
              <p>
                We are not responsible for any damages, data loss, or technical
                issues resulting from the use of this platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                7. Contact Information
              </h2>
              <p>
                If you have any questions or concerns, please email us at:
                📧 <strong>your-email@example.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConds;