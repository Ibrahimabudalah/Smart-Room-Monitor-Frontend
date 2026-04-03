import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Signup</h1>

        <input className="w-full border p-2 mb-2" placeholder="Email" />
        <input className="w-full border p-2 mb-2" placeholder="Password" />

        <button className="w-full bg-green-500 text-white p-2 rounded">
          Signup
        </button>

        <p
          className="mt-3 text-sm text-blue-500 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Back to login
        </p>
      </div>
    </div>
  );
}
