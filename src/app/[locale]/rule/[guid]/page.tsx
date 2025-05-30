'use client';

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { UserRuleNote } from '../../../../../types';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import Loading from '../../../../../components/Loading'

const RulePage = () => {
  const { guid } = useParams();
  const [ruleNote, setRuleNote] = useState<UserRuleNote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const t = useTranslations('Rules');

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

      toast((tToast) => (
    <span className="text-md text-green">
      {t('successSave')}
    </span>
  ), {
    duration: 2000,
  });

    } catch (err) {
    }
  };

  if (loading) {
        return <Loading></Loading>;
    }
  if (error) return <div className="text-center text-red-600 py-4">{error}</div>;
  if (!ruleNote) return <div className="text-center py-4">Rule not found.</div>;

  const rulePdfName = ruleNote.Rule.Name.replace('/', '_');

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-black">{ruleNote.Rule.Name}</h1>
      
      <button
        className="px-4 py-2 mb-10 text-l mr-5 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        onClick={() => window.open(`/rules/${rulePdfName}.pdf`, '_blank')}
      >
        {t('open')}
      </button>

      <h1 className="text-xl font-semibold mb-6 text-black">{t('notes')}</h1>

      <div className="mb-6">
        <textarea
          className="w-full h-60 p-4 border border-gray-300 rounded-lg resize-none text-gray-800 text-lg"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 text-l mr-5 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
      >
        {t('save')}
      </button>
    </div>
  );
};

export default RulePage;
