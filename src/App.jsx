import DarkModeToggle from './components/common/darkModeToggle';
import Layout from './components/common/layout';
import Main from './components/Main';

function App() {
  return (
    <Layout>
      <DarkModeToggle />
      <div className="m-8 flex justify-center">
        <Main />
      </div>
    </Layout>
  );
}

export default App;
