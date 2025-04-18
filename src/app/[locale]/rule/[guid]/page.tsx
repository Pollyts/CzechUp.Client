'use client';

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { UserRuleNote } from '../../../../../types';

const RulePage = () => {
  const { guid } = useParams();
  const [ruleNote, setRuleNote] = useState<UserRuleNote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  const jwtToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!jwtToken) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

    const fetchUserRuleNotes = async () => {
      try {
        const response = await fetch(`https://localhost:44376/api/rule/ruleNotes?ruleGuid=${guid}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch word data.");
        }

        const data: UserRuleNote = await response.json();
        setRuleNote(data);
        setNote(data.Note);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (guid) {
      fetchUserRuleNotes();
    }
  }, [guid, jwtToken]);

  const handleSave = async () => {
    if (!ruleNote || !jwtToken) return;

    const updatedRuleNote = { ...ruleNote, Note: note };

    try {
      const response = await fetch("https://localhost:44376/api/rule", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRuleNote),
      });

      if (!response.ok) {
        throw new Error("Failed to save the note.");
      }

      alert("Изменения сохранены!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка при сохранении.");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-4">{error}</div>;
  if (!ruleNote) return <div className="text-center py-4">Rule not found.</div>;

  const rulePdfName = ruleNote.Rule.Name.replace('/', '_');

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-black">{ruleNote.Rule.Name}</h1>
      
      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={() => window.open(`/rules/${rulePdfName}.pdf`, '_blank')}
      >
        Посмотреть PDF
      </button>

      <div className="mb-6">
        <textarea
          className="w-full h-60 p-4 border border-gray-300 rounded-lg resize-none text-gray-800 text-lg"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Сохранить
      </button>
    </div>
  );
};

export default RulePage;
