import PersonForm from '../components/form/PerosnForm';
import styles from './person.module.css'; 

export default function NewPersonPage() {
  return (
    <div className={styles.pageContainer}>
      <PersonForm />
    </div>
  );
}