import React, { useState, useEffect } from 'react';
import { getSystemReports } from '../../firebase/helpers';

const SystemReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const data = await getSystemReports();
      setReports(data);
    };
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Reports</h2>
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports available.</p>
      ) : (
        <ul className="space-y-3">
          {reports.map((report, index) => (
            <li
              key={index}
              className="p-4 border border-gray-200 rounded shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{report.title}</h3>
              <p className="text-gray-600">{report.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SystemReports;
