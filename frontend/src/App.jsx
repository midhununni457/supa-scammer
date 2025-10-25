import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

function App() {
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const pingServer = async () => {
    setIsConnected(false);

    while (true) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/ping`);
        if (response.ok) {
          console.log("Backend connected successfully");
          setIsConnected(true);
          break;
        }
      } catch (error) {
        console.warn("Backend unreachable, retrying...");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  useEffect(() => {
    pingServer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch(`${BACKEND_URL}/api/urls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    if (response.ok) {
      setMsg("URL added successfully");
      setStatus("success");
      setIsLoading(false);
      console.log("URL added successfully");
    } else {
      setMsg("Error adding URL. Please check if it is valid.");
      setStatus("error");
      setIsLoading(false);
      console.error("Error adding URL");
    }
  };

  return (
    <div className="bg-[#121212] relative w-screen h-screen pt-25 px-5 flex flex-col justify-start items-center gap-4">
      <img
        src="bg.png"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="relative z-10 w-full flex flex-col justify-center items-center gap-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-5">
          <div className="flex items-center justify-center mb-10">
            <h1 className="text-5xl font-bold text-white">Supa</h1>
            <h1 className="text-5xl font-bold text-[#3ECF8E]">Scammer</h1>
          </div>

          <h2 className="text-3xl font-semibold text-white mb-3">
            Keep your Supabase database alive
          </h2>

          <p className="text-[#9CA3AF] font-semibold text-base leading-relaxed max-w-xl">
            Prevent your Supabase database from pausing due to inactivity.
            Simply add your database connection string and we'll ping it
            regularly to keep it active.
          </p>
        </div>

        {/* Form */}
        <div className="w-full sm:w-2/3 md:w-2/5 flex flex-col justify-center items-start gap-2">
          {!isConnected && (
            <div className="flex items-center justify-center w-full mb-2 gap-2">
              <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-yellow-400 text-sm font-semibold">
                Connecting to backend...
              </p>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="w-full flex justify-center items-center gap-3"
          >
            <input
              type="text"
              placeholder="Enter connection string"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={!isConnected}
              className="px-5 py-2 w-full bg-[#1C1C1C] text-sm text-white placeholder-[#4D4D4D] border border-[#4D4D4D] rounded-sm focus:outline-2 focus:outline-[#22384F] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!isConnected || isLoading}
              className={`px-5 py-2 w-32 ${
                isLoading ? "bg-[#017344]" : "bg-[#006239]"
              } rounded-sm border border-[#198554] text-sm font-semibold text-white focus:outline-2 focus:outline-[#22384F] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </form>
          {msg && (
            <p
              className={`${
                status === "success" ? "text-[#02814c]" : "text-[#E54D2E]"
              } text-sm font-semibold`}
            >
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
