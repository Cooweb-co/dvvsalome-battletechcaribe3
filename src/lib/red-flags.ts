/**
 * Detección local de señales de alarma. Corre en el navegador mientras la persona
 * escribe, para avisar de inmediato sin depender de la respuesta de la IA.
 * Es deliberadamente sensible: preferimos un falso positivo a un aviso tardío.
 */
interface RedFlagRule {
  pattern: RegExp;
  message: string;
}

const RULES: RedFlagRule[] = [
  {
    pattern: /dolor (fuerte |intenso |opresivo )?(en el )?pecho|dolor tor[áa]cico|opresi[óo]n en el pecho/i,
    message: "Dolor en el pecho",
  },
  {
    pattern: /no puedo respirar|dificultad (para )?respirar|falta de aire|ahogo|disnea/i,
    message: "Dificultad para respirar",
  },
  {
    pattern: /desmay|p[ée]rdida de (la )?consciencia|inconsciente|convulsi/i,
    message: "Desmayo o convulsiones",
  },
  {
    pattern: /no puedo mover|par[áa]lisis|se me tuerce la (cara|boca)|hablar arrastrado|no puedo hablar/i,
    message: "Posible déficit neurológico",
  },
  {
    pattern: /sangrado abundante|hemorragia|vomito sangre|vómito con sangre|sangre en (las )?heces/i,
    message: "Sangrado importante",
  },
  {
    pattern: /rigidez de nuca|cuello r[íi]gido/i,
    message: "Rigidez de nuca con fiebre",
  },
  {
    pattern: /quiero morir|suicid|hacerme daño|no quiero vivir/i,
    message: "Malestar emocional grave",
  },
  {
    pattern: /peor dolor de (cabeza|mi vida)|dolor de cabeza s[úu]bito/i,
    message: "Cefalea súbita e intensa",
  },
];

export function detectRedFlags(text: string): string[] {
  if (text.trim().length < 4) return [];

  const found = new Set<string>();
  for (const rule of RULES) {
    if (rule.pattern.test(text)) found.add(rule.message);
  }
  return [...found];
}

export const EMERGENCY_NUMBER = "123";
