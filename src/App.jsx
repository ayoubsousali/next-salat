import DarkModeToggle from './components/common/darkModeToggle';
import Layout from './components/common/layout';
import Main from './components/Main';

function App() {
  return (
    <Layout>
      <div className="absolute top-4 right-4 z-50">
        <DarkModeToggle />
      </div>
      <Main />
    </Layout>
  );
}

export default App;
