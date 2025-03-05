import {useQuery} from '@apollo/client';
import {Layout, Typography, Divider, Spin, message} from 'antd';
import PersonForm from '../components/PersonForm';
import CarForm from '../components/CarForm';
import PersonCard from '../components/PersonCard';
import {GET_PEOPLE_WITH_CARS} from '../graphql/queries';

const {Title, Text} = Typography;
const {Content} = Layout;

const HomePage = () => {
  const {data, loading, error} = useQuery(GET_PEOPLE_WITH_CARS);

  if (loading) return <Spin size="large" style={styles.spinner} />;
  if (error) {
    message.error(`Error: ${error.message}`);
    return <Text>Error loading data...</Text>;
  }

  return (
    <Layout style={styles.layout}>
      <Content>
        <Title level={1} style={styles.title}>
          PEOPLE AND THEIR CARS
        </Title>
        <Divider />
        <Divider style={styles.sectionDivider}>Add Person</Divider>
        <PersonForm />
        <Divider style={styles.sectionDivider}>Add Car</Divider>
        {data.people.length > 0 ? <CarForm /> : <Text>Please add Person.</Text>}
        <Divider style={styles.sectionDivider}>Records</Divider>
        {data.people.length > 0 ? (
          data.people.map((person: any) => <PersonCard key={person.id} person={person} />)
        ) : (
          <Text>No records found.</Text>
        )}
      </Content>
    </Layout>
  );
};

export default HomePage;

const styles = {
  layout: {
    padding: '20px',
    maxWidth: '1200px',
    minHeight: '100vh',
    height: '100%',
    borderLeft: '2px solid #000',
    borderRight: '2px solid #000',
    margin: 'auto',
    background: '#fff',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  sectionDivider: {
    marginTop: '30px',
    fontWeight: 'bold',
    alignItems: 'baseline',
  },
  spinner: {
    display: 'block',
    margin: 'auto',
    marginTop: '50px',
  },
};
