import acelerador from "@/assets/char-acelerador.png";
import estrategico from "@/assets/char-estrategico.png";
import patrimonial from "@/assets/char-patrimonial.png";
import visionario from "@/assets/char-visionario.png";
import conservador from "@/assets/char-conservador.png";

export type ProfileKey = "acelerador" | "estrategico" | "conservador" | "visionario" | "patrimonial";

export interface Profile {
  key: ProfileKey;
  name: string;
  character: string;
  image: string;
  colorVar: string;
  title: string;
  description: string;
  phrase: string;
  hook: string;
  strengths: string[];
}

export const PROFILES: Record<ProfileKey, Profile> = {
  acelerador: {
    key: "acelerador",
    name: "Acelerador",
    character: "Acelerador",
    image: acelerador,
    colorVar: "var(--acelerador)",
    title: "Você possui perfil de ação e conquista.",
    description:
      "Você gosta de crescimento rápido, movimento e oportunidades. Normalmente busca formas mais inteligentes de acelerar objetivos sem comprometer totalmente sua renda.",
    phrase: "Quem age primeiro normalmente conquista antes.",
    hook: "Seu perfil costuma se adaptar muito bem a planejamentos de aquisição inteligente.",
    strengths: ["Decisão rápida", "Energia para agir", "Foco em resultado"],
  },
  estrategico: {
    key: "estrategico",
    name: "Estratégico",
    character: "Estratégico",
    image: estrategico,
    colorVar: "var(--estrategico)",
    title: "Você possui perfil analítico e inteligente.",
    description:
      "Você prefere decisões conscientes, economia no longo prazo e crescimento sustentável.",
    phrase: "Inteligência financeira não é gastar menos. É decidir melhor.",
    hook: "Ferramentas de planejamento patrimonial costumam fazer muito sentido para pessoas com seu perfil.",
    strengths: ["Análise profunda", "Visão lógica", "Planejamento sólido"],
  },
  conservador: {
    key: "conservador",
    name: "Conservador",
    character: "Conservador",
    image: conservador,
    colorVar: "var(--conservador)",
    title: "Você possui perfil construtor de patrimônio.",
    description:
      "Você pensa em crescimento sólido, bens e valorização patrimonial.",
    phrase: "Patrimônio não nasce do acaso. Nasce de estratégia.",
    hook: "Seu perfil normalmente busca formas seguras e eficientes de aquisição.",
    strengths: ["Visão de bens", "Construção sólida", "Foco em valorização"],
  },
  visionario: {
    key: "visionario",
    name: "Visionário",
    character: "Visionário",
    image: visionario,
    colorVar: "var(--visionario)",
    title: "Você possui visão de futuro acima da média.",
    description:
      "Você pensa além do presente e costuma buscar decisões que tragam impacto no longo prazo.",
    phrase: "Quem pensa no futuro hoje vive melhor amanhã.",
    hook: "Planejamento financeiro e construção patrimonial combinam muito com seu perfil.",
    strengths: ["Visão de longo prazo", "Pensamento expansivo", "Mentalidade de evolução"],
  },
  patrimonial: {
    key: "patrimonial",
    name: "Patrimonial",
    character: "Patrimonial",
    image: patrimonial,
    colorVar: "var(--patrimonial)",
    title: "Você valoriza estabilidade e segurança.",
    description:
      "Você prefere crescimento seguro, previsível e com menor exposição emocional.",
    phrase: "Segurança financeira também é liberdade.",
    hook: "Seu perfil normalmente prefere ferramentas previsíveis e organizadas de construção patrimonial.",
    strengths: ["Equilíbrio", "Proteção", "Decisões seguras"],
  },
};

export interface QuizOption {
  label: string;
  profile: ProfileKey;
}
export interface QuizQuestion {
  title: string;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    title: "O que você mais deseja conquistar nos próximos anos?",
    options: [
      { label: "Minha casa própria", profile: "conservador" },
      { label: "Trocar ou comprar carro", profile: "acelerador" },
      { label: "Começar a investir melhor", profile: "estrategico" },
      { label: "Construir patrimônio para o futuro", profile: "visionario" },
      { label: "Ter mais estabilidade financeira", profile: "patrimonial" },
    ],
  },
  {
    title: "Qual dessas frases combina mais com você?",
    options: [
      { label: "“Quero conquistar rápido.”", profile: "acelerador" },
      { label: "“Prefiro pagar menos no longo prazo.”", profile: "estrategico" },
      { label: "“Quero segurança nas decisões.”", profile: "patrimonial" },
      { label: "“Penso muito no meu futuro.”", profile: "visionario" },
      { label: "“Quero transformar renda em patrimônio.”", profile: "conservador" },
    ],
  },
  {
    title: "Como você costuma tomar decisões financeiras?",
    options: [
      { label: "Aproveito oportunidades rápidas", profile: "acelerador" },
      { label: "Analiso tudo antes de decidir", profile: "estrategico" },
      { label: "Evito riscos desnecessários", profile: "patrimonial" },
      { label: "Planejo pensando em crescimento futuro", profile: "visionario" },
      { label: "Penso em valorização e aquisição de bens", profile: "conservador" },
    ],
  },
  {
    title: "Qual dessas opções parece mais inteligente para você?",
    options: [
      { label: "Parcelas menores e planejamento", profile: "estrategico" },
      { label: "Investir para conquistar patrimônio", profile: "conservador" },
      { label: "Garantir estabilidade antes de crescer", profile: "patrimonial" },
      { label: "Criar oportunidades futuras", profile: "visionario" },
      { label: "Conseguir resultados mais rápidos", profile: "acelerador" },
    ],
  },
  {
    title: "Se hoje você recebesse um crédito aprovado, qual seria seu foco?",
    options: [
      { label: "Imóvel", profile: "conservador" },
      { label: "Veículo", profile: "acelerador" },
      { label: "Investimento", profile: "estrategico" },
      { label: "Expansão patrimonial", profile: "visionario" },
      { label: "Reserva e segurança financeira", profile: "patrimonial" },
    ],
  },
];
