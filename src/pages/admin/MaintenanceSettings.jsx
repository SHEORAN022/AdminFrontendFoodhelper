import { useEffect, useState } from "react";
import axios from "axios";
const API = "https://grocerrybackend.onrender.com/api/app";

export default function MaintenanceSettings() {
  const [loading, setLoading] = useState(false);

  const [maintenanceMode, setMaintenanceMode] =
    useState(false);

  const [maintenanceMessage, setMaintenanceMessage] =
    useState("We are under maintenance");

  // fetch settings
  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        `${API}/settings`
      );

      setMaintenanceMode(
        res.data.settings?.maintenanceMode || false
      );

      setMaintenanceMessage(
        res.data.settings?.maintenanceMessage ||
          "We are under maintenance"
      );
    } catch (err) {
      console.log(err);
      alert("Failed to load settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // update maintenance
  const updateMaintenance = async () => {
    try {
      setLoading(true);

      await axios.put(
        `${API}/settings/maintenance`,
        {
          maintenanceMode,
          maintenanceMessage,
        }
      );

      alert(
        "Maintenance settings updated successfully"
      );
    } catch (err) {
      console.log(err);
      alert("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          Maintenance Mode
        </h1>

        {/* Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-lg">
              App Maintenance
            </h2>

            <p className="text-gray-500 text-sm">
              Turn OFF all products visibility
            </p>
          </div>

          <button
            onClick={() =>
              setMaintenanceMode(!maintenanceMode)
            }
            className={`w-16 h-8 rounded-full transition-all duration-300 relative ${
              maintenanceMode
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                maintenanceMode
                  ? "right-1"
                  : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Status */}
        <div className="mb-6">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              maintenanceMode
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {maintenanceMode
              ? "Maintenance ON"
              : "Maintenance OFF"}
          </span>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Maintenance Message
          </label>

          <textarea
            rows={4}
            value={maintenanceMessage}
            onChange={(e) =>
              setMaintenanceMessage(e.target.value)
            }
            placeholder="Enter maintenance message"
            className="w-full border rounded-lg p-3 outline-none"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={updateMaintenance}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}