import { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { PaginatedResponse } from '../types';
import { api } from '../services/api';

const ITEMS_PER_PAGE = 10;

const COLUMNS = [
  { header: 'First Name', field: 'first_name' },
  { header: 'Last Name', field: 'last_name' },
  { header: 'Weapon', field: 'weapon' },
  { header: 'Vehicle', field: 'vehicle' },
  { header: 'Locations', field: 'locations' },
  { header: 'Affiliations', field: 'affiliations' }
];

export const DataTable = forwardRef((props, ref) => {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState('');
  const [sortField, setSortField] = useState<string>('first_name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.getAllPeople(sortField, sortOrder);
      setData(response);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortField, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useImperativeHandle(ref, () => ({
    refreshData: fetchData
  }));

  const filteredAndPaginatedData = useMemo(() => {
    if (!data) return null;

    const filtered = data.data.filter(person => {
      const searchTerm = nameFilter.toLowerCase();
      return (
        `${person.first_name} ${person.last_name}`.toLowerCase().includes(searchTerm) ||
        person.weapon?.toLowerCase().includes(searchTerm) ||
        person.vehicle?.toLowerCase().includes(searchTerm) ||
        person.locations.some(loc => loc.name.toLowerCase().includes(searchTerm)) ||
        person.affiliations.some(aff => aff.name.toLowerCase().includes(searchTerm))
      );
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      data: paginatedData,
      total: filtered.length,
      pages: totalPages,
      currentPage: page
    };
  }, [data, nameFilter, page]);

  const handleNameFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div className="p-4 bg-gray-50">
        <input
          type="text"
          value={nameFilter}
          onChange={handleNameFilter}
          placeholder="Search..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.header}
                onClick={() => handleSort(column.field)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                {column.header}
                <span className="ml-2">
                  {sortField === column.field && (sortOrder === 'ASC' ? '↑' : '↓')}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAndPaginatedData?.data.map((person) => (
            <tr key={person.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{person.first_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{person.last_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{person.weapon}</td>
              <td className="px-6 py-4 whitespace-nowrap">{person.vehicle}</td>
              <td className="px-6 py-4">{person.locations.map(loc => loc.name).join(', ')}</td>
              <td className="px-6 py-4">{person.affiliations.map(aff => aff.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredAndPaginatedData && filteredAndPaginatedData.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 p-4 bg-gray-50">
          {Array.from({ length: filteredAndPaginatedData.pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded ${
                page === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
