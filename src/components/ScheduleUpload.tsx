"use client";

import { useState, ChangeEvent } from "react";
import Papa from "papaparse";
import { authedFetch } from "@/lib/api/client";

interface CsvRow {
  text: string;
  date: string;
  startTime?: string;
  endTime?: string;
  priority?: "low" | "medium" | "high";
}

interface ScheduleUploadProps {
  onUploadSuccess?: () => void;
}

export function ScheduleUpload({ onUploadSuccess }: ScheduleUploadProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(null);
    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: { data: CsvRow[] | undefined }) => {
        try {
          const rows = results.data ?? [];
          const res = await authedFetch("/api/schedule", {
            method: "POST",
            body: JSON.stringify(rows),
          });
          const json = await res.json();
          if (!res.ok) {
            throw new Error(json?.error ?? "Upload failed");
          }
          setStatus(
            `Uploaded ${json.count ?? rows.length} entries. Your task list has been updated.`
          );
          onUploadSuccess?.();
        } catch (err: any) {
          setStatus(
            err?.message ?? "Something went wrong while uploading the file."
          );
        } finally {
          setUploading(false);
          e.target.value = "";
        }
      },
      error: (error: { message: string }) => {
        setStatus(error.message);
        setUploading(false);
        e.target.value = "";
      },
    });
  }

  return (
    <div className="upload-shell">
      <h3>Upload schedule (CSV)</h3>
      <p className="upload-subtitle">
        Columns: text, date (YYYY-MM-DD), startTime, endTime, priority
      </p>
      <label className="upload-input">
        <span>{uploading ? "Uploading..." : "Choose CSV file"}</span>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {status && <p className="upload-status">{status}</p>}
    </div>
  );
}

