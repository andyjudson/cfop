import { CfopPageLayout } from '../components/CfopPageLayout';
import 'bulma/css/bulma.min.css';
import '../App.css';

export default function AboutPage() {
  return (
    <CfopPageLayout
      pageTitle="About"
      subtitle="Background on speedcubing, CFOP, and how to use this app to learn"
    >
      <section className="section about-section">
        <h2 className="title is-4 has-text-centered section-title">Cubing Background</h2>
        <p>
          The Rubik's Cube <img src={`${import.meta.env.BASE_URL}assets/cubing-64.png`} alt="CFOP app" className="logo-inline" />  was invented in 1974 by Hungarian sculptor and professor Ernő Rubik. Since
          the 1980s, competitive speedcubing has grown into a global sport with tens of thousands of
          competitors and insane world record times of sub-5 seconds for single and average solves in recent years.
        </p>
        <p className="mt-3">I was a child only 2 years old when the cube was invented and I never learnt how to solve it (legitimately) as a child. A few years ago, I was on holiday with my family, and my daughter bought me a Rubik's cube (traditional, clunky design), and I was determined to learn to solve it. I found the beginner method online from JPerm and after watching that repeated for a few hours, I'd achieved my first solve 🤪 and was hooked. I then wanted to understand more and see if I could push times reliably in the 1 to 2 minute range. I started learning CFOP, and it's been a fun journey since, I may have upgraded to a Gan cube along the way 🤓. The methodical nature of CFOP, with its clear stages and algorithmic patterns, makes it a great fit for my learning style. The 2-look CFOP is a sweet spot for me where I can achieve good times without needing to memorise a huge number of algorithms.
        </p>
        <p className="mt-3">
          I've developed this app to reinforce my learning and track my progress, whilst also nurturing my engineering skills - the YouTube videos have been invaluable for learning techniques and strategies, but I found focusing on specific algorithms and techniques was tedious as it needs targeted repetition many times, and other sites were cluttered or covered in ads with trackers. I wanted a clean, modern and mobile friendly environment, to let me focus on learning, and hopefully it serves others well too. Cubing knowledge here is drawn from the excellent YouTube tutorials by <a href="https://www.youtube.com/@CubeHead" target="_blank" rel="noreferrer">CubeHead</a> (Milan Struyf) and <a href="https://www.youtube.com/@JPerm" target="_blank" rel="noreferrer">JPerm</a> (Dylan Wang).
        </p>
      </section>

      <section className="section about-section">
        <h2 className="title is-4 has-text-centered section-title">CFOP Primer</h2>
        <p>
          CFOP is the dominant 3×3 speedcubing method used by most top competitors. Developed around
          1981, it breaks the solve into four stages executed in sequence:
        </p>
        <ul className="about-list mt-3">
          <li>
            <strong>Cross</strong> — Position four edge pieces on the bottom face (white) with their corresponding side face.
            Solved intuitively in 8 moves or fewer.
          </li>
          <li>
            <strong>First Two Layers (F2L)</strong> — Insert edge-corner pairs into the slots
            around the cross. 41 algorithmic cases, or 4 patterns using the intuitive method.
          </li>
          <li>
            <strong>Orientation of Last Layer (OLL)</strong> — Orient all last-layer pieces so the
            top face is one colour (yellow). 57 cases total, or 10 cases using 2-look method.
          </li>
          <li>
            <strong>Permutation of Last Layer (PLL)</strong> — Reposition last-layer pieces into
            their correct places. 21 cases total, or 6 cases using 2-look method.
          </li>
        </ul>
        <p>
          There are different levels at which you can learn CFOP, suited to different stages of your journey:
        </p>
        <ul className="about-list mt-3">
          <li>
            <strong>Intuitive Cross + F2L</strong> — Learn to solve the first two layers without
            memorising algorithms, using pattern recognition and logical thinking.
          </li>
          <li>
            <strong>2-Look CFOP</strong> — The recommended starting point for the last layer. Uses 2-Look OLL and PLL with only 9–12
            algorithms. Achievable in 1–2 minutes per solve, with the probability of repetition.
          </li>
          <li>
            <strong>1-Look CFOP</strong> — If you have mastered muscle memory, learn all 57 OLL and 21 PLL cases plus algorithmic F2L for
            maximum efficiency. Achieving consistent sub-30-second solves typically requires this level of mastery.
          </li>
        </ul>
      </section>

      <section className="section about-section">
        <h2 className="title is-4 has-text-centered section-title">Practice Strategies</h2>
        <p>Repetition is the core theme — consistent reps build recognition and muscle memory.</p>
        <div className="columns mt-3">
          <div className="column">
            <h3 className="title is-5 mb-2">Focused algorithm practice</h3>
            <ul className="about-list">
              <li>Set focused weekly goals to improve one F2L intuition or lock in PLL recognition.</li>
              <li>Start slow for accuracy and finger placement, then increase speed gradually.</li>
              <li>Repeat each algorithm 10–20 times in one session to build muscle memory.</li>
              <li>Watch the pieces move as you execute to strengthen visual and logical understanding.</li>
              <li>Work on efficient finger tricks and reduce unnecessary cube rotations.</li>
            </ul>
          </div>
          <div className="column">
            <h3 className="title is-5 mb-2">Random scramble practice</h3>
            <ul className="about-list">
              <li>Scramble and practice one stage at a time — Cross, F2L, OLL, or PLL.</li>
              <li>Set measurable targets e.g. Cross under 8 moves, F2L under 30 seconds.</li>
              <li>Use a timer for full solves to track your progress over time.</li>
              <li>Analyze your solves to identify areas for improvement and adjust your practice accordingly.</li>
              <li>Beat the champions e.g. challenge yourself with scrambles and times from event finals.</li>
              <li>Have fun and celebrate milestones, whether it's mastering a new algorithm or achieving a personal best time!</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section about-section">
        <h2 className="title is-4 has-text-centered section-title">Video Resources</h2>
        <p>
          These tutorials from CubeHead<img src={`${import.meta.env.BASE_URL}assets/cubehead.png`} alt="CubeHead" className="logo-inline" /> are the recommended companion videos to the content in this app. They cover intuitive methods, 2-look and 1-look OLL and PLL, and useful tips for improving your solves. These are a great starting point for learning CFOP, and the intuitive methods are especially helpful for building a strong foundation before diving into algorithm memorisation. The videos are well-structured and beginner-friendly, making them an excellent resource for cubers at all levels.
        </p>
        <div className="columns mt-3">
          <div className="column">
            <h4 className="title is-5 mb-2">Beginner methods</h4>
            <ul className="about-list">
              <li><a href="https://youtu.be/M-vKaV2NbEo?si=nl3wJYTtbmRZKT2k" target="_blank" rel="noreferrer">Intuitive Cross</a></li>
              <li><a href="https://youtu.be/ReOZZHscIGk?si=stALTuOW_Z75eiL9" target="_blank" rel="noreferrer">Intuitive F2L</a></li>
              <li><a href="https://youtu.be/6PSBaxlBqRg?si=s3rRGgffgKjKl6KM" target="_blank" rel="noreferrer">Beginner 2-Look OLL</a></li>
              <li><a href="https://youtu.be/ZC9nwou59ow?si=GTKodwgH84Rwp6Yt" target="_blank" rel="noreferrer">Beginner 2-Look PLL</a></li>
              <li><a href="https://youtu.be/4ULKZ1dZs04?si=CmYU8pE21nfhd5Os" target="_blank" rel="noreferrer">Beginner Tips</a></li>
            </ul>
          </div>
          <div className="column">
            <h4 className="title is-5 mb-2">Advanced methods</h4>
            <ul className="about-list">
              <li><a href="https://youtu.be/3tYj-9f4dA0?si=J8aRw_oeWwpwNVc4" target="_blank" rel="noreferrer">All F2L Cases</a></li>
              <li><a href="https://youtu.be/Q947zZRYMdg?si=CApmtY2UWRpol3mW" target="_blank" rel="noreferrer">All OLL Cases</a></li>
              <li><a href="https://youtu.be/QVXKNAjl_0k?si=1yIu1ZEbDqsId0p9" target="_blank" rel="noreferrer">All PLL Cases</a></li>
              <li><a href="https://youtu.be/HDlDcRhCR0Q?si=AELW7sNZKT-b9XxS" target="_blank" rel="noreferrer">Advanced Tips</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section about-section">
        <h2 className="title is-4 has-text-centered section-title">World Cube Association</h2>
        <p className="mt-3">
          The <a href="https://www.worldcubeassociation.org/" target="_blank" rel="noreferrer">World Cube Association (WCA)</a> was established in 2004 to govern official competitions across hundreds of events, tracking times from the casual minute-plus range all the way to recent <a href="https://www.worldcubeassociation.org/results/records?event_id=333&show=mixed+history" target="_blank" rel="noreferrer">world records</a> in the 5-3 seconds range for single solves and 4-5 seconds for averages. CFOP is the method used by the vast majority of top competitors, so these records are a testament to the method's efficiency and the skill of its practitioners.
        </p>
       <p className="mt-3">
          The scramble/timer feature uses the same 20-move WCA-style scramble format, so your practice environment closely mirrors competition conditions, with time tracking for both single solves and averages over last-5 solves. 
        </p>
      </section>

    </CfopPageLayout>
  );
}
