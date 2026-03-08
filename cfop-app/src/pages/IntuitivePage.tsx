import { CfopPageLayout } from '../components/CfopPageLayout';
import 'bulma/css/bulma.min.css';
import '../App.css';
import { useMemo, useState } from 'react';

interface ExampleCase {
  id: string;
  label: string;
  image: string;
  alt: string;
  moveHint?: string;
}

const CROSS_CASES: ExampleCase[] = [
  {
    id: 'cross-positioned-not-oriented',
    label: 'positioned not oriented',
    image: '/cubing.spec/assets/cfop_bgr/cross_case2.png',
    alt: 'Cross case: white edge positioned but not oriented.',
  },
  {
    id: 'cross-oriented-not-positioned',
    label: 'oriented not positioned',
    image: '/cubing.spec/assets/cfop_bgr/cross_case3.png',
    alt: 'Cross case: white edge oriented but in the wrong slot.',
  },
  {
    id: 'cross-flipped',
    label: 'flipped',
    image: '/cubing.spec/assets/cfop_bgr/cross_case4.png',
    alt: 'Cross case: white edge flipped and needs extraction and reinsertion.',
  },
];

const F2L_STEP1_CASES: ExampleCase[] = [
  {
    id: 'f2l-step1-connected-right',
    label: 'connected right pair',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case1_insert1.png',
    alt: 'F2L easy insert: connected right pair.',
    moveHint: "U R U' R'",
  },
  {
    id: 'f2l-step1-connected-left',
    label: 'connected left pair',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case1_insert2.png',
    alt: 'F2L easy insert: connected left pair.',
    moveHint: "U' L' U L",
  },
  {
    id: 'f2l-step1-disconnected-right',
    label: 'disconnected right pair',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case1_insert3.png',
    alt: 'F2L easy insert: disconnected right pair.',
    moveHint: "R U R'",
  },
  {
    id: 'f2l-step1-disconnected-left',
    label: 'disconnected left pair',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case1_insert4.png',
    alt: 'F2L easy insert: disconnected left pair.',
    moveHint: "L' U' L",
  },
];

const F2L_STEP2_CASES: ExampleCase[] = [
  {
    id: 'f2l-step2-edge-in-slot-corner-in-layer',
    label: 'edge in slot + corner in layer',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case2_stuck1.png',
    alt: 'F2L setup: edge in slot and corner in top layer.',
    moveHint: "R U R' ...",
  },
  {
    id: 'f2l-step2-corner-in-slot-edge-in-layer',
    label: 'corner in slot + edge in layer',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case2_stuck2.png',
    alt: 'F2L setup: corner in slot and edge in top layer.',
    moveHint: "R U R' ...",
  },
  {
    id: 'f2l-step2-pair-misaligned-in-slot',
    label: 'pair misaligned in slot',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case2_stuck3.png',
    alt: 'F2L setup: pair misaligned in slot.',
    moveHint: "R U' R' ...",
  },
  {
    id: 'f2l-step2-pair-misaligned-in-layer',
    label: 'pair misaligned in layer',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case2_stuck4.png',
    alt: 'F2L setup: pair misaligned in top layer.',
    moveHint: "R U2 R' ...",
  },
];

const F2L_STEP3_CASES: ExampleCase[] = [
  {
    id: 'f2l-step3-white-side-colours-match',
    label: 'white to side + colours match',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case3_setup1.png',
    alt: 'F2L insert setup: white to side and colours match.',
  },
  {
    id: 'f2l-step3-white-side-colours-not-match',
    label: 'white to side + colours not match',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case3_setup2.png',
    alt: 'F2L insert setup: white to side and colours do not match.',
  },
  {
    id: 'f2l-step3-white-up',
    label: 'white is up',
    image: '/cubing.spec/assets/cfop_bgr/f2l_case3_setup3.png',
    alt: 'F2L insert setup: white sticker facing up.',
  },
];

function sanitizeMoveHint(moveHint?: string): string | undefined {
  if (!moveHint) return undefined;
  return moveHint.includes('...') ? undefined : moveHint;
}

function useMoveHintSafeCases(cases: ExampleCase[]) {
  return useMemo(
    () => cases.map(item => ({ ...item, moveHint: sanitizeMoveHint(item.moveHint) })),
    [cases],
  );
}

function CaseCards({ cases, columnsClass }: { cases: ExampleCase[]; columnsClass: string }) {
  const [missingImages, setMissingImages] = useState<Record<string, boolean>>({});

  return (
    <div className="columns is-multiline mt-3">
      {cases.map(item => {
        const missing = missingImages[item.id] ?? false;
        return (
          <div key={item.id} className={columnsClass}>
            <div className="card intuitive-case-card">
              <div className="card-content has-text-centered">
                <h4 className="intuitive-case-label">{item.label}</h4>
                {!missing ? (
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="intuitive-case-image"
                    onError={() => setMissingImages(prev => ({ ...prev, [item.id]: true }))}
                    loading="lazy"
                  />
                ) : (
                  <div className="intuitive-image-fallback" role="status" aria-live="polite">
                    Image unavailable
                  </div>
                )}
                {item.moveHint && <p className="intuitive-move-hint mt-2">{item.moveHint}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function IntuitivePage() {
  const step1Cases = useMoveHintSafeCases(F2L_STEP1_CASES);
  const step2Cases = useMoveHintSafeCases(F2L_STEP2_CASES);
  const step3Cases = useMoveHintSafeCases(F2L_STEP3_CASES);

  return (
    <CfopPageLayout
      pageTitle="Intuitive Methods"
      subtitle="Learn Cross and F2L through pattern recognition and piece logic before algorithm-heavy practice."
    >
      <section className="section intuitive-section">
        <h2 className="title is-4 section-title">Intuitive Cross</h2>
        <p className="intuitive-note">
          The goal of this step is to solve first-layer edges so white edges align with their matching side
          centres. The Cross can always be solved in 8 moves or fewer. Keep white on bottom, start with easier
          cases, avoid disrupting solved edges, remember opposite colours (red/orange, green/blue), and avoid
          unnecessary cube rotations.
        </p>
        <ul className="intuitive-list">
          <li>
            If a white edge is positioned but not oriented (for example in the yellow face), align it to the
            matching side centre and rotate it to the target slot.
          </li>
          <li>If a white edge is oriented but not positioned, take it out and reinsert into the target slot.</li>
          <li>
            If a white edge is flipped, take it out, open the target slot safely, then reinsert it correctly.
          </li>
        </ul>
        <CaseCards cases={CROSS_CASES} columnsClass="column is-one-third-desktop is-half-tablet" />
      </section>

      <section className="section intuitive-section">
        <h2 className="title is-4 section-title">Intuitive F2L</h2>
        <p className="intuitive-note">
          The goal is to solve the first two layers by pairing corners and edges, then inserting those pairs into
          slots around the Cross. Focus on repeatable patterns and setup ideas rather than memorizing long lists.
        </p>

        <h3 className="title is-5 intuitive-step-title">Step 1: easy inserts</h3>
        <ul className="intuitive-list">
          <li>
            If matching colours face up, hold the cube so the matched side is on the working side, push pair
            aside, open slot, insert, then close slot.
          </li>
          <li>
            If different colours face up, hold so white faces the working side, set up the pair, insert, then
            realign the Cross.
          </li>
        </ul>
        <CaseCards cases={step1Cases} columnsClass="column is-one-quarter-desktop is-half-tablet" />

        <h3 className="title is-5 intuitive-step-title">Step 2: setup pairs</h3>
        <ul className="intuitive-list">
          <li>Find an edge-corner pair.</li>
          <li>Set up an easy-insert style case with the pair disconnected in the top layer.</li>
          <li>Insert the aligned pair without breaking solved slots.</li>
        </ul>
        <CaseCards cases={step2Cases} columnsClass="column is-one-quarter-desktop is-half-tablet" />

        <h3 className="title is-5 intuitive-step-title">Step 3: insert pairs</h3>
        <ul className="intuitive-list">
          <li>
            If white is on the side and colours match, move the edge next to the corner to set up an insert case.
          </li>
          <li>
            If white is on the side and colours do not match, move the edge across from the corner to set up an
            insert case.
          </li>
          <li>
            If white is up, move the edge over its centre, move it to safety, then position the corner over the
            edge to form an insert case.
          </li>
        </ul>
        <CaseCards cases={step3Cases} columnsClass="column is-one-third-desktop is-half-tablet" />
      </section>
    </CfopPageLayout>
  );
}
