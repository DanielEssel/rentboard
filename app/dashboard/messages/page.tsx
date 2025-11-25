// app/dashboard/messages/page.tsx
export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#023047]">Messages</h1>
      <p className="text-gray-600">View and respond to inquiries from interested renters</p>

      {/* Messages List */}
      <div className="space-y-4">
        {/* Replace with mapped data */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-gray-600 text-sm">
              “Hi, is this apartment still available?”
            </p>
          </div>

          <button className="text-[#006D77] font-semibold hover:underline">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
