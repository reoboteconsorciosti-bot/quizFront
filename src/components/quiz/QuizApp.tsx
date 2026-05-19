import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, Sparkles, Check, Trophy, MessageCircle, Shield, Zap } from "lucide-react";
import { Particles } from "./Particles";
import { PROFILES, QUESTIONS, type ProfileKey } from "./data";

type Stage = "intro" | "quiz" | "reveal" | "lead" | "success";

const objectives = ["Imóvel", "Veículo", "Investimento", "Patrimônio"] as const;

const consultants = [
  "EDUARDO",
  "ISABELI",
  "JESSICA",
  "JONAS",
  "KAREN",
  "KASSIO",
  "LUCAS ROQUES",
  "MURILO",
  "RAPHAEL"
] as const;

export function QuizApp() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<ProfileKey, number>>({
    acelerador: 0, estrategico: 0, conservador: 0, visionario: 0, patrimonial: 0,
  });
  const [selected, setSelected] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consultant, setConsultant] = useState<typeof consultants[number] | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((step + (stage === "quiz" ? 0 : 1)) / QUESTIONS.length) * 100;

  const { primary, secondary, isHybrid, total } = useMemo(() => {
    const sorted = (Object.entries(scores) as [ProfileKey, number][])
      .sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, [, v]) => s + v, 0) || 1;
    return {
      primary: sorted[0][0],
      secondary: sorted[1][0],
      isHybrid: sorted[0][1] === sorted[1][1] && sorted[0][1] > 0,
      total,
    };
  }, [scores]);

  const compatibility = Math.min(99, Math.round((scores[primary] / total) * 100) + 35);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const profile = QUESTIONS[step].options[idx].profile;
    setScores((s) => ({ ...s, [profile]: s[profile] + 2 }));
    setTimeout(() => {
      setSelected(null);
      if (step + 1 < QUESTIONS.length) {
        setStep(step + 1);
      } else {
        setStage("reveal");
        setTimeout(() => fireConfetti(0.4), 600);
      }
    }, 550);
  };

  const sendDataToBackend = async (finalProfile: ProfileKey) => {
    if (!name || !whatsapp || !consultant || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const cleanPhone = whatsapp.replace(/\D/g, "");
      const finalPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
      const profileName = `Perfil ${PROFILES[finalProfile].name}`;

      const response = await fetch("http://localhost:3001/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name,
          telefone: finalPhone,
          perfil: finalProfile,
          perfil_nome: profileName,
          consultor: consultant,
          tag: "quiz",
        }),
      });

      if (!response.ok) throw new Error("Falha ao enviar dados finais");

      setStage("success");
    } catch (error) {
      console.error("Erro ao enviar dados finais:", error);
      // Mesmo com erro, avançamos para a tela de sucesso para não travar o usuário
      setStage("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fireConfetti = (intensity = 1) => {
    confetti({
      particleCount: Math.round(120 * intensity),
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#3B82F6", "#60A5FA", "#93C5FD", "#1D4ED8", "#FFFFFF"],
    });
  };

  const resetQuiz = () => {
    setStage("intro");
    setStep(0);
    setScores({
      acelerador: 0, estrategico: 0, conservador: 0, visionario: 0, patrimonial: 0,
    });
    setName("");
    setWhatsapp("");
    setConsultant("");
    setIsSubmitting(false);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !consultant) return;
    setStage("quiz");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-aurora">
      <Particles count={22} />
      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-md" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            MAPA DA <span className="text-shimmer">CONQUISTA</span>
          </span>
        </div>
        <div className="hidden items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
          <Shield className="h-3.5 w-3.5" />
          Teste comportamental · 2 min
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-3xl flex-col items-center justify-start px-5 pb-10 pt-2 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 flex w-full flex-col items-center justify-center pl-4 sm:pl-8"
        >
          <img 
             src="/icons/reobote_logo_transparente.png" 
             alt="Reobote Logo" 
             className="h-28 w-auto object-contain sm:h-60"
           />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {stage === "intro" && <Intro key="intro" onStart={() => setStage("lead")} />}
          {stage === "lead" && (
            <LeadForm
              key="lead"
              name={name} setName={setName}
              whatsapp={whatsapp} setWhatsapp={setWhatsapp}
              consultant={consultant} setConsultant={setConsultant}
              onSubmit={handleSubmitLead}
              onReset={resetQuiz}
              isSubmitting={isSubmitting}
            />
          )}
          {stage === "quiz" && (
            <Quiz
              key={`q-${step}`}
              step={step}
              progress={progress}
              selected={selected}
              onSelect={handleSelect}
            />
          )}
          {stage === "reveal" && (
            <Reveal
              key="reveal"
              primary={primary}
              secondary={secondary}
              isHybrid={isHybrid}
              compatibility={compatibility}
              onContinue={() => sendDataToBackend(primary)}
              onReset={resetQuiz}
              isSubmitting={isSubmitting}
            />
          )}
          {stage === "success" && <Success key="success" primary={primary} onReset={resetQuiz} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ---------- INTRO ---------- */
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-primary"
      >
        <Zap className="h-3.5 w-3.5" />
        Inteligência comportamental financeira
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl"
      >
        Descubra qual é o seu{" "}
        <span className="text-shimmer">Perfil de Conquista</span>.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7 }}
        className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
      >
        Em menos de 2 minutos, descubra como sua mente financeira toma decisões
        e qual estratégia combina mais com você.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <button onClick={onStart} className="btn-hero animate-pulse-glow">
          COMEÇAR AGORA
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> 5 perguntas</span>
          <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> 100% gratuito</span>
          <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> Resultado instantâneo</span>
        </div>
      </motion.div>

      {/* Floating profile chips */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        className="mt-14 flex flex-wrap items-center justify-center gap-2"
      >
        {Object.values(PROFILES).map((p, i) => (
          <motion.div
            key={p.key}
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 + i * 0.08 }}
            className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium"
            style={{ color: p.colorVar }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: p.colorVar }} />
            {p.character}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

/* ---------- QUIZ ---------- */
function Quiz({
  step, progress, selected, onSelect,
}: { step: number; progress: number; selected: number | null; onSelect: (i: number) => void }) {
  const q = QUESTIONS[step];
  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Etapa {step + 1} de {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          />
        </div>
      </div>

      <motion.h2
        key={q.title}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        {q.title}
      </motion.h2>

      <div className="mt-6 grid gap-3">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const profileColor = PROFILES[opt.profile].colorVar;
          return (
            <motion.button
              key={opt.label}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelect(i)}
              className={`option-card flex w-full items-center gap-3 text-left ${isSelected ? "selected" : ""}`}
              style={isSelected ? { borderColor: profileColor as string, boxShadow: `0 0 0 4px color-mix(in oklab, ${profileColor} 22%, transparent)` } : undefined}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors"
                style={{
                  background: isSelected ? (profileColor as string) : "color-mix(in oklab, var(--primary) 8%, white)",
                  color: isSelected ? "white" : "var(--primary)",
                }}
              >
                {isSelected ? <Check className="h-4 w-4" strokeWidth={3} /> : String.fromCharCode(65 + i)}
              </div>
              <span className="flex-1 text-sm font-medium text-foreground sm:text-base">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}

/* ---------- REVEAL ---------- */
function Reveal({
  primary, secondary, isHybrid, compatibility, onContinue, onReset, isSubmitting,
}: { 
  primary: ProfileKey; 
  secondary: ProfileKey; 
  isHybrid: boolean; 
  compatibility: number; 
  onContinue: () => void; 
  onReset: () => void;
  isSubmitting: boolean;
}) {
  const p = PROFILES[primary];
  const s = PROFILES[secondary];
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold text-primary"
      >
        <Trophy className="h-3.5 w-3.5" /> Seu perfil dominante
      </motion.div>

      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 14 }}
        className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64"
      >
        <div className="absolute inset-0 rounded-full blur-3xl opacity-60"
             style={{ background: `radial-gradient(circle, ${p.colorVar}, transparent 70%)` }} />
        <img src={p.image} alt={p.character} className="relative h-full w-full object-contain drop-shadow-2xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      >
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest" style={{ color: p.colorVar }}>
          {p.character}
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Perfil {p.name}
        </h2>
        {isHybrid && (
          <p className="mt-2 text-sm text-muted-foreground">
            Você possui traços de <strong style={{ color: p.colorVar }}>{p.name}</strong> + <strong style={{ color: s.colorVar }}>{s.name}</strong>.
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        className="mx-auto mt-6 max-w-md rounded-3xl glass p-5 shadow-lg"
      >
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Compatibilidade</span>
          <span className="font-bold" style={{ color: p.colorVar }}>{compatibility}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${compatibility}%` }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${p.colorVar}, var(--primary-glow))` }}
          />
        </div>
        <p className="mt-4 text-left text-sm leading-relaxed text-foreground">{p.description}</p>
        <p className="mt-3 text-left text-sm font-semibold italic" style={{ color: p.colorVar }}>
          “{p.phrase}”
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.strengths.map((str) => (
            <span key={str} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {str}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <motion.button
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          onClick={onContinue}
          disabled={isSubmitting}
          className="btn-hero w-full max-w-xs disabled:opacity-70"
        >
          {isSubmitting ? "Enviando..." : "Ver meu perfil completo"}
          <ArrowRight className="h-4 w-4" />
        </motion.button>

        <motion.button
          onClick={onReset}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:text-foreground"
        >
          VOLTAR AO INÍCIO
        </motion.button>
      </div>
    </motion.section>
  );
}

/* ---------- LEAD ---------- */
function LeadForm({
  name, setName, whatsapp, setWhatsapp, consultant, setConsultant, onSubmit, onReset, isSubmitting,
}: {
  name: string; setName: (v: string) => void;
  whatsapp: string; setWhatsapp: (v: string) => void;
  consultant: string; setConsultant: (v: typeof consultants[number]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isSubmitting: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Para começar, <span className="text-shimmer">preencha seus dados</span>.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sua análise personalizada será enviada para o seu WhatsApp ao final do teste.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mx-auto mt-6 max-w-md space-y-4 rounded-3xl glass p-5 sm:p-6 shadow-xl">
        <Field label="Nome">
          <input
            required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
        </Field>
        <Field label="WhatsApp">
          <input
            required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="(00) 00000-0000" inputMode="tel"
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
        </Field>

        <Field label="Escolher consultor">
          <select
            required
            value={consultant}
            onChange={(e) => setConsultant(e.target.value as any)}
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-card text-muted-foreground">Selecione um consultor</option>
            {consultants.map((c) => (
              <option key={c} value={c} className="bg-card text-foreground">
                {c}
              </option>
            ))}
          </select>
        </Field>

        <button type="submit" disabled={isSubmitting} className="btn-hero w-full !rounded-2xl disabled:opacity-70">
          {isSubmitting ? "ENVIANDO..." : "COMEÇAR"}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </button>

        <button 
          type="button" 
          onClick={onReset}
          className="w-full rounded-2xl border border-border bg-transparent py-3 text-xs font-semibold tracking-wider text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
        >
          VOLTAR AO INÍCIO
        </button>
        <p className="text-center text-[11px] text-muted-foreground">
          🔒 Seus dados estão seguros. Nunca compartilharemos suas informações.
        </p>
      </form>
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl border border-border bg-card/60 px-4 py-3 transition-all focus-within:border-primary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)]">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

/* ---------- SUCCESS ---------- */
function Success({ primary, onReset }: { primary: ProfileKey; onReset: () => void }) {
  const p = PROFILES[primary];
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.1 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-2xl"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Check className="h-10 w-10 text-white" strokeWidth={3} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
      >
        🎉 Parabéns, perfil registrado!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base"
      >
        Agora um consultor especializado irá liberar seu conteúdo personalizado de{" "}
        <strong style={{ color: p.colorVar }}>Perfil {p.name}</strong>.
      </motion.p>

      <div className="mt-8 flex flex-col items-center gap-4">
        <motion.a
          href="https://wa.me/" target="_blank" rel="noreferrer"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="btn-hero w-full max-w-xs"
        >
          <MessageCircle className="h-4 w-4" />
          FALAR COM CONSULTOR
        </motion.a>

        <motion.button
          onClick={onReset}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:text-foreground"
        >
          VOLTAR AO INÍCIO
        </motion.button>
      </div>
    </motion.section>
  );
}
