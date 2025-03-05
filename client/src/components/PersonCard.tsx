import {Card, Typography, List, Layout} from 'antd';
import {Link} from 'react-router';
import PersonEditButton from './PersonEditButton';
import CarEditButton from './CarEditButton';
import CarDeleteButton from './CarDeleteButton';
import PersonDeleteButton from './PersonDeleteButton';
import type {Person} from '../types';

const {Text} = Typography;
const {Content} = Layout;

type Props = {
  person: Person;
};

const PersonCard = ({person}: Props) => {
  return (
    <>
      <Card
        title={
          <Text style={styles.text}>
            {person.firstName} {person.lastName}
          </Text>
        }
        style={styles.card}
        actions={[
          <PersonEditButton person={person} />,
          <PersonDeleteButton personId={person.id} />,
        ]}>
        {person.cars.length > 0 ? (
          <List
            dataSource={person.cars}
            renderItem={car => (
              <Card
                type="inner"
                title={
                  <Text style={styles.text}>
                    {car.year} {car.make} {car.model} -{'>'} $
                    {parseFloat(car.price).toLocaleString()}
                  </Text>
                }
                style={styles.card}
                actions={[
                  <CarEditButton car={car} personId={person.id} />,
                  <CarDeleteButton carId={car.id} />,
                ]}
              />
            )}
          />
        ) : (
          <Content style={styles.noCarMsg}>
            <Text>No cars owned</Text>
          </Content>
        )}
        <Link to={`/people/${person.id}`}>LEARN MORE</Link>
      </Card>
    </>
  );
};

export default PersonCard;

const styles = {
  card: {
    textAlign: 'left' as const,
    marginBottom: '15px',
  },
  noCarMsg: {
    marginBottom: '15px',
  },
  text: {
    fontWeight: 'normal',
  },
};
