import { Routes, Route } from 'react-router-dom';
import Header from '../components/header/Header';
import App from '../App';
import NewPersonPage from '../pages/Person';
import Transaction from '../pages/Transaction'

export default function MainRoutes() {
  return (
    <>
      <Header />
      
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/person" element={<NewPersonPage />} />
        <Route path="/transaction" element={<Transaction/>}/>
      </Routes>
    </>
  );
}