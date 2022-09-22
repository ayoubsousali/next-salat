import Layout from './components/common/layout';
import SelectCities from './components/SelectCities';

function App() {
  return (
    <Layout>
      <div className="my-8">
        <p>next salat</p>
        <SelectCities />
      </div>
    </Layout>
  );
}

export default App;
