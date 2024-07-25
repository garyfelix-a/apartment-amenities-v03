import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Reviews } from './components/client-side/Reviews';
// import { SampleReviews } from './components/client-side/SampleReviews';
import ApartmentAmenities from './components/client-side/ApartmentAmenities';
// import Form from './components/client-side/Form';

function App() {

  return (
    <>
        <Router>
          <Routes>
            <Route path='' element={<ApartmentAmenities />} />
            {/* <Route path='/reviews' element={<Reviews />} /> */}
            {/* <Route path='/form' element={<Form />} /> */}
          </Routes>
        </Router>
    </>
  )
}

export default App
