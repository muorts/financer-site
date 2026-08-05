export default function Home() {
  return (
    <div className="p-8">
      {/* Testando a cor de fundo do card e a cor do texto */}
      <div className="bg-surface border border-border p-6 rounded-2xl">
        <h1 className="text-3xl font-bold text-brand font-sans">
          Financer PWA
        </h1>
        <p className="text-success font-mono mt-4 text-xl">
          R$ 1.500,00
        </p>
        <p className="text-gray-300 mt-2">
          Fundo escuro e Escrita Verda = Tudo certo 
        </p>
      </div>
    </div>
  );
}