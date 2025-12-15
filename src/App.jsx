import { useState } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import Layout from './components/common/Layout';
import Modal from './components/common/Modal';
import Dashboard from './components/dashboard/Dashboard';
import ExpenseList from './components/expenses/ExpenseList';
import ExpenseForm from './components/expenses/ExpenseForm';
import BudgetManager from './components/budget/BudgetManager';
import Analytics from './pages/Analytics';
import './App.css';

const AppContent = () => {
  const { addExpense, updateExpense, isLoading } = useExpenses();
  const [activeView, setActiveView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSubmitExpense = (expenseData) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleViewExpenses = () => {
    setActiveView('expenses');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading your expenses...</p>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onViewExpenses={handleViewExpenses} />;
      case 'expenses':
        return <ExpenseList onEdit={handleEditExpense} />;
      case 'analytics':
        return <Analytics />;
      case 'budgets':
        return <BudgetManager />;
      default:
        return <Dashboard onViewExpenses={handleViewExpenses} />;
    }
  };

  return (
    <>
      <Layout
        activeView={activeView}
        onViewChange={setActiveView}
        onAddExpense={handleAddExpense}
      >
        {renderView()}
      </Layout>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmitExpense}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

const App = () => {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
};

export default App;
