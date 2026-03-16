import { CfopPageLayout } from '../components/CfopPageLayout';
import 'bulma/css/bulma.min.css';
import '../App.css';

// ============================================================================
// CONTENT GUARD: This implementation reuses content concepts from legacy
// notation learning materials. DO NOT copy legacy implementation patterns,
// component structures, or framework-specific code. Keep this implementation
// aligned with cfop-app architecture (CfopPageLayout, Bulma, React patterns).
// ============================================================================

/**
 * T004: Static entities for notation page content
 */
interface NotationExample {
  id: string;
  symbol: string;
  label: string;
  explanation: string;
  imageSrc?: string;
  imageAlt?: string;
}

interface NotationSection {
  id: string;
  title: string;
  description: string;
  examples: NotationExample[];
}

interface TriggerReference {
  id: string;
  name: string;
  sequence: string;
  inverse: string;
  context?: string;
}

/**
 * T005: Reusable notation example tile renderer
 */
interface NotationExampleTileProps {
  example: NotationExample;
}

function NotationExampleTile({ example }: NotationExampleTileProps) {
  return (
    <div className="box notation-example-tile">
      <div className="notation-example-symbol">
        <strong>{example.symbol}</strong>
      </div>
      {example.imageSrc && (
        <div className="notation-example-image">
          <img
            src={example.imageSrc}
            alt={example.imageAlt || `${example.label} notation`}
            onError={(e) => {
              // T006: Missing-image fallback indicator
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.image-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.textContent = '(image unavailable)';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
      )}
      <div className="notation-example-label notation-light-header">{example.label}</div>
      <div className="notation-example-explanation is-size-7">{example.explanation}</div>
    </div>
  );
}

function NotationPage() {
  // T009, T010, T011, T012: User Story 1 - Face Rotations and Modifiers
  const sections: NotationSection[] = [
    {
      id: 'face-rotations',
      title: 'Face Rotations',
      description: 'Each face of the cube can be turned clockwise (no symbol), counterclockwise (prime \'), or 180 degrees (2).',
      examples: [
        {
          id: 'face-R',
          symbol: 'R',
          label: 'Right Face',
          explanation: 'Turn the right face clockwise 90 degrees',
          imageSrc: '/cubing.spec/assets/notation/syntax-R-cw-arrow.png',
          imageAlt: 'Right face clockwise rotation'
        },
        {
          id: 'face-U',
          symbol: 'U',
          label: 'Up Face',
          explanation: 'Turn the top face clockwise 90 degrees',
          imageSrc: '/cubing.spec/assets/notation/syntax-U-cw-arrow.png',
          imageAlt: 'Up face clockwise rotation'
        },
        {
          id: 'face-F',
          symbol: 'F',
          label: 'Front Face',
          explanation: 'Turn the front face clockwise 90 degrees',
          imageSrc: '/cubing.spec/assets/notation/syntax-F-cw-arrow.png',
          imageAlt: 'Front face clockwise rotation'
        },
        {
          id: 'face-L',
          symbol: 'L',
          label: 'Left Face',
          explanation: 'Turn the left face clockwise 90 degrees',
          imageSrc: '/cubing.spec/assets/notation/syntax-L-cw-arrow.png',
          imageAlt: 'Left face clockwise rotation'
        },
        {
          id: 'face-D',
          symbol: 'D',
          label: 'Down Face',
          explanation: 'Turn the bottom face clockwise 90 degrees',
          imageSrc: '/cubing.spec/assets/notation/syntax-D-cw-arrow.png',
          imageAlt: 'Down face clockwise rotation'
        },
        {
          id: 'face-B',
          symbol: 'B',
          label: 'Back Face',
          explanation: 'Turn the back face clockwise 90 degrees',
          imageSrc: '/cubing.spec/assets/notation/syntax-B-cw-arrow.png',
          imageAlt: 'Back face clockwise rotation'
        },
      ]
    },
    {
      id: 'modifiers',
      title: 'Modifiers',
      description: 'Add these symbols after any face letter to change the direction or amount of rotation.',
      examples: [
        {
          id: 'mod-prime',
          symbol: "R'",
          label: 'Prime (Counterclockwise)',
          explanation: 'Turn the face counterclockwise 90 degrees',
          imageSrc: '/cubing.spec/assets/notation/syntax-R-ccw-arrow.png',
          imageAlt: 'Right face counterclockwise rotation'
        },
        {
          id: 'mod-double',
          symbol: 'R2',
          label: 'Double Turn (180°)',
          explanation: 'Turn the face 180 degrees (direction doesn\'t matter)',
          imageSrc: '/cubing.spec/assets/notation/syntax-R-double-arrow.png',
          imageAlt: 'Right face double turn'
        },
        {
          id: 'mod-wide',
          symbol: 'r',
          label: 'Wide Turn (lowercase)',
          explanation: 'Turn the face and middle layer together simultaneously',
          imageSrc: '/cubing.spec/assets/notation/syntax-R-wide-arrow.png',
          imageAlt: 'Right face wide turn'
        },
      ]
    },
    {
      id: 'slice-moves',
      title: 'Slice Moves',
      description: 'Turn only the middle layer between two opposite faces. Each slice follows the same direction as its corresponding face turn.',
      examples: [
        {
          id: 'slice-M',
          symbol: 'M',
          label: 'M (Middle)',
          explanation: 'Turn middle layer in same direction as L face (between R and L)',
          imageSrc: '/cubing.spec/assets/notation/syntax-M-cw-arrow.png',
          imageAlt: 'M slice turn'
        },
        {
          id: 'slice-S',
          symbol: 'S',
          label: 'S (Standing)',
          explanation: 'Turn middle layer in same direction as F face (between F and B)',
          imageSrc: '/cubing.spec/assets/notation/syntax-S-cw-arrow.png',
          imageAlt: 'S slice turn'
        },
        {
          id: 'slice-E',
          symbol: 'E',
          label: 'E (Equatorial)',
          explanation: 'Turn middle layer in same direction as D face (between U and D)',
          imageSrc: '/cubing.spec/assets/notation/syntax-E-cw-arrow.png',
          imageAlt: 'E slice turn'
        },
      ]
    },
    {
      id: 'cube-rotations',
      title: 'Cube Rotations',
      description: 'Rotate the entire cube on an axis without changing piece positions. Lowercase letters denote the axis of rotation.',
      examples: [
        {
          id: 'rotation-x',
          symbol: 'x',
          label: 'Follows R (X axis)',
          explanation: 'Rotate entire cube in same direction as R face',
          imageSrc: '/cubing.spec/assets/notation/syntax-X-cw-arrow.png',
          imageAlt: 'x cube rotation'
        },
        {
          id: 'rotation-y',
          symbol: 'y',
          label: 'Follows U (Y axis)',
          explanation: 'Rotate entire cube in same direction as U face',
          imageSrc: '/cubing.spec/assets/notation/syntax-Y-cw-arrow.png',
          imageAlt: 'y cube rotation'
        },
        {
          id: 'rotation-z',
          symbol: 'z',
          label: 'Follows F (Z axis)',
          explanation: 'Rotate entire cube in same direction as F face',
          imageSrc: '/cubing.spec/assets/notation/syntax-Z-cw-arrow.png',
          imageAlt: 'z cube rotation'
        },
      ]
    },
  ];

  const triggers: TriggerReference[] = [
    {
      id: 'sexy',
      name: 'Sexy Move',
      sequence: 'R U R\' U\'',
      inverse: 'U R U\' R\'',
      context: 'Basic insert for many OLL/PLL cases'
    },
    {
      id: 'reverse-sexy',
      name: 'Reverse Sexy',
      sequence: 'R\' U\' R U',
      inverse: 'U\' R\' U R',
      context: 'Undo or reverse insertions'
    },
    {
      id: 'sledgehammer',
      name: 'Sledgehammer',
      sequence: 'R\' F R F\'',
      inverse: 'F R\' F\' R',
      context: 'OLL or F2L slot manipulation'
    },
    {
      id: 'trigger-insert',
      name: 'Trigger Insert',
      sequence: 'R U R\'',
      inverse: 'R U\' R\'',
      context: 'F2L inserts or OLL/PLL setups'
    },
  ];

  return (
    <CfopPageLayout
      pageTitle="Notation Reference"
      subtitle="Quick reference for understanding cube notation - face turns, modifiers, slices, rotations, and triggers"
    >
      <>
        {sections.length === 0 ? (
        <div className="section">
          <h2 className="title is-4">Coming Soon</h2>
          <p>Notation reference content will be added here.</p>
        </div>
      ) : (
        sections.map((section) => (
            <div key={section.id} className="section notation-section">
              <h2 className="title is-4">{section.title}</h2>
              <p className="subtitle is-6">{section.description}</p>
              <div className="columns is-multiline">
                {section.examples.map((example) => (
                  <div key={example.id} className="column is-one-third-desktop">
                    <NotationExampleTile example={example} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {triggers.length > 0 && (
          <div className="section notation-section">
            <h2 className="title is-4">Common Triggers</h2>
            <div className="content">
              <p>Triggers are short, repeatable sequences commonly used in algorithms to manipulate pieces efficiently. They are usually enclosed in brackets. To invert any algorithm segment, you reverse the order of the moves and invert each move. Here are some of the important named ones:</p>            
              <ul className="notation-trigger-list">
              {triggers.map(trigger => (
                <li key={trigger.id} className="notation-trigger-item">
                  <div>
                    <span className="trigger-name">{trigger.name}</span>
                    <span className="trigger-context">({trigger.context})</span>
                    <span className="trigger-syntax">{trigger.sequence}</span>
                    <span className="trigger-inverse">(inverse: {trigger.inverse})</span>
                  </div>
                </li>
              ))}
            </ul>
            </div>
          </div>
        )}
      </>
    </CfopPageLayout>
  );
}

export default NotationPage;
