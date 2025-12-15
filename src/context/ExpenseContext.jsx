import { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS, DEFAULT_BUDGETS } from '../utils/constants';
import { generateId, getCurrentMonth } from '../utils/helpers';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  budgets: DEFAULT_BUDGETS,
  theme: 'light',
  selectedMonth: getCurrentMonth(),
  isLoading: true,
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        expenses: action.payload.expenses || [],
        budgets: action.payload.budgets || DEFAULT_BUDGETS,
        theme: action.payload.theme || 'light',
        isLoading: false,
      };

    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
      };

    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };

    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };

    case 'SET_BUDGETS':
      return {
        ...state,
        budgets: { ...state.budgets, ...action.payload },
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'SET_SELECTED_MONTH':
      return {
        ...state,
        selectedMonth: action.payload,
      };

    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES)) || [];
        const budgets = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS)) || DEFAULT_BUDGETS;
        const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';

        dispatch({
          type: 'LOAD_DATA',
          payload: { expenses, budgets, theme },
        });

        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        dispatch({ type: 'LOAD_DATA', payload: {} });
      }
    };

    loadData();
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(state.expenses));
    }
  }, [state.expenses, state.isLoading]);

  // Save budgets to localStorage
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
    }
  }, [state.budgets, state.isLoading]);

  // Save theme to localStorage and apply it
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state.theme, state.isLoading]);

  const addExpense = (expenseData) => {
    const expense = {
      id: generateId(),
      ...expenseData,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    return expense;
  };

  const updateExpense = (id, expenseData) => {
    const expense = {
      ...expenseData,
      id,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    return expense;
  };

  const deleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const setBudgets = (budgets) => {
    dispatch({ type: 'SET_BUDGETS', payload: budgets });
  };

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setSelectedMonth = (month) => {
    dispatch({ type: 'SET_SELECTED_MONTH', payload: month });
  };

  const value = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    setBudgets,
    setTheme,
    toggleTheme,
    setSelectedMonth,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export default ExpenseContext;
