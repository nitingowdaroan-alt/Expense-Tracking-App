import { useState, useMemo } from 'react';
import { Search, Filter, Download, X, ChevronDown } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORIES } from '../../utils/constants';
import {
  searchExpenses,
  filterExpensesByCategory,
  filterExpensesByDateRange,
  sortExpenses,
  exportToCSV,
  formatCurrency
} from '../../utils/helpers';
import ExpenseItem from './ExpenseItem';
import './ExpenseList.css';

const ExpenseList = ({ onEdit }) => {
  const { expenses, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Apply search
    result = searchExpenses(result, searchTerm);

    // Apply category filter
    result = filterExpensesByCategory(result, categoryFilter);

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      result = filterExpensesByDateRange(result, dateRange.start, dateRange.end);
    }

    // Apply sorting
    result = sortExpenses(result, sortBy, sortOrder);

    return result;
  }, [expenses, searchTerm, categoryFilter, dateRange, sortBy, sortOrder]);

  const totalFiltered = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleExport = () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses to export');
      return;
    }
    exportToCSV(filteredExpenses);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDateRange({ start: '', end: '' });
    setSortBy('date');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || dateRange.start || dateRange.end;

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn-ghost clear-search"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="header-actions">
          <button
            className={`btn-secondary filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            <span>Filters</span>
            {hasActiveFilters && <span className="filter-badge" />}
          </button>

          <button className="btn-secondary" onClick={handleExport}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel animate-fade-in">
          <div className="filter-row">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>From Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>

            <div className="filter-group">
              <label>To Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button className="btn-ghost clear-filters" onClick={clearFilters}>
              <X size={14} />
              Clear all filters
            </button>
          )}
        </div>
      )}

      <div className="expense-list-summary">
        <span className="summary-count">
          {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
        </span>
        <span className="summary-total">
          Total: {formatCurrency(totalFiltered)}
        </span>
      </div>

      <div className="expense-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">$</div>
            <h3>No expenses found</h3>
            <p>
              {hasActiveFilters
                ? 'Try adjusting your filters or search term'
                : 'Start by adding your first expense'}
            </p>
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
