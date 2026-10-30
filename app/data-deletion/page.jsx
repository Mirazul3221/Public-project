import Header from "../components/Header";

export const metadata = {
  title: "User Data Deletion Instructions",
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
         <div>
                    <Header />
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">
          User Data Deletion Instructions
        </h1>

        <p className="mb-4 text-gray-700">
          If you have used our application and want to request deletion of your
          personal data associated with our Facebook App, please follow the
          instructions below.
        </p>

        <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
          <li>
            Send an email to:
            <strong className="block">support@yourdomain.com</strong>
          </li>
          <li>
            Use the subject line:
            <strong className="block">
              Facebook Data Deletion Request
            </strong>
          </li>
          <li>
            Include your Facebook User ID or the email used to sign in.
          </li>
        </ol>

        <p className="text-gray-700">
          We will process your request and delete your data within
          <strong> 7 business days</strong>. You will receive a confirmation
          email once the deletion is completed.
        </p>
      </div>
         </div>
    </main>
  );
}
