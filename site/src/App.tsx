import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Footer from './sections/Footer';

export default function App() {
  return (
    <div className="page">
      <main>
        <Hero />
        <About />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
