"use client";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyC7Kf-MiLw8z5hJsaTSDcTar4ccapKjMdM",
  authDomain: "homefy-dev.firebaseapp.com",
  databaseURL: "https://apartment-d31d1-default-rtdb.firebaseio.com",
  projectId: "homefy-dev",
  storageBucket: "homefy-dev.appspot.com",
  messagingSenderId: 201904196731,
  appId: "1:201904196731:web:f79b206d87f38a920966de",
  measurementId: "G-VV06HWFW3Q",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const JsonUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const uploadToFirestore = async (data) => {
    const collectionRef = collection(db, "caseStudyDetailli");
    for (const item of data) {
      await setDoc(doc(collectionRef, item.id), item);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);
      await uploadToFirestore(jsonData);
      setSuccess(true);
    } catch (err) {
      setError(
        `Error uploading file: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload JSON to Firestore</h2>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="mb-4 p-2 w-full border rounded"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Upload successful!</p>}
    </div>
  );
};

export default JsonUploader;
