'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Rule } from '../../../../types';
import Loading from '../../../../components/Loading'


const RulesPage = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Rules');
  const router = useRouter();

  const jwtToken = localStorage.getItem("token");

  useEffect(() => {
    if (!jwtToken) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

    const fetchRules = async () => {
      try {
        const response = await fetch("https://localhost:44376/api/Rule", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        const data: Rule[] = await response.json();
        setRules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [jwtToken]);

  if (loading) {
      return <Loading></Loading>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="container max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-black">{t('rules')}</h1>
      </div>

      <table className="min-w-full bg-white border border-gray rounded-lg">
        <tbody>
          {rules.map((rule) => (
            <tr
              key={rule.Guid}
              className="hover:bg-gray-100 transition-all cursor-pointer"
              onClick={() => router.push(`/rule/${rule.Guid}`)}
            >
              <td className="p-3 border-b border-gray">{rule.Name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RulesPage;
