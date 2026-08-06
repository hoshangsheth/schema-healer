import { Accordion, type AccordionItem } from "@/components/shared/accordion";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";

/** Answers describe what the service actually does today. */
const ITEMS: AccordionItem[] = [
  {
    question: "What files can I upload?",
    answer:
      "CSV files. The separator is detected automatically, so exports using commas, semicolons, tabs or pipes all read correctly. Anything that is not a CSV is turned away before processing starts.",
  },
  {
    question: "How does it decide what a column is?",
    answer:
      "Three attempts, in order. A built-in list of known field names and their common variations is checked first. Whatever is left is compared against your field list, and weak matches are refused rather than guessed. Only then does an AI model see the remaining names, and its answers are checked against your field list before they are accepted.",
  },
  {
    question: "Do you show a confidence percentage?",
    answer:
      "No, and that is deliberate. The service reports how each column was matched, not a numeric score, so the interface shows the method and its strength rather than inventing a number that would look more precise than the decision behind it.",
  },
  {
    question: "What happens if a column cannot be matched?",
    answer:
      "It keeps its original name in the rebuilt file. The checks raise a flag for it, the report marks the run as needing review, and the column is listed so you can decide what to do. Nothing is quietly dropped or guessed.",
  },
  {
    question: "What if the AI step is unavailable?",
    answer:
      "Recovery still completes. If the model cannot be reached, the run falls back to what the first two methods found, leaves the remaining columns unmatched, and reports them for review instead of failing outright.",
  },
  {
    question: "Can I see the changes before I use the file?",
    answer:
      "That is the point of the report. Every column is listed with the name it arrived as, the field it was matched to, and how that match was made, alongside the checks run on the rebuilt file.",
  },
  {
    question: "Is my data stored?",
    answer:
      "The uploaded file is processed in memory to produce the report and the rebuilt file. Nothing is written to disk by the recovery service. The rebuilt file is returned to your browser and downloaded from there.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. Upload a file in the workspace and the work happens on the server. The same behaviour is available as an API endpoint, which returns either the report or the rebuilt file.",
  },
];

export function Faq() {
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Questions worth asking before you trust an automatic rename"
          description="If anything here is unclear, the report in the workspace shows the same information for your own file."
        />

        <Reveal index={1}>
          <Accordion items={ITEMS} />
        </Reveal>
      </div>
    </Section>
  );
}
