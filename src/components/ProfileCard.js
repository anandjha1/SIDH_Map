import axios from "axios";
import React, { useState } from "react";
import Loader from "./Loader";
import "./ProfileCard.css";

const ProfileCard = ({ data, setData, link, setLink, baseUrl }) => {
  const searchParam = new URLSearchParams(window.location.search);
  const [stdId, setStdId] = useState(searchParam.get("stdId") || "");
  const [pin, setPin] = useState("");
  const [remarks, setRemarks] = useState("EKYC ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!data || !data.IsSuccess || !data.Data) {
    return <div className="profile-card no-data">No data available</div>;
  }

  const {
    FullName,
    MobileNumber,
    Email,
    Photo,
    Gender,
    DateOfBirth,
    IsAadhaarVerified,
    AddressDetails,
  } = data.Data;
  const [name, setName] = useState(FullName || searchParam.get("name") || "");
  const address = IsAadhaarVerified ? AddressDetails[0] : {};

  const handleSubmit = async () => {
    if (!link || !MobileNumber || pin.length !== 4 || !stdId) {
      alert("Mandatory field missing");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = {
        studentId: stdId,
        name,
        mobile: MobileNumber,
        password: pin,
        profileUrl: link,
        remarks,
      };
      const res = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      alert(result.message);
      setData("");
      setLink("");
    } catch (error) {
      setError("Error submitting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <img
          src={
            Photo
              ? "data:image/jpg;base64," + Photo
              : "https://drive.google.com/uc?id=16ZkeRxwkjYwyQn8wUd40oZYUq5wmFR5U&export=download"
          }
          alt="Profile"
          className="profile-photo"
        />
        <div className="profile-name">
          <h2>
            {FullName || (
              <input
                type="text"
                value={name}
                placeholder="Name as per Aadhaar Card."
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </h2>
          <p>Mobile: {MobileNumber}</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-info">
          <h3>Profile Information</h3>
          <table>
            <tbody>
              <tr>
                <th>Email</th>
                <td>{Email || "N/A"}</td>
                <th>Gender</th>
                <td>{Gender || "N/A"}</td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>{DateOfBirth || "N/A"}</td>
                <th>Aadhaar Verified</th>
                <td>{IsAadhaarVerified ? "Yes" : "No"}</td>
              </tr>
              {IsAadhaarVerified ? (
                <tr>
                  <th>Address</th>
                  <td colSpan={3}>
                    <p>
                      {address.AddressLine1 || ""}, {address.AddressLine2 || ""}
                      , {address.Village || ""}, {address.Landmark || ""},{" "}
                      {address.District || ""}, {address.State || ""} -{" "}
                      {address.Pin || ""}
                    </p>
                  </td>
                </tr>
              ) : (
                <tr>
                  <th>Remarks</th>
                  <td colSpan={3}>
                    <textarea
                      placeholder="Remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </td>
                </tr>
              )}
              <tr>
                <th>Student ID</th>
                <td>
                  <input
                    type="number"
                    placeholder="Enter Student ID"
                    required
                    value={stdId}
                    onChange={(e) => setStdId(e.target.value)}
                  />
                </td>
                <th>SID Password</th>
                <td>
                  <input
                    type="password"
                    placeholder="Enter 4-digit Password"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {loading && <Loader />}
        {error && <div className="error">{error}</div>}
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          Submit Form
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
