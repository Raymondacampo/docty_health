// pages/api/doctors/[doctorId].js
export default async function handler(req, res) {
  console.log("API Route Hit - req.query:", req.query);
  const doctorId = req.query?.doctorId;

  if (!doctorId) {
    return res.status(400).json({ error: "doctorId is required" });
  }

  try {
    const response = await fetch(`https://juanpabloduarte.com/api/doctors/${doctorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch doctor data: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}