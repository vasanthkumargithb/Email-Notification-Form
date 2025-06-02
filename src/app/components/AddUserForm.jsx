"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    boardMember: "",
    keyPersonnel: "",
    designation: "",
    gender: "",
    din: "",
    fullName: "",
    age: "",
    nationality: "",
    email: "",
    mobile: ""
  });

  const [isFetched, setIsFetched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFetch = async () => {
    if (!formData.din) {
      alert("Please enter a DIN number");
      return;
    }

    // First, try to find user in localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = storedUsers.find((user) => user.din === formData.din);

    if (foundUser) {
      setFormData({
        boardMember: foundUser.boardMember || "",
        keyPersonnel: foundUser.keyPersonnel || "",
        designation: foundUser.designation || "",
        gender: foundUser.gender || "",
        din: foundUser.din,
        fullName: foundUser.fullName || "",
        age: foundUser.age || "",
        nationality: foundUser.nationality || "",
        email: foundUser.email || "",
        mobile: foundUser.mobile || ""
      });
      setIsFetched(true);
      return; // stop here, user found in localStorage
    }

    // If not found in localStorage, fallback to /userData.json (optional)
    try {
      const response = await fetch("/userData.json");
      if (!response.ok) throw new Error("Failed to fetch user data");

      const users = await response.json();
      const matchedUser = users.find((user) => user.din === formData.din);

      if (matchedUser) {
        setFormData({
          boardMember: matchedUser.boardMember || "",
          keyPersonnel: matchedUser.keyPersonnel || "",
          designation: matchedUser.designation || "",
          gender: matchedUser.gender || "",
          din: matchedUser.din,
          fullName: matchedUser.fullName || "",
          age: matchedUser.age || "",
          nationality: matchedUser.nationality || "",
          email: matchedUser.email || "",
          mobile: matchedUser.mobile || ""
        });
        setIsFetched(true);
      } else {
        alert("User DIN not registered");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Error fetching user data");
    }
  };

  const handleSubmit = () => {
    if (!formData.din) {
      alert("Please enter DIN number.");
      return;
    }
    if (!formData.fullName) {
      alert("Please enter full name.");
      return;
    }
    if (!formData.email) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!formData.boardMember || !formData.keyPersonnel || !formData.gender) {
      alert("Please fill all required selections.");
      return;
    }

    if (!isFetched) {
      // Register user: save to localStorage and reset form
      const users =
        JSON.parse(localStorage.getItem("users")) && Array.isArray(JSON.parse(localStorage.getItem("users")))
          ? JSON.parse(localStorage.getItem("users"))
          : [];

      const existingUserIndex = users.findIndex((u) => u.din === formData.din);
      if (existingUserIndex !== -1) {
        alert("User with this DIN already registered.");
        return;
      }

      users.push(formData);
      localStorage.setItem("users", JSON.stringify(users));
      alert("User registered successfully!");

      setFormData({
        boardMember: "",
        keyPersonnel: "",
        designation: "",
        gender: "",
        din: "",
        fullName: "",
        age: "",
        nationality: "",
        email: "",
        mobile: ""
      });
    } else {
      // Send email notification
      const templateParams = {
        to_email: formData.email,
        full_name: formData.fullName,
        designation: formData.designation,
        gender: formData.gender,
        din: formData.din,
        age: formData.age,
        nationality: formData.nationality,
        mobile: formData.mobile,
        board_member: formData.boardMember,
        key_personnel: formData.keyPersonnel
      };

      emailjs
        .send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        )
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            alert("Email notification sent successfully!");
            setIsFetched(false);
            setFormData({
              boardMember: "",
              keyPersonnel: "",
              designation: "",
              gender: "",
              din: "",
              fullName: "",
              age: "",
              nationality: "",
              email: "",
              mobile: ""
            });
          },
          (error) => {
            console.error("FAILED...", error);
            alert("Failed to send email.");
          }
        );
    }
  };

  const handleCancel = () => {
    setIsFetched(false);
    setFormData({
      boardMember: "",
      keyPersonnel: "",
      designation: "",
      gender: "",
      din: "",
      fullName: "",
      age: "",
      nationality: "",
      email: "",
      mobile: ""
    });
  };

  return (
    <div className="bg-black min-h-screen text-black">
      <div className="w-full flex justify-between items-center border-b pb-2 mb-4 bg-gray-800 p-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-orange-500 leading-none">GOAVEGA</h1>
          <p className="text-sm text-white leading-none">Software Pvt. Ltd</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white">
            Hello! <strong>Narayan</strong>
          </p>
          <p className="text-xs text-white">Administrator</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-10 bg-white rounded-xl min-h-[500px]">
        <h2 className="text-2xl font-semibold mb-4 text-black">Add New User</h2>

        <div>
          <div className="flex gap-12 mb-6">
            <div className="flex gap-2 items-center">
              <span className="text-black">
                Member of the <strong>Board of Directors?</strong>
              </span>
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (!isFetched) setFormData((prev) => ({ ...prev, boardMember: opt }));
                  }}
                  className={`px-4 py-1 rounded cursor-pointer ${
                    formData.boardMember === opt
                      ? "bg-black text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  disabled={isFetched}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-black">
                <strong>Key Member Personnel?</strong>
              </span>
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (!isFetched) setFormData((prev) => ({ ...prev, keyPersonnel: opt }));
                  }}
                  className={`px-4 py-1 rounded cursor-pointer ${
                    formData.keyPersonnel === opt
                      ? "bg-black text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  disabled={isFetched}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mb-4">
            <h3 className="font-semibold mb-2 text-black">Personal Details</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                name="designation"
                placeholder="Designation"
                className="bg-gray-300 text-black p-2 rounded"
                value={formData.designation}
                onChange={handleChange}
                disabled={isFetched}
              />

              <div className="col-span-2 flex gap-2 items-center">
                <label className="mr-2 text-black">Gender</label>
                {["Male", "Female", "Prefer Not to say"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (!isFetched) setFormData((prev) => ({ ...prev, gender: opt }));
                    }}
                    className={`px-4 py-1 rounded cursor-pointer ${
                      formData.gender === opt
                        ? "bg-black text-white"
                        : "bg-gray-300 text-black"
                    }`}
                    disabled={isFetched}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  name="din"
                  placeholder="Enter DIN No."
                  className="bg-gray-300 text-black p-2 rounded hover:bg-gray-800 hover:text-white transition-colors"
                  value={formData.din}
                  onChange={handleChange}
                  disabled={isFetched}
                />
                <button
                  onClick={handleFetch}
                  className="bg-orange-400 text-black px-4 rounded hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
                  disabled={isFetched}
                >
                  FETCH
                </button>
              </div>

              <input
                name="fullName"
                placeholder="Full Name"
                className="bg-gray-300 text-black p-2 rounded"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isFetched}
              />
              <input
                name="age"
                placeholder="Age"
                className="bg-gray-300 text-black p-2 rounded"
                value={formData.age}
                onChange={handleChange}
                disabled={isFetched}
              />
              <input
                name="nationality"
                placeholder="Nationality"
                className="bg-gray-300 text-black p-2 rounded"
                value={formData.nationality}
                onChange={handleChange}
                disabled={isFetched}
              />
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold mb-2 text-black">Communication Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="email"
                placeholder="Primary Email ID (Used to login)"
                className="bg-gray-300 text-black p-2 rounded"
                value={formData.email}
                onChange={handleChange}
                disabled={isFetched}
              />
              <input
                name="mobile"
                placeholder="Mobile No. (Used to Login)"
                className="bg-gray-300 text-black p-2 rounded"
                value={formData.mobile}
                onChange={handleChange}
                disabled={isFetched}
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleSubmit}
              className="bg-orange-400 text-black px-8 py-2 rounded hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
            >
              {isFetched ? "Send Email" : "Add User"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-orange-400 text-black px-8 py-2 rounded hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
