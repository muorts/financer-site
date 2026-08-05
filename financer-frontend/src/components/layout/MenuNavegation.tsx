import {Home, Package, Dices, Wallet} from 'lucide-react';

export function MenuNavegation() {
  return (
    // Diferentes regras para computador e para celular
    <nav className="
      fixed bottom-0 left-0 w-full h-20 
      bg-surface border-t border-border 
      flex flex-row justify-around items-center
      z-50
      
      md:top-0 md:h-screen md:w-64 md:border-t-0 md:border-r 
      md:flex-col md:justify-start md:items-start md:p-6 md:space-y-4
    ">
      
      <div className="hidden md:block mb-8 text-2xl font-bold text-brand">
        Financer
      </div>


      <button className="text-gray-300 hover:text-white font-medium p-2">
        Dashboard
      </button>
      <button className="text-gray-300 hover:text-white font-medium p-2">
        Vendas
      </button>
      <button className="text-gray-300 hover:text-white font-medium p-2">
        Apostas
      </button>
      <button className="text-gray-300 hover:text-white font-medium p-2">
        Finanças
      </button>

    </nav>
  )
}