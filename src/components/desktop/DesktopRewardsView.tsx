import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  Copy, 
  Coffee, 
  BookOpen, 
  ShoppingBag, 
  Trees, 
  ChevronRight,
  Droplets,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PartnerReward } from '../../types';

export const DesktopRewardsView: React.FC = () => {
  const { 
    currentUser, 
    rewards, 
    redeemReward, 
    playActionSound 
  } = useApp();

  const [claimedReward, setClaimedReward] = useState<PartnerReward | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRedeem = (reward: PartnerReward) => {
    setErrorMsg('');
    if (!currentUser || currentUser.ecoPoints < reward.pointsCost) {
      setErrorMsg('Pontos insuficientes para resgatar esta recompensa. Descarte mais resíduos nos PEVs de Manaus para ganhar pontos!');
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

  const getPartnerIcon = (category: string) => {
    switch (category) {
      case 'alimentos': return Coffee;
      case 'educacao': return BookOpen;
      case 'moda': return ShoppingBag;
      case 'plantas': return Trees;
      default: return Gift;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 text-white">
      
      {/* Header and User Points Wallet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            <span>Recompensas & Parcerias Ecológicas de Manaus</span>
          </h1>
          <p className="text-xs lg:text-sm text-stone-400 mt-1">
            Troque os ecopontos conquistados por descontos e benefícios em iniciativas sustentáveis locais.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-stone-900 border border-stone-800 p-4 rounded-2xl shadow-sm">
          <div>
            <div className="text-[11px] text-stone-400 font-mono uppercase">Saldo Disponível</div>
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
              {currentUser?.ecoPoints ?? 340} pts
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const Icon = getPartnerIcon(reward.category);
          const canAfford = (currentUser?.ecoPoints ?? 0) >= reward.pointsCost;

          return (
            <div
              key={reward.id}
              className={`p-6 rounded-3xl border transition flex flex-col justify-between bg-stone-900 shadow-md ${
                canAfford
                  ? 'border-stone-800 hover:border-emerald-500/50'
                  : 'border-stone-800/60 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs tabular-nums">
                    {reward.pointsCost} pts
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {reward.partnerName}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 leading-snug">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    {reward.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-500 uppercase">
                  Validade: 30 dias
                </span>

                <button
                  onClick={() => {
                    playActionSound();
                    handleRedeem(reward);
                  }}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    canAfford
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md shadow-emerald-500/20'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <span>Resgatar Cupom</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claimed Voucher Modal */}
      {claimedReward && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-white">Recompensa Resgatada com Sucesso!</h3>
              <p className="text-xs text-stone-300 mt-1">
                Apresente este código no parceiro <strong>{claimedReward.partnerName}</strong> em Manaus.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-2">
              <div className="text-[10px] text-stone-400 font-mono uppercase">Seu Código de Cupom:</div>
              <div className="text-xl font-mono font-black text-emerald-400 tracking-wider">
                {claimedReward.discountCode}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopyCode(claimedReward.discountCode)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-stone-700 transition"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
              </button>

              <button
                onClick={() => setClaimedReward(null)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs transition"
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
