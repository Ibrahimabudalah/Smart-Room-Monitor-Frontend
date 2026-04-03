export default function ChatBox() {
  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-2xl shadow">
      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <div className="bg-gray-200 p-3 rounded-lg w-fit max-w-xs">
          Your room humidity is high.
        </div>

        <div className="bg-blue-500 text-white p-3 rounded-lg w-fit max-w-xs ml-auto">
          How can I fix it?
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded-lg p-2 focus:outline-none"
          placeholder="Ask something..."
        />
        <button className="bg-blue-500 text-white px-4 rounded-lg">Send</button>
      </div>
    </div>
  );
}
