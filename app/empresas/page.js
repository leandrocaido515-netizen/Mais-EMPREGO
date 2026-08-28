import Link from "next/link";
import { CATS } from "../../lib/constants";

export default function Empresas() {
  return (
    <div className="min-h-screen">
      <section className="bg-verde">
        <div className="max-w-4xl mx-auto px-5 pt-14 pb-14">
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-paper">Contrata em todo o país</h1>
          <p className="mt-4 text-base text-paper/80 max-w-2xl">
            Publica a tua vaga gratuitamente e alcança candidatos em todas as províncias de Moçambique — incluindo zonas rurais raramente cobertas por outras plataformas.
          </p>
          <Link href="/publicar" className="inline-block mt-6 px-6 py-3 text-sm font-semibold rounded-sm bg-ouro text-verde">
            Publicar vaga agora
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 py-14">
        <h2 className="text-xl font-semibold font-display text-ink mb-6">Como funciona</h2>
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          <div>
            <span className="text-2xl font-display font-semibold text-ouro">1</span>
            <h3 className="font-semibold text-ink mt-2 mb-1">Cria uma conta de empresa</h3>
            <p className="text-sm text-musgo">Registo gratuito, leva menos de 2 minutos.</p>
          </div>
          <div>
            <span className="text-2xl font-display font-semibold text-ouro">2</span>
            <h3 className="font-semibold text-ink mt-2 mb-1">Publica a tua vaga</h3>
            <p className="text-sm text-musgo">Descreve o cargo, requisitos e localização.</p>
          </div>
          <div>
            <span className="text-2xl font-display font-semibold text-ouro">3</span>
            <h3 className="font-semibold text-ink mt-2 mb-1">Recebe candidaturas</h3>
            <p className="text-sm text-musgo">Vê os candidatos e os seus CVs no teu painel.</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold font-display text-ink mb-4">Áreas mais procuradas</h2>
        <div className="flex flex-wrap gap-3 mb-14">
          {CATS.map((c) => (
            <span key={c} className="px-4 py-2 rounded-full text-sm font-medium border border-ouro text-ink">{c}</span>
          ))}
        </div>

        <h2 className="text-xl font-semibold font-display text-ink mb-4">Perguntas frequentes</h2>
        <div className="flex flex-col gap-4 mb-14">
          <div className="bg-white rounded-sm p-5">
            <h3 className="font-semibold text-ink text-sm mb-1">Custa alguma coisa publicar uma vaga?</h3>
            <p className="text-sm text-musgo">Não, publicar vagas é gratuito.</p>
          </div>
          <div className="bg-white rounded-sm p-5">
            <h3 className="font-semibold text-ink text-sm mb-1">Quanto tempo demora a vaga a ficar visível?</h3>
            <p className="text-sm text-musgo">Cada vaga é revista antes de publicada, normalmente em 24 horas.</p>
          </div>
          <div className="bg-white rounded-sm p-5">
            <h3 className="font-semibold text-ink text-sm mb-1">Como recebo as candidaturas?</h3>
            <p className="text-sm text-musgo">No teu painel de empresa, com acesso ao CV de cada candidato.</p>
          </div>
        </div>

        <div className="bg-brick rounded-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-paper/90">Já tens conta de empresa?</p>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm font-semibold px-5 py-2 rounded-sm bg-paper text-brick">Entrar</Link>
            <Link href="/empresa/dashboard" className="text-sm font-semibold px-5 py-2 rounded-sm bg-ouro text-verde">Ver as minhas vagas</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
