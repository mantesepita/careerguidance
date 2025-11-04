import React, { useState, useEffect } from 'react';
import { getAllCompanies, updateCompanyStatus } from '../../firebase/helpers';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const data = await getAllCompanies();
    setCompanies(data);
    setLoading(false);
  };

  const handleStatusChange = async (companyId, status) => {
    await updateCompanyStatus(companyId, status);
    fetchCompanies();
  };

  if (loading) return <p className="text-gray-500 mt-4">Loading companies...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Companies</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-2 px-4 border-b">Company Name</th>
              <th className="text-left py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{company.name}</td>
                <td className="py-2 px-4 border-b">{company.status}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  {company.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(company.id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}
                  {company.status !== 'suspended' && (
                    <button
                      onClick={() => handleStatusChange(company.id, 'suspended')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCompanies;
