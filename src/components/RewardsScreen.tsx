import React, { useState } from 'react';
import { 
  Award, 
  ArrowLeft, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  Copy, 
  Coffee, 
  BookOpen, 
  ShoppingBag, 
  Trees, 
  ChevronRight,
  Droplets
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PartnerReward } from '../types';

export const RewardsScreen: React.FC = () => {
  const { 
    currentUser, 
    rewards, 
    redeemReward, 
    setScreen, 
    playActionSound 
  } = useApp();

  const [claimedReward, setClaimedReward] = useState<PartnerReward | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRedeem = (reward: PartnerReward) => {
    setErrorMsg('');
    if (!currentUser || currentUser.ecoPoints < reward.pointsCost) {
      setErrorMsg('Pontos insuficientes para resgatar esta recompensa. Descarte mais resíduos nos PEVs de Manaus!');
      return;
    }

    const success = redeemReward(reward.id);
    if (success) {
      setClaimedReward(reward);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full pb-24 pt-3 px-4 max-w-xl mx-auto text-white">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            playActionSound();
            setScreen('home');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <h1 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Award className="w-4 h-4" />
          <span>EcoRecompensas Manaus</span>
        </h1>

        <div className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/40">
          {currentUser?.ecoPoints || 0} pts
        </div>
      </div>

      {/* Gamification Level & Stats Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 border-2 border-emerald-500/60 shadow-xl mb-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Seu Nível de Consciência Ecológica
            </span>
            <h2 className="text-xl font-black text-white mt-0.5">
              {currentUser?.level || 'Guardião dos Igarapés'}
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Descarte correto verificado com IA em Manaus.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>

        {/* Impact Counters */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-800/50 text-xs">
          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/60 flex items-center gap-2">
            <Trees className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">3 Árvores</span>
              <span className="text-[10px] text-stone-400">Poupadas na ZFM</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/60 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">450 Litros</span>
              <span className="text-[10px] text-stone-400">Água preservada</span>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Rewards List */}
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
        <Gift className="w-4 h-4 text-emerald-400" />
        <span>Vouchers em Comércios Parceiros de Manaus</span>
      </h3>

      <div className="space-y-3">
        {rewards.map((rew) => {
          const canAfford = (currentUser?.ecoPoints || 0) >= rew.pointsCost;

          return (
            <div
              key={rew.id}
              className={`p-4 rounded-2xl border-2 transition ${
                canAfford
                  ? 'bg-stone-900/90 border-stone-700 hover:border-emerald-500/70'
                  : 'bg-stone-900/50 border-stone-800 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      {rew.category}
                    </span>
                    <span className="text-[11px] text-stone-400 font-bold">
                      · {rew.partnerName}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white mt-1 leading-snug">
                    {rew.title}
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5 leading-snug">
                    {rew.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-emerald-300 font-mono block">
                    {rew.pointsCost} pts
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {canAfford ? 'Disponível para resgate' : `Faltam ${rew.pointsCost - (currentUser?.ecoPoints || 0)} pts`}
                </span>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => handleRedeem(rew)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                    canAfford
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 border border-emerald-300 cursor-pointer active:scale-95'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Resgatar Cupom
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claimed Voucher Modal */}
      {claimedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-stone-900 border-2 border-emerald-400 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white">Cupom Resgatado com Sucesso!</h3>
              <p className="text-xs text-stone-300 mt-1">{claimedReward.title}</p>
              <p className="text-[11px] text-stone-400 font-medium mt-0.5">{claimedReward.partnerName}</p>
            </div>

            <div className="p-3 bg-stone-950 border border-emerald-500/40 rounded-xl">
              <span className="text-[10px] text-stone-400 uppercase font-mono block mb-1">
                Apresente o Código no Estabelecimento em Manaus:
              </span>
              <span className="text-base font-mono font-black text-emerald-300 tracking-wider">
                {claimedReward.discountCode}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopyCode(claimedReward.discountCode)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={() => setClaimedReward(null)}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
