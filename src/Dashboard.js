import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { 
  PiggyBank, 
  Wallet, 
  Bell, 
  LogOut, 
  Settings, 
  CircleUserRound,
  HandCoins,
  //ChevronRight, 
  X,
  Home,
  CreditCard,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const [montant, setMontant] = useState('');
    const [description, setDescription] = useState('');
    
    // État pour l'épargne totale
    const [totalSavings, setTotalSavings] = useState(12500); // Valeur initiale
  
    const savingsData = [
      { name: 'Jan', amount: 2500 },
      { name: 'Fév', amount: 3200 },
      { name: 'Mar', amount: 4100 },
      { name: 'Avr', amount: 3800 },
    ];
  
    const transactions = [
      { date: '24/10', description: 'Dépôt mensuel', amount: '+500 FCFA' },
      { date: '20/10', description: 'Intérêts', amount: '+25 FCFA' },
      { date: '15/10', description: 'Dépôt exceptionnel', amount: '+1000 FCFA' },
    ];
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Convertir le montant en nombre et l'ajouter à l'épargne totale
      const montantNumerique = parseFloat(montant);
      if (!isNaN(montantNumerique)) {
        setTotalSavings(prevTotal => prevTotal + montantNumerique);
        // Ajouter la transaction à la liste des transactions
        transactions.push({
          date: new Date().toLocaleDateString(),
          description,
          amount: `+${montantNumerique} FCFA`
        });
      }
  
      setShowModal(false);
      setMontant('');
      setDescription('');
    };
  
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
              <HandCoins className="h-5 w-5" />
              <span>Retrait</span>
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
          <button className="flex items-center space-x-2 text-white hover:text-gray-300 w-full">
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
              >
                Créditer mon solde
              </button>
            </div>
            <div className="flex items-center space-x-4"> 
            <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
                <CircleUserRound className="h-6 w-6 text-gray-500" />
            </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {/* Stats cards */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Épargne Totale
                </CardTitle>
                <PiggyBank className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSavings} FCFA</div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="text-green-500">+12%</span> depuis le mois dernier
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
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="text-green-500">+8%</span> ce mois
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution de l'épargne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={savingsData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#2563EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Transactions récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Transactions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{transaction.description}</span>
                        <span className="text-xs text-gray-500">{transaction.date}</span>
                      </div>
                      <span className="text-green-600 font-medium">{transaction.amount}</span>
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
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
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
                  placeholder="0.00 FCFA"
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
              >
                Confirmer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;