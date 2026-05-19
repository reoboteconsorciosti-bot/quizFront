import { createFileRoute } from "@tanstack/react-router";
import { QuizApp } from "@/components/quiz/QuizApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa da Conquista — Descubra seu Perfil de Conquista" },
      { name: "description", content: "Em menos de 2 minutos, descubra como sua mente financeira toma decisões e qual estratégia de consórcio combina mais com você." },
      { property: "og:title", content: "Mapa da Conquista" },
      { property: "og:description", content: "Teste comportamental que revela seu perfil financeiro de conquista." },
    ],
  }),
  component: Index,
});

function Index() {
  return <QuizApp />;
}
