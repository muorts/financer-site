import { Inter, JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next' // <-- Importação do Metadata
import './globals.css'
import { MenuNavegation } from '@/components/layout/MenuNavegation'

// Configurando as fontes
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// === BLOCO DE METADADOS (Onde a mágica do título e ícone acontece) ===
export const metadata: Metadata = {
  title: 'Fincker',
  description: 'Sistema de gestão financeira e estoque',
  icons: {
    icon: '/Vector_Logo.svg', // <-- Força o navegador a buscar o SVG na pasta public
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Aplicando as fontes no body e setando o fundo escuro padrão
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-background text-gray-100 min-h-screen">
        
        {/* O Menu Inteligente entra aqui */}
        <MenuNavegation />

        {/* 
            MIOLO DINÂMICO
            No celular: pb-24 (espaço no fundo para não esconder conteúdo atrás do BottomNav)
            No PC: md:pb-0 (tira o espaço do fundo) e md:pl-64 (dá um espaço na esquerda do tamanho da Sidebar)
        */}
        <main className="pb-24 md:pb-0 md:pl-64">
          {children}
        </main>

      </body>
    </html>
  )
}