import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    async function fetchGoogleAuth() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");  // ✅ Extract Google Auth Code

      if (!code) {
        console.error("No Google authorization code found.");
        alert("Google authentication failed.");
        router.push("/login");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),  // ✅ Send the code to Django
      });

      const data = await res.json();
      console.log("Django Response:", data);  // ✅ Debug Django response

      if (res.ok) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        router.push("/profile");
      } else {
        console.error("Google login failed:", data);
        alert("Google Sign-In failed.");
        router.push("/login");
      }
    }

    fetchGoogleAuth();
  }, []);

  return <p>Authenticating...</p>;
}
