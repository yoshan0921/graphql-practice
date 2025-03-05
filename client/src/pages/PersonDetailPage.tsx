import {useQuery} from '@apollo/client';
import {useParams, useNavigate} from 'react-router';
import {Layout, Typography, Button, Spin, message, Row, Col, Card} from 'antd';
import {GET_PERSON_WITH_CARS} from '../graphql/queries';
import type {Car} from '../types';

const {Title, Text} = Typography;
const {Content} = Layout;

const PersonDetailPage = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  const {data, loading, error} = useQuery(GET_PERSON_WITH_CARS, {
    variables: {id},
  });

  if (loading) return <Spin size="large" style={styles.spinner} />;
  if (error) {
    message.error(`Error: ${error.message}`);
    return <Text>Error loading data...</Text>;
  }
  if (!data?.person) return <Text>Person not found.</Text>;

  const person = data.person;

  return (
    <Layout style={styles.layout}>
      <Content style={styles.content}>
        <Title level={1} style={styles.title}>
          {person.firstName} {person.lastName}
        </Title>
        <Title level={3} style={styles.sectionTitle}>
          Owned Cars:
        </Title>
        {person.cars.length > 0 ? (
          <Row gutter={[16, 16]} justify="start">
            {person.cars.map((car: Car) => (
              <Col key={car.id} xs={24} sm={12} md={8}>
                <Card style={styles.carCard}>
                  <Row>
                    <Col span={12}>
                      <Text style={styles.label}>Year:</Text>
                    </Col>
                    <Col span={12} style={styles.value}>
                      <Text>{car.year}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text style={styles.label}>Make:</Text>
                    </Col>
                    <Col span={12} style={styles.value}>
                      <Text>{car.make}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text style={styles.label}>Model:</Text>
                    </Col>
                    <Col span={12} style={styles.value}>
                      <Text>{car.model}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text style={styles.label}>Price:</Text>
                    </Col>
                    <Col span={12} style={styles.value}>
                      <Text>${parseFloat(car.price).toLocaleString()}</Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Content style={styles.noCarMsg}>
            <Text>No cars owned</Text>
          </Content>
        )}

        <Button type="default" style={styles.backButton} onClick={() => navigate('/')}>
          Go Back Home
        </Button>
      </Content>
    </Layout>
  );
};

export default PersonDetailPage;

const styles = {
  layout: {
    padding: '20px',
    maxWidth: '1200px',
    minHeight: '100vh',
    height: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    // borderLeft: '2px solid #000',
    // borderRight: '2px solid #000',
    margin: 'auto',
    background: '#fff',
    textAlign: 'center' as const,
  },
  content: {
    width: '100%',
    background: '#fff',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: '#fafafa',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'left' as const,
  },
  carCard: {
    textAlign: 'left' as const,
    padding: '15px',
    background: '#fafafa',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  label: {
    fontSize: '1rem',
    textAlign: 'left' as const,
    fontWeight: 'normal',
  },
  value: {
    fontSize: '1rem',
    textAlign: 'right' as const,
  },
  noCarMsg: {
    marginBottom: '15px',
  },
  backButton: {
    width: '33%',
    marginTop: '20px',
  },
  spinner: {
    display: 'block',
    margin: 'auto',
    marginTop: '50px',
  },
};
