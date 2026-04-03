import Navbar from "./Navbar";

export default function Layout({ children }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 pb-20 md:pb-4">{children}</div>
    </div>
  );
}
