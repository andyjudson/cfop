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
        <CaseCards cases={CROSS_CASES} columnsClass="column is-one-third-desktop is-half-tablet" />
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
            First, solve cases where pairs are in the upper layer.
          </li>
          <li>
            If <strong>matching colours face up</strong>, hold the cube so the matched side is on the working side, push pair
            aside, open slot, insert, then close slot.
          </li>
          <li>
            If <strong>different colours face up</strong>, hold so white faces the matching side, set up the pair, insert, then
            realign the cross.
          </li>      
        </ul>
        <CaseCards cases={step1Cases} columnsClass="column is-one-quarter-desktop is-half-tablet" />

        <h3 className="title is-5 intuitive-step-title">Step 2: Setup Pairs</h3>
        <ul className="intuitive-list">
          <li>
            Second, find cases where edge-corner pairs are not in the upper layer and disconnected.
          </li>
          <li>
           When opening the slot, place the corner over the target slot, 
           then turn the upper layer 90&#176; in the direction which keeps the white visible on the side.
          </li>
          <li>
            Where you have easy inserts patterns, solve these as before, 
            otherwise you'll need to use a setup insert pattern, which we cover next.
          </li>        
        </ul>
        <CaseCards cases={step2Cases} columnsClass="column is-one-quarter-desktop is-half-tablet" />

        <h3 className="title is-5 intuitive-step-title">Step 3: Setup Inserts</h3>
        <ul className="intuitive-list">
          <li>
            Third, setup edge-corner pairs in the upper layer so that oriented and connected, ready for insert.
          </li>
          <li>
            If <strong>white is on the side and colours match</strong>, safely move the <strong>edge next</strong> to its corner
             - move the corner over the target slot, then turn the upper layer 90&#176; 
           in the direction which keeps the white visible on the side, then hide the corner in the slot, 
           so you can safely turn the upper layer to bring the edge into connected position ready for insert.
          </li>
          <li>
            If <strong>white is on the side and colours do not match</strong>, safely move the <strong>edge across</strong> from its corner
             - move the corner over the target slot, then turn the upper layer 90&#176; 
           in the direction which keeps the white visible on the side, then hide the corner in the slot, 
           so you can safely turn the upper layer to bring the edge into connected position ready for insert.
          </li>
          <li>
            If <strong>white is up</strong>, move the <strong>edge over</strong> its centre - with the colour matched on the side, rotate the edge safely into the back slot, then position the corner over the
            edge to form the pair, then rotate the edge corner pair back up ready for insert.
          </li>
        </ul>
        <CaseCards cases={step3Cases} columnsClass="column is-one-third-desktop is-half-tablet" />
      </section>
    </CfopPageLayout>
  );
}
