import { CfopPageLayout } from '../components/CfopPageLayout';
import { WrEvolutionChart } from '../components/WrEvolutionChart';
import { ErrorBoundary } from '../components/ErrorBoundary';
import 'bulma/css/bulma.min.css';
import '../App.css';

export default function AboutPage() {
  return (
    <CfopPageLayout
      pageTitle="About"
      subtitle="Background on speedcubing, CFOP, and how to use this app to learn"
    >
      <section className="section about-section">
        <h2 className="title is-4 section-title">Cubing Background</h2>
        <p>
          The Rubik's Cube <img src={`${import.meta.env.BASE_URL}assets/cubing-64.png`} alt="CFOP app" className="logo-inline" />  was invented in 1974 by Hungarian sculptor and professor Ernő Rubik. Since
          the 1980s, competitive speedcubing has grown into a global sport with tens of thousands of
          competitors and insane world record times of sub-5 seconds for single and average solves in recent years.
        </p>
        <p className="mt-3">I was only 2 years old when the cube was invented and I never learnt how to solve it (legitimately) as a child. A few years ago, I was on holiday with my family, and my daughter bought me a cube (traditional, clunky design), and I was determined to learn to solve it. I found the beginner method online from JPerm and after watching that repeatedly for a few hours, I'd achieved my first solve 🤪 and was hooked. I then wanted to understand more and see if I could push times reliably in the 1 to 2 minute range. I started learning CFOP, and it's been a fun journey since, I may have upgraded to a Gan cube along the way 🤓. The methodical nature of CFOP, with its clear stages and algorithmic patterns, makes it a great fit for my learning style. The 2-look CFOP is a sweet spot for me where I can achieve good times without needing to memorise a huge number of algorithms.
        </p>
        <p className="mt-3">
          I developed this app to reinforce my learning and sharpen my engineering skills. The YouTube videos are invaluable for technique and strategy, but focusing on specific algorithms needs targeted repetition. Other sites were ugly or polluted with ads and trackers. I wanted a clean, modern, mobile-friendly space to focus on learning, and hopefully it serves others to.
          Cubing knowledge here is drawn from the excellent YouTube tutorials by <a href="https://www.youtube.com/@CubeHead" target="_blank" rel="noreferrer">CubeHead</a> (Milan Struyf) and <a href="https://www.youtube.com/@JPerm" target="_blank" rel="noreferrer">JPerm</a> (Dylan Wang).
        </p>
        <p className="mt-3">
          The app is open source — you can find the code on <a href="https://github.com/andyjudson/cubing.spec" target="_blank" rel="noreferrer">GitHub</a>. If you spot a bug, have a suggestion, or want to see a new feature, feel free to open an issue there.
        </p>
      </section>

      <section className="section about-section">
        <h2 className="title is-4 section-title">CFOP Primer</h2>
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
        <h2 className="title is-4 section-title">Practice Strategies</h2>
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
        <h2 className="title is-4 section-title">What's in this App</h2>
        <p>
          The app is structured as a learning companion across the full CFOP journey, from reading up on the
          method to practising with a timer against real competition data.
        </p>
        <ul className="about-list mt-3">
          <li>
            <strong>Notation</strong> — A reference for standard cube notation (face moves, modifiers, slice or wide moves, cube rotations) 
            with visual examples so you can read any algorithm you encounter.
          </li>
          <li>
            <strong>Intuitive Cross and F2L</strong> — The core logic for Cross and the F2L patterns explained without algorithms, 
            building spatial reasoning that underpins faster solves at any level.
          </li>
          <li>
            <strong>Beginner 2-Look</strong> — The minimal algorithm set for solving OLL and PLL in two passes 
            with consistent sub-2-minute solves, covering the 10 OLL cases and 6 PLL cases, with notes for each.
          </li>
          <li>
            <strong>Full F2L / OLL / PLL</strong> — The complete algorithm libraries: 41 F2L cases, 57 OLL
            cases, and 21 PLL cases, with case diagrams and notation.
          </li>
          <li>
            <strong>Algorithm Visualiser</strong> — Select any OLL or PLL algorithm and watch a 3D cube
            execute the moves step by step, powered by the cubing.js engine. A useful companion to the
            algorithm pages when you want to see exactly how a case plays out.
          </li>
          <li>
            <strong>Practice Timer</strong> — Two modes in one. <em>Standard mode</em> generates random
            scrambles with a space-bar timer and rolling stats (last time, best time, ao5).{' '}
            <em>Champion mode</em> (just for fun) loads the actual scrambles from a real WCA
            competition final. Complete the set of 5 scrambles and see how your times compare to the event winner 
            and the world record at the time (not necessarily set at that event or by the winner).
            WCA events with scrambles go back to 2015 with over 50 international competition finals available to you.
          </li>
          <li>
            <strong>WCA Records Chart</strong> — A visualisation of how the 3×3 world record single and
            average times have evolved since the WCA was founded, sourced from official WCA data.
          </li>
        </ul>
      </section>

      <section className="section about-section">
        <h2 className="title is-4 section-title">Video Resources</h2>
        <p>
          These tutorials from CubeHead are the recommended companion videos to the content in this app. They cover intuitive methods, 2-look and 1-look OLL and PLL, and useful tips for improving your solves. These are a great starting point for learning CFOP, and the intuitive methods are especially helpful for building a strong foundation before diving into algorithm memorisation. The videos are well-structured and beginner-friendly, making them an excellent resource for cubers at all levels.
        </p>
        <p className="mt-3">
          Last year he launched his own cubing web app - <a href="https://www.cube.academy" target="_blank" rel="noreferrer">Cube Academy</a>. With a background in software and design (ex-Apple), he's built something clean and content-rich. The paywall wasn't for me but he's been sharing great content for free for years, and he deserves to be recognized for it. From what he's been sharing lately, the <a href="https://www.youtube.com/live/HtMHywhjqro" target="_blank" rel="noreferrer">roadmap</a> looks genuinely exciting — timers, learning progression, and a polished user experience that will be worth following.
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
        <h2 className="title is-4 section-title">World Cube Association</h2>
        <p className="mt-3">
          The <a href="https://www.worldcubeassociation.org/" target="_blank" rel="noreferrer">World Cube Association (WCA)</a> was established in 2004 to govern official competitions across hundreds of events, tracking times from the casual minute-plus range all the way to recent <a href="https://www.worldcubeassociation.org/results/records?event_id=333&show=mixed+history" target="_blank" rel="noreferrer">world records</a> in the 5-3 seconds range for single solves and 4-5 seconds for averages - 🤯 just incredible!! CFOP is the method used by the vast majority of top competitors, so these records are a testament to the method's efficiency, the skill of its practitioners, and the shifts in cube engineering.
        </p>        
        <ErrorBoundary><WrEvolutionChart /></ErrorBoundary>
      </section>

    </CfopPageLayout>
  );
}
