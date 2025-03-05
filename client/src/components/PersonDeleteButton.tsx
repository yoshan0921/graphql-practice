import {useMutation} from '@apollo/client';
import {Button, message} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {DELETE_PERSON} from '../graphql/mutations';
import {GET_PEOPLE_WITH_CARS} from '../graphql/queries';
import type {Person} from '../types';

type Props = {
  personId: string;
};

const PersonDelete = ({personId}: Props) => {
  const [, contextHolder] = message.useMessage();
  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache, {data}) {
      if (!data?.deletePerson) return;

      const existingData = cache.readQuery<{people: Person[]}>({
        query: GET_PEOPLE_WITH_CARS,
      });
      if (!existingData || !existingData.people) return;
      const updatedPeople = existingData.people.filter(
        person => person.id !== data.deletePerson.id,
      );
      cache.writeQuery({
        query: GET_PEOPLE_WITH_CARS,
        data: {people: updatedPeople},
      });
    },
    onCompleted: () => message.success('Person deleted successfully'),
    onError: error => message.error(`Error deleting person: ${error.message}`),
  });

  const handleDeletePerson = () => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      deletePerson({variables: {id: personId}});
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<DeleteOutlined />}
        style={styles.deleteButton}
        onClick={handleDeletePerson}
      />
    </>
  );
};

export default PersonDelete;

const styles = {
  deleteButton: {
    background: 'white',
    color: 'red',
    boxShadow: 'none',
  },
};
