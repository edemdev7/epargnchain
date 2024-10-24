import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PiggyBank, 
  Wallet, 
  Bell, 
  LogOut, 
  Settings, 
  Home,
  CreditCard,
  Target,
  X,
  Loader
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // États pour les données
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    totalEpargne: 0,
    totalTransactions: 0,
    evolutionEpargne: [],
    transactions: []
  });
  
  // État pour le modal
  const [showModal, setShowModal] = useState(false);
  const [montant, setMontant] = useState('');
  const [description, setDescription] = useState('');

  // Fonction pour formater les montants
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Récupération des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Remplacer ces URL par vos endpoints API réels
        const [epargneRes, transactionsRes] = await Promise.all([
          fetch('api/epargne'),
          fetch('api/transactions')
        ]);

        if (!epargneRes.ok || !transactionsRes.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const epargneData = await epargneRes.json();
        const transactionsData = await transactionsRes.json();

        setUserData({
          totalEpargne: epargneData.total,
          totalTransactions: transactionsData.count,
          evolutionEpargne: epargneData.evolution,
          transactions: transactionsData.recent
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(fetchUserData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour créditer le solde
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Remplacer par votre endpoint API réel
      const response = await fetch('api/epargne/credit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          montant: parseFloat(montant),
          description
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du crédit');
      }

      // Rafraîchir les données
      const updatedData = await response.json();
      setUserData(prev => ({
        ...prev,
        totalEpargne: updatedData.newTotal,
        transactions: [updatedData.newTransaction, ...prev.transactions]
      }));

      setShowModal(false);
      setMontant('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData.totalEpargne) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>Une erreur est survenue: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-8">Epargnchain</h1>
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
              <Home className="h-5 w-5" />
              <span>Tableau de bord</span>
            </a>
            <a href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
              <CreditCard className="h-5 w-5" />
              <span>Transactions</span>
            </a>
            <a href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
              <Target className="h-5 w-5" />
              <span>Objectifs</span>
            </a>
            <a href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
              <Settings className="h-5 w-5" />
              <span>Paramètres</span>
            </a>
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-4">
          <button 
            onClick={async () => {
              try {
                await fetch('api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              } catch (error) {
                setError('Erreur lors de la déconnexion');
              }
            }}
            className="flex items-center space-x-2 text-white hover:text-gray-300 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="animate-spin h-4 w-4" />
                    <span>Chargement...</span>
                  </div>
                ) : (
                  'Créditer mon solde'
                )}
              </button>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Épargne Totale
                </CardTitle>
                <PiggyBank className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatAmount(userData.totalEpargne)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="text-green-500">
                    {((userData.evolutionEpargne[userData.evolutionEpargne.length - 1]?.amount || 0) -
                      (userData.evolutionEpargne[userData.evolutionEpargne.length - 2]?.amount || 0)).toFixed(2)}%
                  </span> depuis le mois dernier
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Transactions
                </CardTitle>
                <Wallet className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.totalTransactions}</div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="text-green-500">+8%</span> ce mois
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution de l'épargne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userData.evolutionEpargne}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatAmount(value)} />
                      <Bar dataKey="amount" fill="#2563EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transactions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{transaction.description}</span>
                        <span className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                      <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal pour créditer le solde */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Créditer mon solde</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant
                </label>
                <input
                  type="number"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00 €"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description de la transaction"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="animate-spin h-4 w-4" />
                    <span>En cours...</span>
                  </div>
                ) : (
                  'Confirmer'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;