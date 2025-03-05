import {useMutation} from '@apollo/client';
import {Button, message} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {DELETE_CAR} from '../graphql/mutations';
import {GET_PEOPLE_WITH_CARS} from '../graphql/queries';
import type {Person} from '../types';

type Props = {
  carId: string;
};

const CarDelete = ({carId}: Props) => {
  const [, contextHolder] = message.useMessage();
  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, {data}) {
      if (!data?.deleteCar) return;

      const existingData = cache.readQuery<{people: Person[]}>({
        query: GET_PEOPLE_WITH_CARS,
      });
      if (!existingData) return;
      const updatedPeople = existingData.people.map(person => ({
        ...person,
        cars: person.cars.filter(car => car.id !== data.deleteCar.id),
      }));
      cache.writeQuery({
        query: GET_PEOPLE_WITH_CARS,
        data: {people: updatedPeople},
      });
    },
    onCompleted: () => message.success('Car deleted successfully'),
    onError: error => message.error(`Error deleting car: ${error.message}`),
  });

  const handleDeleteCar = () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      deleteCar({variables: {id: carId}});
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<DeleteOutlined />}
        style={styles.deleteButton}
        onClick={handleDeleteCar}
      />
    </>
  );
};

export default CarDelete;

const styles = {
  deleteButton: {
    background: 'white',
    color: 'red',
    boxShadow: 'none',
  },
};
