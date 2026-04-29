export interface Exercise {
  id: string;
  name: string;
  group: MuscleGroup;
  /** Substitutos quando o usuário não consegue executar */
  alternatives: string[];
  /** GIF/imagem demonstrativa (URL pública) */
  media: string;
  video?: string;
}

export type MuscleGroup =
  | "Peito" | "Costas" | "Pernas" | "Ombros" | "Bíceps" | "Tríceps" | "Core" | "Cardio" | "Glúteos";

/** Catálogo grande de exercícios — cada um com substitutos */
export const EXERCISES: Exercise[] = [
  // PEITO
  { id: "supino-reto-barra", name: "Supino reto com barra", group: "Peito",
    alternatives: ["Supino reto com halteres", "Supino na máquina (Hammer)", "Crucifixo com halteres", "Flexão de braço lastreada"],
    media: "https://media1.tenor.com/m/2roX3uxz_68AAAAd/bench-press.gif" },
  { id: "supino-inclinado-halteres", name: "Supino inclinado com halteres", group: "Peito",
    alternatives: ["Supino inclinado com barra", "Supino inclinado na máquina", "Crucifixo inclinado"],
    media: "https://media1.tenor.com/m/M9aZJgXmkw0AAAAd/incline-dumbbell-press.gif" },
  { id: "crucifixo-halteres", name: "Crucifixo com halteres", group: "Peito",
    alternatives: ["Crossover na polia", "Peck deck (voador)", "Crucifixo inclinado"],
    media: "https://media1.tenor.com/m/tSXq3zrbS6QAAAAd/dumbbell-fly.gif" },
  { id: "flexao", name: "Flexão de braço", group: "Peito",
    alternatives: ["Flexão inclinada", "Flexão declinada", "Supino com halteres leve"],
    media: "https://media1.tenor.com/m/jTzwwZ_qvBAAAAAd/push-up.gif" },

  // COSTAS
  { id: "barra-fixa", name: "Barra fixa", group: "Costas",
    alternatives: ["Puxada alta na polia", "Remada curvada com barra", "Pull-down assistido"],
    media: "https://media1.tenor.com/m/oBXOwaajNvkAAAAd/pull-ups.gif" },
  { id: "puxada-alta", name: "Puxada alta na polia", group: "Costas",
    alternatives: ["Barra fixa assistida", "Pull-over com halter", "Remada baixa"],
    media: "https://media1.tenor.com/m/M-WBkJWxIB8AAAAd/lat-pulldown.gif" },
  { id: "remada-curvada", name: "Remada curvada com barra", group: "Costas",
    alternatives: ["Remada cavalinho", "Remada unilateral com halter", "Remada baixa na polia"],
    media: "https://media1.tenor.com/m/PdEfCk7uV80AAAAd/barbell-row.gif" },
  { id: "remada-unilateral", name: "Remada unilateral com halter", group: "Costas",
    alternatives: ["Remada baixa", "Remada cavalinho", "Remada na máquina"],
    media: "https://media1.tenor.com/m/Aq38KnHcQYUAAAAd/dumbbell-row.gif" },

  // PERNAS
  { id: "agachamento-livre", name: "Agachamento livre com barra", group: "Pernas",
    alternatives: ["Agachamento no Smith", "Leg press 45°", "Hack machine", "Goblet squat"],
    media: "https://media1.tenor.com/m/Q2pMjlvZ2v4AAAAd/squat.gif" },
  { id: "leg-press", name: "Leg press 45°", group: "Pernas",
    alternatives: ["Agachamento no Smith", "Hack machine", "Agachamento goblet"],
    media: "https://media1.tenor.com/m/dhg_xJ6CzZAAAAAd/leg-press.gif" },
  { id: "cadeira-extensora", name: "Cadeira extensora", group: "Pernas",
    alternatives: ["Avanço com halteres", "Búlgaro", "Agachamento sissy"],
    media: "https://media1.tenor.com/m/3c0r-rKjT9wAAAAd/leg-extension.gif" },
  { id: "stiff", name: "Stiff com barra", group: "Pernas",
    alternatives: ["Levantamento terra romeno com halteres", "Mesa flexora", "Bom dia (good morning)"],
    media: "https://media1.tenor.com/m/XZxJl2PzL9UAAAAd/romanian-deadlift.gif" },
  { id: "panturrilha-pe", name: "Panturrilha em pé", group: "Pernas",
    alternatives: ["Panturrilha sentada", "Panturrilha no leg press", "Panturrilha unilateral"],
    media: "https://media1.tenor.com/m/yAdyPYFn3lEAAAAd/calf-raise.gif" },

  // OMBROS
  { id: "desenvolvimento-halteres", name: "Desenvolvimento com halteres", group: "Ombros",
    alternatives: ["Desenvolvimento Arnold", "Desenvolvimento na máquina", "Desenvolvimento militar"],
    media: "https://media1.tenor.com/m/gZFzH4-LCpQAAAAd/shoulder-press.gif" },
  { id: "elevacao-lateral", name: "Elevação lateral", group: "Ombros",
    alternatives: ["Elevação lateral na polia", "Elevação lateral na máquina", "Cuban press"],
    media: "https://media1.tenor.com/m/Z1zCEdKuQK4AAAAd/lateral-raise.gif" },
  { id: "elevacao-frontal", name: "Elevação frontal", group: "Ombros",
    alternatives: ["Elevação frontal com anilha", "Elevação frontal na polia"],
    media: "https://media1.tenor.com/m/0ndEi5kDVhAAAAAd/front-raise.gif" },
  { id: "face-pull", name: "Face pull na polia", group: "Ombros",
    alternatives: ["Crucifixo invertido", "Remada alta", "Pássaro com halteres"],
    media: "https://media1.tenor.com/m/H0mY7oIvJXkAAAAd/face-pull.gif" },

  // BÍCEPS
  { id: "rosca-direta", name: "Rosca direta com barra", group: "Bíceps",
    alternatives: ["Rosca alternada com halteres", "Rosca W", "Rosca na polia"],
    media: "https://media1.tenor.com/m/jjz4F_fO8aMAAAAd/biceps-curl.gif" },
  { id: "rosca-martelo", name: "Rosca martelo", group: "Bíceps",
    alternatives: ["Rosca inversa", "Rosca concentrada", "Rosca corda na polia"],
    media: "https://media1.tenor.com/m/jQjEeDt8jJEAAAAd/hammer-curl.gif" },
  { id: "rosca-scott", name: "Rosca scott", group: "Bíceps",
    alternatives: ["Rosca concentrada", "Rosca na máquina", "Rosca 21"],
    media: "https://media1.tenor.com/m/Lp_UN7g6MwQAAAAd/preacher-curl.gif" },

  // TRÍCEPS
  { id: "triceps-corda", name: "Tríceps na corda", group: "Tríceps",
    alternatives: ["Tríceps na barra", "Tríceps testa", "Mergulho no banco"],
    media: "https://media1.tenor.com/m/3-xm8c_bLN4AAAAd/triceps-pushdown.gif" },
  { id: "triceps-testa", name: "Tríceps testa", group: "Tríceps",
    alternatives: ["Tríceps francês", "Tríceps coice (kickback)", "Mergulho no banco"],
    media: "https://media1.tenor.com/m/RV28UqVgiHsAAAAd/skull-crusher.gif" },
  { id: "mergulho-banco", name: "Mergulho no banco", group: "Tríceps",
    alternatives: ["Tríceps no banco com peso", "Tríceps na barra paralela", "Tríceps testa"],
    media: "https://media1.tenor.com/m/qkU3I9-vYP0AAAAd/bench-dip.gif" },

  // CORE
  { id: "abdominal-crunch", name: "Abdominal crunch", group: "Core",
    alternatives: ["Crunch na polia", "Abdominal na máquina", "Prancha frontal"],
    media: "https://media1.tenor.com/m/9F36XKlvN0gAAAAd/crunch.gif" },
  { id: "prancha", name: "Prancha frontal", group: "Core",
    alternatives: ["Prancha lateral", "Hollow body hold", "Dead bug"],
    media: "https://media1.tenor.com/m/dE9oPuhmaikAAAAd/plank.gif" },
  { id: "elevacao-pernas", name: "Elevação de pernas suspenso", group: "Core",
    alternatives: ["Elevação de pernas deitado", "Joelho ao peito na barra", "Knee raise no paralelo"],
    media: "https://media1.tenor.com/m/2v-Z5n9pXxsAAAAd/leg-raise.gif" },

  // GLÚTEOS
  { id: "elevacao-pelvica", name: "Elevação pélvica com barra", group: "Glúteos",
    alternatives: ["Hip thrust na máquina", "Glúteo na polia", "Coice na máquina"],
    media: "https://media1.tenor.com/m/AnYvT_FQbUkAAAAd/hip-thrust.gif" },
  { id: "afundo", name: "Afundo (avanço) com halteres", group: "Glúteos",
    alternatives: ["Búlgaro", "Passada caminhando", "Agachamento sumô"],
    media: "https://media1.tenor.com/m/X2pFOmNqmjkAAAAd/lunge.gif" },

  // CARDIO
  { id: "esteira", name: "Esteira (corrida leve)", group: "Cardio",
    alternatives: ["Bicicleta ergométrica", "Elíptico", "Pular corda"],
    media: "https://media1.tenor.com/m/V79g3qE3jD8AAAAd/treadmill.gif" },
];

export function findExercise(id: string) {
  return EXERCISES.find((e) => e.id === id);
}