import { CfopPageLayout } from '../components/CfopPageLayout';
import { IntuitiveCaseCard } from '../components/AlgorithmCard';
import 'bulma/css/bulma.min.css';
import '../App.css';
import { useMemo } from 'react';

const BASE = import.meta.env.BASE_URL;

interface ExampleCase {
  id: string;
  label: string;
  image: string;
  alt: string;
  moveHint?: string;
}

const CROSS_CASES: ExampleCase[] = [
  {
    id: 'cross-solved',
    label: 'cross solved',
    image: `${BASE}assets/cfop_bgr/cross_case1.png`,
    alt: 'Cross solved: all four white edges in place.',
  },
  {
    id: 'cross-positioned-not-oriented',
    label: 'positioned not oriented',
    image: `${BASE}assets/cfop_bgr/cross_case2.png`,
    alt: 'Cross case: white edge positioned but not oriented.',
  },
  {
    id: 'cross-oriented-not-positioned',
    label: 'oriented not positioned',
    image: `${BASE}assets/cfop_bgr/cross_case3.png`,
    alt: 'Cross case: white edge oriented but in the wrong slot.',
  },
  {
    id: 'cross-flipped',
    label: 'flipped',
    image: `${BASE}assets/cfop_bgr/cross_case4.png`,
    alt: 'Cross case: white edge flipped and needs extraction and reinsertion.',
  },
];

const F2L_STEP1_CASES: ExampleCase[] = [
  {
    id: 'f2l-step1-connected-right',
    label: 'connected right pair',
    image: `${BASE}assets/cfop_bgr/f2l_case1_insert1.png`,
    alt: 'F2L easy insert: connected right pair.',
    moveHint: "U R U' R'",
  },
  {
    id: 'f2l-step1-connected-left',
    label: 'connected left pair',
    image: `${BASE}assets/cfop_bgr/f2l_case1_insert2.png`,
    alt: 'F2L easy insert: connected left pair.',
    moveHint: "U' L' U L",
  },
  {
    id: 'f2l-step1-disconnected-right',
    label: 'disconnected right pair',
    image: `${BASE}assets/cfop_bgr/f2l_case1_insert3.png`,
    alt: 'F2L easy insert: disconnected right pair.',
    moveHint: "R U R'",
  },
  {
    id: 'f2l-step1-disconnected-left',
    label: 'disconnected left pair',
    image: `${BASE}assets/cfop_bgr/f2l_case1_insert4.png`,
    alt: 'F2L easy insert: disconnected left pair.',
    moveHint: "L' U' L",
  },
];

const F2L_STEP2_CASES: ExampleCase[] = [
  {
    id: 'f2l-step2-edge-in-slot-corner-in-layer',
    label: 'edge in slot + corner in layer',
    image: `${BASE}assets/cfop_bgr/f2l_case2_stuck1.png`,
    alt: 'F2L setup: edge in slot and corner in top layer.',
    moveHint: "R U R' ...",
  },
  {
    id: 'f2l-step2-corner-in-slot-edge-in-layer',
    label: 'corner in slot + edge in layer',
    image: `${BASE}assets/cfop_bgr/f2l_case2_stuck2.png`,
    alt: 'F2L setup: corner in slot and edge in top layer.',
    moveHint: "R U R' ...",
  },
  {
    id: 'f2l-step2-pair-misaligned-in-slot',
    label: 'pair misaligned in slot',
    image: `${BASE}assets/cfop_bgr/f2l_case2_stuck3.png`,
    alt: 'F2L setup: pair misaligned in slot.',
    moveHint: "R U' R' ...",
  },
  {
    id: 'f2l-step2-pair-misaligned-in-layer',
    label: 'pair misaligned in layer',
    image: `${BASE}assets/cfop_bgr/f2l_case2_stuck4.png`,
    alt: 'F2L setup: pair misaligned in top layer.',
    moveHint: "R U2 R' ...",
  },
];

const F2L_STEP3_CASES: ExampleCase[] = [
  {
    id: 'f2l-step3-white-side-colours-match',
    label: 'white to side + colours matched',
    image: `${BASE}assets/cfop_bgr/f2l_case3_setup1.png`,
    alt: 'F2L insert setup: white to side and colours matched.',
  },
  {
    id: 'f2l-step3-white-side-colours-not-match',
    label: 'white to side + colours unmatched',
    image: `${BASE}assets/cfop_bgr/f2l_case3_setup2.png`,
    alt: 'F2L insert setup: white to side and colours unmatched.',
  },
  {
    id: 'f2l-step3-white-up',
    label: 'white is up',
    image: `${BASE}assets/cfop_bgr/f2l_case3_setup3.png`,
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
  return (
    <div className="columns is-multiline mt-3">
      {cases.map(item => {
        return (
          <div key={item.id} className={columnsClass}>
            <IntuitiveCaseCard
              label={item.label}
              image={item.image}
              alt={item.alt}
              moveHint={item.moveHint}
            />
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
      subtitle="Learn to solve first two layers with Cross and F2L pattern recognition and positional logic"
    >
      <section className="section intuitive-section">
        <h2 className="title is-4 section-title">Intuitive Cross</h2>
        <p className="intuitive-note">
          The goal of this step is to solve first-layer edges so white edges align with their matching side
          centres. The cross can always be solved in 8 moves or fewer. Keep white on bottom, start with easier
          cases, avoid disrupting solved edges, remember opposite colours (red/orange, green/blue) to avoid
          unnecessary cube rotations.
        </p>
        <ul className="intuitive-list">
          <li>
            If a <strong>white edge is positioned but not oriented</strong>, align it to the
            matching side centre and insert it into the target slot.
          </li>
          <li>
            If a <strong>white edge is oriented but not positioned</strong>, take it out and insert into the target slot.
          </li>
          <li>
            If a <strong>white edge is flipped</strong>, take it out, open the target slot, then insert into the target slot.
          </li>
        </ul>
        <CaseCards cases={CROSS_CASES} columnsClass="column is-one-quarter-desktop is-half-tablet" />
      </section>

      <section className="section intuitive-section">
        <h2 className="title is-4 section-title">Intuitive F2L</h2>
        <p className="intuitive-note">
          The goal is to solve the first two layers by pairing corners and edges, then inserting those pairs into
          slots around the cross, ignoring all yellows. Focus on repeatable patterns and setup ideas rather than memorizing long lists.
        </p>

        <h3 className="title is-5 intuitive-step-title">Step 1: Easy Inserts</h3>
        <ul className="intuitive-list">
          <li>
            Always work on pairs that are already <strong>in the top layer and disconnected</strong> first — these are the easiest to insert.
          </li>
          <li>
            <strong>Right pair</strong>: the corner's side colours match to the <em>right</em> of its target slot — hold the pair to the right and use <code>U R U&#x2019; R&#x2019;</code>. <strong>Left pair</strong>: colours match to the <em>left</em> — hold to the left and use <code>U&#x2019; L&#x2019; U L</code>.
          </li>
          <li>
            <strong>Right insert</strong> (disconnected): white faces to the right side of the slot — hold right and use <code>R U R&#x2019;</code>. <strong>Left insert</strong>: white faces to the left — hold left and use <code>L&#x2019; U&#x2019; L</code>.
          </li>
        </ul>
        <CaseCards cases={step1Cases} columnsClass="column is-one-quarter-desktop is-half-tablet" />

        <h3 className="title is-5 intuitive-step-title">Step 2: Setup Pairs</h3>
        <ul className="intuitive-list">
          <li>
            When pieces are not both in the top layer, use these extractions to get them there:
          </li>
          <li>
            <strong>Edge in middle + corner in top layer</strong>: hold the edge on the right side and do <code>R U R&#x2019;</code> — this lifts the edge out and brings both pieces to the top layer.
          </li>
          <li>
            <strong>Corner in bottom + edge in top layer</strong>: hold the edge to the left and do <code>R U R&#x2019;</code> — this extracts the corner up.
          </li>
          <li>
            <strong>Pair stuck in slot (connected)</strong>: use <code>R U&#x2019; R&#x2019;</code> — this brings both to the top layer <em>disconnected</em>. Do not use <code>R U R&#x2019;</code> here as it leaves them connected.
          </li>
          <li>
            <strong>Pair connected in top layer</strong>: hold the corner above an unsolved slot and do <code>R U2 R&#x2019;</code> — this keeps both pieces in the top layer but disconnects them.
          </li>
        </ul>
        <CaseCards cases={step2Cases} columnsClass="column is-one-quarter-desktop is-half-tablet" />

        <h3 className="title is-5 intuitive-step-title">Step 3: Setup Inserts</h3>
        <ul className="intuitive-list">
          <li>
            Once both pieces are in the top layer and disconnected, set up an easy insert by hiding the corner, repositioning the edge, then restoring the corner.
          </li>
          <li>
            <strong>White on the side</strong>: place the corner above its target slot and turn the top layer once so white is still visible on the side.
            Then look at the two top-facing colours — if they <strong>match</strong>, bring the edge <em>next to</em> the corner;
            if they <strong>differ</strong>, bring the edge <em>across from</em> the corner. Hide the corner in the slot, move the edge, restore the corner — you now have a connected pair.
          </li>
          <li>
            <strong>White facing up</strong>: align the edge to its matching centre, hide the edge into the back slot, then position the corner above that edge, restore the edge — you now have a connected pair ready to insert.
          </li>
        </ul>
        <CaseCards cases={step3Cases} columnsClass="column is-one-third-desktop is-half-tablet" />
      </section>
    </CfopPageLayout>
  );
}
