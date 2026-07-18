import type { PlayerProfile } from "../../domain/entities/player";

type FormScreenProps = {
  step: number;
  formData: PlayerProfile;
  canAdvance: boolean;
  onChange: (field: keyof PlayerProfile, value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

const FIELDS: Array<{
  key: keyof PlayerProfile;
  title: string;
  subtitle: string;
  type: "text" | "date" | "time" | "textarea" | "select";
  placeholder: string;
  options?: Array<{ value: string; label: string }>;
}> = [
  {
    key: "name",
    title: "Nome no ritual",
    subtitle: "As entidades devem saber com quem estao falando.",
    type: "text",
    placeholder: "Digite seu nome",
  },
  {
    key: "sex",
    title: "Sexo",
    subtitle: "Selecione uma opcao para calibrar a leitura.",
    type: "select",
    placeholder: "Selecione",
    options: [
      { value: "masculino", label: "Masculino" },
      { value: "feminino", label: "Feminino" },
    ],
  },
  {
    key: "birthDate",
    title: "Data de nascimento",
    subtitle: "Essa data ancora sua assinatura espiritual.",
    type: "date",
    placeholder: "",
  },
  {
    key: "birthTime",
    title: "Hora de nascimento",
    subtitle: "A hora ajuda no ajuste fino da leitura.",
    type: "time",
    placeholder: "",
  },
  {
    key: "question",
    title: "Pergunta para as entidades",
    subtitle: "Quanto mais objetiva a pergunta, mais nítida a resposta.",
    type: "textarea",
    placeholder: "Digite sua pergunta",
  },
];

export const FormScreen = ({
  step,
  formData,
  canAdvance,
  onChange,
  onBack,
  onNext,
  onSubmit,
}: FormScreenProps) => {
  const field = FIELDS[step];
  const isLast = step === FIELDS.length - 1;
  const progress = ((step + 1) / FIELDS.length) * 100;

  return (
    <section className="screen form-screen">
      <img
        className="screen-bg"
        src="/assets/fundo2.jpg"
        alt="Fundo do ritual"
      />
      <div className="screen-shade" />

      <div className="panel form-panel">
        <p className="screen-kicker">Formulario</p>
        <h2>Dados as Entidades</h2>
        <p className="screen-subtitle">
          Passo {step + 1} de {FIELDS.length}
        </p>

        <div className="form-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="field-block">
          <label htmlFor={field.key}>{field.title}</label>
          <p>{field.subtitle}</p>

          {field.type === "textarea" ? (
            <textarea
              id={field.key}
              value={formData[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
              placeholder={field.placeholder}
              rows={4}
            />
          ) : field.type === "select" ? (
            <select
              id={field.key}
              value={formData[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.key}
              type={field.type}
              value={formData[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
              placeholder={field.placeholder}
            />
          )}
        </div>

        <div className="actions-row">
          <button
            type="button"
            className="btn ghost"
            onClick={onBack}
            disabled={step === 0}
          >
            Voltar
          </button>

          {isLast ? (
            <button
              type="button"
              className="btn"
              onClick={onSubmit}
              disabled={!canAdvance}
            >
              Ir para o deck
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              onClick={onNext}
              disabled={!canAdvance}
            >
              Proximo passo
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
