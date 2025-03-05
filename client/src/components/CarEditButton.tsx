import {useState} from 'react';
import {Button, Modal} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import CarForm from './CarForm';
import type {Car} from '../types';

type Props = {
  car: Car;
  personId: string;
};

const CarEditButton = ({car, personId}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Button
        type="primary"
        icon={<EditOutlined />}
        style={styles.editButton}
        onClick={() => setIsEditing(true)}
      />
      <Modal
        title="Edit Car"
        width={350}
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}>
        <CarForm personId={personId} car={car} onEditComplete={() => setIsEditing(false)} />
      </Modal>
    </>
  );
};

export default CarEditButton;

const styles = {
  editButton: {
    background: 'white',
    color: 'gray',
    boxShadow: 'none',
  },
};
