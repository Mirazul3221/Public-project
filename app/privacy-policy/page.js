import React from "react";
import Header from "../components/Header";

export const metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy explains how we handle your data.",
};

export default function PrivacyPolicy() {
  return (
    <main>
      <Header />
      <div className="min-h-screen flex justify-center py-10 px-4">
        <div className="w-full p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            Privacy Policy
          </h1>

          <p className="text-gray-600 text-sm mb-8 text-center">
            Last Updated: 12-12-2025
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                1. Information We Collect
              </h2>
              <p>We may collect the following information:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>
                  Name, email address, and profile picture (when using
                  Facebook/Google login)
                </li>
                <li>
                  MCQ creation activity, exam participation, and exam results
                </li>
                <li>
                  Device information such as IP address, browser type, and
                  cookies
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>To create and manage user accounts</li>
                <li>To display exam results and performance</li>
                <li>To improve our services and user experience</li>
                <li>To prevent misuse and fraud</li>
                <li>To send important notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                3. Information Sharing
              </h2>
              <p>
                We do not sell or share your personal data with third parties.
                Data may only be shared when legally required, or with trusted
                service providers such as hosting services (Vercel, MongoDB
                Atlas) and analytics tools.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                4. Children’s Privacy
              </h2>
              <p>
                We do not knowingly collect data from children under the age of
                13. If such data is collected unintentionally, it will be
                deleted upon request.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                5. Data Security
              </h2>
              <p>
                We use HTTPS, secure databases, and modern security practices to
                protect your data. However, no internet-based system can be
                guaranteed to be 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Cookies</h2>
              <p>
                We use cookies to maintain login sessions, store user
                preferences, and collect analytics data. You may disable cookies
                through your browser settings if you wish.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                7. Third-Party Login (Facebook / Google)
              </h2>
              <p>
                When logging in using Facebook or Google, we only access your
                name, email address, and profile picture. No additional data is
                collected without your consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>View your personal data</li>
                <li>Update or correct your information</li>
                <li>Request deletion of your account</li>
              </ul>
              <p className="mt-2">
                Contact us at: 📧 your-email@example.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                9. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be reflected by updating the “Last Updated” date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                10. Contact Us
              </h2>
              <p>📧 toriquldev000@gmail.com</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
